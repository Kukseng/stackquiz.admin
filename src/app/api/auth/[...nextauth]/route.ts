// src/app/api/auth/[...nextauth]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/** Force runtime execution */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// ============================================================
// Environment Variable Validation
// ============================================================
const requiredEnvVars = [
  "NEXTAUTH_SECRET",
  "NEXT_PUBLIC_API_URL",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(
      `[NextAuth Config] Missing required environment variable: ${varName}`
    );
  }
});

// ============================================================
// Helper Functions
// ============================================================
function resolveApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL must be set");
  }
  return base.replace(/\/+$/, "");
}

// Decode JWT without verification (for reading roles)
function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('[NextAuth] Error decoding JWT:', error);
    return null;
  }
}

function hasAdminRole(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded) {
    return false;
  }
  
  const roles = decoded.realm_access?.roles || [];
  const hasAdmin = roles.includes('ADMIN');
  
  console.log('[NextAuth] Checking admin role:', {
    roles,
    hasAdmin,
    email: decoded.email || decoded.preferred_username
  });
  
  return hasAdmin;
}

// Token refresh helper
async function refreshAccessToken(token: any) {
  try {
    const base = resolveApiBase();
    const url = `${base}/auth/refresh`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.apiRefreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    const newAccessToken = refreshedTokens.data.access_token;
    
    // Check if refreshed token still has ADMIN role
    if (!hasAdminRole(newAccessToken)) {
      console.error('[NextAuth] User lost ADMIN role after refresh');
      return {
        ...token,
        error: "NoAdminRole",
      };
    }

    const decoded = decodeJWT(newAccessToken);

    return {
      ...token,
      apiAccessToken: newAccessToken,
      apiAccessTokenExpires: Date.now() + (refreshedTokens.data.expires_in ?? 3600) * 1000,
      apiRefreshToken: refreshedTokens.data.refresh_token ?? token.apiRefreshToken,
      realm_access: decoded?.realm_access,
      resource_access: decoded?.resource_access,
    };
  } catch (error) {
    console.error("[NextAuth] Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.error("[CredentialsProvider] Missing credentials");
          throw new Error("Username and password are required");
        }

        try {
          const res = await fetch(`${resolveApiBase()}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error(`[CredentialsProvider] Login failed: ${res.status}`, errorData);
            
            if (res.status === 401) {
              throw new Error("Not allow normal users");
            }
            throw new Error("CredentialsSignin");
          }

          const json = await res.json();
          const data = json.data;

          if (!data || !data.access_token) {
            console.error("[CredentialsProvider] No access token in response");
            throw new Error("Authentication failed");
          }

          // Decode JWT to extract user info and roles
          const decoded = decodeJWT(data.access_token);
          const userEmail = decoded?.email || decoded?.preferred_username || credentials.username;
          const userRoles = decoded?.realm_access?.roles || [];

          // CHECK IF USER HAS ADMIN ROLE IN JWT
          if (!hasAdminRole(data.access_token)) {
            console.error(`[CredentialsProvider] Access denied for user: ${userEmail}`, {
              availableRoles: userRoles,
              requiredRole: 'ADMIN'
            });
            throw new Error("AccessDenied");
          }

          console.log(`[CredentialsProvider] ADMIN user authenticated: ${userEmail}`);

          return {
            id: data.userId ?? decoded?.sub ?? credentials.username,
            name: decoded?.name ?? data.name ?? credentials.username,
            email: decoded?.email ?? data.email ?? null,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            apiAccessToken: data.access_token,
            apiRefreshToken: data.refresh_token,
            expiresIn: data.expires_in ?? 3600,
            realm_access: decoded?.realm_access,
            resource_access: decoded?.resource_access,
          };
        } catch (e: any) {
          console.error("[CredentialsProvider] Login exception:", e.message);
          // Preserve specific error messages, especially for admin role check
          throw e;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Handle initial sign-in with credentials
      if (user) {
        const email = (user as any)?.email ?? token.email ?? null;

        token.apiAccessToken = (user as any).apiAccessToken;
        token.apiRefreshToken = (user as any).apiRefreshToken;
        token.apiAccessTokenExpires = Date.now() + ((user as any).expiresIn ?? 3600) * 1000;
        token.userId = (user as any).id;
        token.email = email;
        token.realm_access = (user as any).realm_access;
        token.resource_access = (user as any).resource_access;
        
        console.log(`[NextAuth] JWT created for ADMIN user: ${email}`);
        return token;
      }

      // Handle token refresh
      if (token.apiAccessTokenExpires && Date.now() > (token.apiAccessTokenExpires as number)) {
        console.log("[NextAuth] Token expired, refreshing...");
        return refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      // Check for admin role error
      if (token.error === "NoAdminRole") {
        throw new Error("Access denied. Your administrator privileges have been revoked. Please contact system support.");
      }

      if (token.error === "RefreshAccessTokenError") {
        throw new Error("Your session has expired. Please sign in again.");
      }

      // Pass token data to session
      (session as any).apiAccessToken = token.apiAccessToken ?? null;
      (session as any).apiRefreshToken = token.apiRefreshToken ?? null;
      (session as any).userId = token.userId ?? null;
      (session as any).isRegistered = !!token.apiAccessToken;
      (session as any).email = token.email ?? session.user?.email ?? null;
      (session as any).error = token.error ?? null;

      // Update user info with roles
      if (session.user) {
        session.user.email = token.email ?? session.user.email;
        (session.user as any).id = token.userId ?? (session.user as any).id;
        (session.user as any).realm_access = token.realm_access;
        (session.user as any).resource_access = token.resource_access;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`[NextAuth] ADMIN user signed in:`, {
        userId: user.id,
        email: user.email,
        roles: (user as any)?.realm_access?.roles,
      });
    },
    async signOut({ token }) {
      console.log(`[NextAuth] User signed out:`, {
        userId: (token as any)?.userId,
        email: (token as any)?.email,
        roles: (token as any)?.realm_access?.roles,
      });
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };