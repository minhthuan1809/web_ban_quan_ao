import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error("Missing GitHub authentication environment variables");
}

const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    ...(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: token,
      };
    },
    async jwt({ account, token }) {
      try {
        if (account?.id_token) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENT}/auth/login`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${account.id_token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const data = await response.json();
          token = data.data.user;
          return token;
        }
        return token;
      } catch (error) {
        console.log("error", error);
        return token;
      }
    },
  },

  pages: {
    signIn: "/",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
