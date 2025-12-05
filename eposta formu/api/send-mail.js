import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString();
  
  const params = Object.fromEntries(new URLSearchParams(body));

  // FORM BİLGİLERİ
  const name = params.name;
  const email = params.email;
  const message = params.message;

  // GÖNDERECEĞİMİZ ADRES
  const toMail = process.env.MY_EMAIL;

  // SMTP AYARI
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: toMail,
    subject: "Yeni İletişim Mesajı",
    text: `
Ad: ${name}
Mail: ${email}
Mesaj: ${message}
`
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
}
