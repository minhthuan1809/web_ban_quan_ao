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
    // Kiểm tra token trước khi tạo session
    async session({ token }: { session: any; token: any }) {
      // Nếu token có lỗi, không cho phép tạo session
      if (token.error) {
        throw new Error("Xác thực thất bại");
      }
      return token;
    },
    // xử lý token và chặn đăng nhập nếu có lỗi
    async jwt({ token, account }) {
      try {
        if (account?.id_token) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENT}/auth/login`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${account.id_token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Lỗi xác thực từ server");
          }

          const data = await response.json();

          // Sử dụng dữ liệu từ server thay vì tạo timestamp mới
          return {
            ...token,
            ...data,
          };
        }
      } catch (error) {
        console.error("Lỗi trong quá trình xác thực:", error);
        token.error = "AuthError";
      }

      return token;
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
