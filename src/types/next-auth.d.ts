import "next-auth/jwt";
import "next-auth";
// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    userRole?: "admin";
  }
}

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      id: string;
    };
    expires: string;
  }
}
