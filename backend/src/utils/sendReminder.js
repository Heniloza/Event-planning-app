import nodemailer from "nodemailer";

export default async function sendReminder(email, booking) {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Festora" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Booking Reminder - Festora",
    text: `Hello,

This is a reminder that you have a booking scheduled for tomorrow (${
      booking.eventDate.split("T")[0]
    }).

Please make sure you are prepared.

Best,  
Team Festora`,
  };

  await transporter.sendMail(mailOptions);
}
