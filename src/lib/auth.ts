import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
})

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER'
      },
      status: {
        type: 'string',
        required: false,
        defaultValue: 'ACTIVE'
      }
    }
  },

  // Configure authentication providers
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, //defaults to true
    requireEmailVerification: true //defaults to false
  },
  trustedOrigins: [process.env.APP_URL || 'http://localhost:5000'],

  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verifiUrl = `${process.env.APP_URL}/verification?token=${token}`
        const info = await transporter.sendMail({
          from: '"Prisma Blog App" <prismablog@gmail.com>',
          to: user.email,
          subject: "verifying email",
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
  <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background:white; border-radius: 8px; overflow:hidden; border:1px solid #e5e5e5;">
    <tr>
      <td style="padding: 20px; text-align:center; background:#4f46e5; color:white;">
        <h2 style="margin:0;">Verify Your Email</h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px; color:#333; font-size: 16px;">
        <p>Hi there,</p>
        <p>Thanks for signing up to <strong>Prisma Blog App</strong>! To complete your registration, please verify your email address by clicking the button below:</p>
        <p style="text-align:center; margin: 30px 0;">
          <a href="${verifiUrl}" style="display: inline-block; padding: 12px 24px; background:#4f46e5; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">
            Verify Email
          </a>
        </p>
        <p>If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color:#4f46e5;">${verifiUrl}</p>
        <br />
        <p style="color:#555;">If you did not request this email, you can safely ignore it.</p>
        <p>Cheers,<br/>The Prisma Blog Team</p>
      </td>
    </tr>
  </table>
</body>
</html>
`
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.log(error);
      }
    }
  },

  // signup with google
  socialProviders: {
    google: {
      prompt:'select_account consent',
      accessType:'offline',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

});