import nodemailer from "nodemailer"

export async function sendOrderEmail({
  orderNumber,
  customerEmail,
}: {
  orderNumber: string
  customerEmail: string
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"SafiPro" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "🛒 New Paid Order",
    html: `
      <h2>New Order Received</h2>
      <p><b>Order Number:</b> ${orderNumber}</p>
      <p><b>Customer Email:</b> ${customerEmail}</p>
      <p>Status: PAID ✅</p>
    `,
  })
}