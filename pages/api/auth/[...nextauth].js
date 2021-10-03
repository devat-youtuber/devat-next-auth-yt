import NextAuth from "next-auth"
import Providers from "next-auth/providers"

export default NextAuth({
  session: {
    jwt: true
  },
  providers: [
    // OAuth authentication providers
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    })
  ],
  pages: {
    signIn: '/login'
  },
  // SQL or MongoDB database (or leave empty)
  database: process.env.DATABASE_URL,
})