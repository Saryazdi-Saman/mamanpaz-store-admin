import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  
  modules: [
    {
      resolve: "./src/modules/guest",
    },
    {
      resolve: "./src/modules/subscription",
    },
    {
      resolve: "./src/modules/marketing",
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/twilio-sms",
            id: "twilio-sms",
            options: {
              accountSid: process.env.TWILIO_ACCOUNT_SID,
              authToken: process.env.TWILIO_AUTH_TOKEN,
              twilioNumber: process.env.TWILIO_PHONE_NUMBER,
              channels: [ "sms" ]
            }
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          // {
          //   resolve: "@medusajs/medusa/file-local",
          //   id: "local",
          // },
          {
            resolve: "./src/modules/imagekit",
            id: "imagekit",
            options: {
              publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
              privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
              urlEndpoint :  process.env.IMAGEKIT_URL_ENDPOINT,
            },
          },
        ],
      },
    },
  ],
})
