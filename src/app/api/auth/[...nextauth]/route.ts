// src/app/api/auth/[...nextauth]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

/** Force runtime execution */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// ============================================================
// Environment Variable Validation
// ============================================================
const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GH_CLIENT_ID",
  "GH_CLIENT_SECRET",
  "FACEBOOK_CLIENT_ID",
  "FACEBOOK_CLIENT_SECRET",
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

async function post(path: string, body: unknown) {
  const base = resolveApiBase();
  const url = `${base}/${String(path).replace(/^\/+/, "")}`;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "NextAuth-Client/1.0",
      },
      cache: "no-store",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errMsg = await res.text();
      console.error(
        `[NextAuth] API call failed: ${res.status} ${res.statusText} for ${url}\n${errMsg}`
      );
    }
    
    return res;
  } catch (error) {
    console.error(`[NextAuth] Network error calling ${url}:`, error);
    throw error;
  }
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

    return {
      ...token,
      apiAccessToken: refreshedTokens.data.access_token,
      apiAccessTokenExpires: Date.now() + (refreshedTokens.data.expires_in ?? 3600) * 1000,
      apiRefreshToken: refreshedTokens.data.refresh_token ?? token.apiRefreshToken,
    };
  } catch (error) {
    console.error("[NextAuth] Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// ============================================================
// NextAuth Configuration
// ============================================================
const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { 
        params: { 
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        } 
      },
    }),
    GitHubProvider({
      clientId: process.env.GH_CLIENT_ID!,
      clientSecret: process.env.GH_CLIENT_SECRET!,
      authorization: { 
        params: { 
          scope: "read:user user:email" 
        } 
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: { 
        params: { 
          scope: "public_profile,email" 
        } 
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.error("[CredentialsProvider] Missing credentials");
          return null;
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
            console.error(`[CredentialsProvider] Login failed: ${res.status}`);
            return null;
          }

          const json = await res.json();
          const data = json.data;

          if (!data || !data.access_token) {
            console.error("[CredentialsProvider] No access token in response");
            return null;
          }

          return {
            id: data.userId ?? data.email ?? credentials.username,
            name: data.name ?? data.username ?? credentials.username,
            email: data.email ?? null,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            apiAccessToken: data.access_token,
            apiRefreshToken: data.refresh_token,
            expiresIn: data.expires_in ?? 3600,
          };
        } catch (e) {
          console.error("[CredentialsProvider] Login exception:", e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Handle initial sign-in
      if (account && user) {
        const email =
          (user as any)?.email ??
          (profile as any)?.email ??
          token.email ??
          null;

        // Credentials provider - token already in user object
        if (account.provider === "credentials") {
          token.apiAccessToken = (user as any).apiAccessToken;
          token.apiRefreshToken = (user as any).apiRefreshToken;
          token.apiAccessTokenExpires = Date.now() + ((user as any).expiresIn ?? 3600) * 1000;
          token.userId = (user as any).id;
          token.email = email;
          
          console.log(`[NextAuth] Credentials login success for: ${email}`);
          return token;
        }

        // OAuth providers - register/exchange with backend
        if (email) {
          const givenName =
            (profile as any)?.given_name ??
            (profile as any)?.first_name ??
            (user as any)?.name?.split(" ")?.[0] ??
            "";
          const familyName =
            (profile as any)?.family_name ??
            (profile as any)?.last_name ??
            (user as any)?.name?.split(" ")?.slice(1).join(" ") ??
            "";
          const baseUsername =
            token.name ?? (user as any)?.name ?? email.split("@")[0];
          const provider = account.provider;

          try {
            console.log(
              `[NextAuth] Registering OAuth user: ${email} with provider: ${provider}`
            );
            
            const r = await post("auth/oauth/register", {
              email,
              firstName: givenName,
              lastName: familyName,
              username: baseUsername,
              provider,
              providerId: account.providerAccountId,
              image: (user as any)?.image ?? null,
            });

            if (r.ok) {
              const data = await r.json();
              const payload = (data as any).data ?? data;
              
              token.apiAccessToken = payload.accessToken ?? payload.access_token ?? null;
              token.apiRefreshToken = payload.refreshToken ?? payload.refresh_token ?? null;
              token.apiAccessTokenExpires = Date.now() + (payload.expiresIn ?? payload.expires_in ?? 3600) * 1000;
              token.email = email;
              token.userId = payload.userId ?? payload.user_id ?? null;
              
              console.log(`[NextAuth] OAuth registration success for: ${email}`);
            } else {
              console.error(`[NextAuth] OAuth registration failed for: ${email}`);
              token.error = "OAuthRegistrationError";
            }
          } catch (e) {
            console.error(`[NextAuth] OAuth registration exception for: ${email}`, e);
            token.error = "OAuthRegistrationError";
          }
        }
      }

      // Handle token refresh
      if (token.apiAccessTokenExpires && Date.now() > (token.apiAccessTokenExpires as number)) {
        console.log("[NextAuth] Token expired, refreshing...");
        return refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      // Pass token data to session
      (session as any).apiAccessToken = token.apiAccessToken ?? null;
      (session as any).apiRefreshToken = token.apiRefreshToken ?? null;
      (session as any).userId = token.userId ?? null;
      (session as any).isRegistered = !!token.apiAccessToken;
      (session as any).email = token.email ?? session.user?.email ?? null;
      (session as any).error = token.error ?? null;

      // Update user info
      if (session.user) {
        session.user.email = token.email as string ?? session.user.email;
        (session.user as any).id = token.userId ?? (session.user as any).id;
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
    async signIn({ user, account }) {
      console.log(`[NextAuth] User signed in:`, {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
      });
    },
    async signOut({ token }) {
      console.log(`[NextAuth] User signed out:`, {
        userId: (token as any)?.userId,
        email: (token as any)?.email,
      });
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

// Only export GET and POST handlers for Next.js App Router
export { handler as GET, handler as POST };