import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { toast } from "react-toastify";

const authOptions: AuthOptions = {
  providers: [
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        console.log("credentials", credentials);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENT}/auth/password`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Server response:", errorText);
            return null;
          }

          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            console.error("Invalid content type:", contentType);
            return null;
          }

          const data = await response.json();
          return data.user;
        } catch (error) {
          console.error("Lỗi đăng nhập:", error);
          return null;
        }
      },
    }),
  ],
  // đăng nhập bằng google hoặc github
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: token,
      };
    },
    async jwt({ token, account, user }) {
      console.log("token:", token);
      console.log("account:", account);
      console.log("account:", user);

      if (account && user) {
        // Nếu đăng nhập bằng credentials
        if (account.type === "credentials") {
          return user;
        }

        // Nếu đăng nhập bằng OAuth (Google/Github)
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENT}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${
                  account.provider === "github"
                    ? account.access_token
                    : account.id_token
                }`,
              },
              body: JSON.stringify({
                provider: account.provider,
              }),
            }
          );

          const data = await response.json();
          console.log("OAuth login response:", data);

          if (!data.ok) {
            console.error("OAuth login failed:", data);
            throw new Error(data.message || "Đăng nhập thất bại");
          }

          return data.user;
        } catch (error) {
          toast.error("đã có lỗi xảy ra");

          console.error("Auth error:", error);
          throw error;
        }
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
