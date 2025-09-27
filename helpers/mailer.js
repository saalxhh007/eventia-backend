import * as nodemailer from "nodemailer"

export async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const verificationLink = `${process.env.BASE_API}/api/v1/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `<p>Click the link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`
  });
}

export async function sendPasswordRestoreMail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const verificationLink = `${process.env.CLIENT_URL}/restore-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Recupiration",
    html: `<p>Click the link to restore your Password: <a href="${verificationLink}">${verificationLink}</a></p>`
  });
}

export async function sendVenueActivation(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const link = `${process.env.CLIENT_URL}`

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Venue Activation",
    html: `<p>You're Venue Is Activated Successfully , you can login via : <a href="${link}">${link}</a></p>`
  });
}

export default {
  sendVerificationEmail,
  sendPasswordRestoreMail,
  sendVenueActivation
}