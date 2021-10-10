import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { html, text } from '../../../utils/htmlEmail'
import nodemailer from "nodemailer"
import connectDB from '../../../config/connectDB'
import Users from '../../../models/userModel'
import bcrypt from 'bcrypt'

connectDB()

export default NextAuth({
  session: {
    jwt: true
  },
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      async authorize(credentials) {
        const email = credentials.email;
        const password = credentials.password;

        const user = await Users.findOne({email})
        if(user) return loginUser({password, user})

        return registerUser({email, password})
      }
    }),
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
    }),
    Providers.Email({
      // https://www.google.com/settings/security/lesssecureapps
      // https://myaccount.google.com/
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest ({
        identifier: email,
        url,
        provider: { server, from }
      }) {
        const { host } = new URL(url)
        const transport = nodemailer.createTransport(server)
        await transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, email }),
        })
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  // SQL or MongoDB database (or leave empty)
  database: process.env.DATABASE_URL,
  callbacks: {
    session: async (session, user) => {
      // const resUser = await Users.findById(user.sub)
      // session.emailVerified = resUser.emailVerified
      session.userId = user.sub
      return Promise.resolve(session)
    }
  }
})


const loginUser = async ({password, user}) => {
  if(!user.password){
    throw new Error("Accounts have to login with OAuth or Email.")
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    throw new Error("Password Incorrect.");
  }

  if(!user.emailVerified){
    throw new Error("Success! Check your email.");
  }

  return user;
}

const registerUser = async ({email, password}) => {
  const hashPass = await bcrypt.hash(password, 12)
  const newUser = new Users({ email, password: hashPass })
  await newUser.save()
  throw new Error("Success! Check your email.");
}