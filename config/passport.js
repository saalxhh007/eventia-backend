import passport from "passport";
import prisma from "../prisma/client.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as FacebookStrategy } from "passport-facebook"

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  const user = await prisma.users.findUnique({ where: { id } })
  done(null, user)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.OAUTH_REDIRECT_URI}/google`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.users.findUnique({
          where: { oauth_id: profile.id },
        })

        if (!user) {
          user = await prisma.users.create({
            data: {
              full_name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
              oauth_provider: "google",
              oauth_id: profile.id,
              status: "active",
              phone: "0000000000"
            },
          })
        }

        return done(null, user)
      } catch (err) {
        return done(err, null)
      }
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.OAUTH_REDIRECT_URI}/facebook`,
      profileFields: ["id", "displayName", "emails", "picture.type(large)"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.users.findUnique({
          where: { oauth_id: profile.id },
        })

        if (!user) {
          user = await prisma.users.create({
            data: {
              full_name: profile.displayName,
              email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
              avatar: profile.photos?.[0]?.value || null,
              oauth_provider: "facebook",
              oauth_id: profile.id,
              status: "active",
              phone: "0000000000"
            },
          })
        }

        return done(null, user)
      } catch (err) {
        return done(err, null)
      }
    }
  )
)

export default passport