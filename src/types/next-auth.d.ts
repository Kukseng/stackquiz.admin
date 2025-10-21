// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    apiAccessToken?: string;
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      realm_access?: {
        roles: string[];
      };
      resource_access?: {
        [key: string]: {
          roles: string[];
        };
      };
    };
  }

  interface User {
    id?: string;
    accessToken?: string;
    realm_access?: {
      roles: string[];
    };
    resource_access?: {
      [key: string]: {
        roles: string[];
      };
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    apiAccessToken?: string;
    realm_access?: {
      roles: string[];
    };
    resource_access?: {
      [key: string]: {
        roles: string[];
      };
    };
  }
}