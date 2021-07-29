const functions = require("firebase-functions");
const admin = require('firebase-admin');
const nodemailer = require("nodemailer");
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

admin.initializeApp();

// 送信に使用するメールサーバーの設定
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

exports.sendMail = functions.https.onCall((data, context) => {
  // メール設定
  let adminMail = {
    from: gmailEmail,
    to: data.to,
    subject: data.subject,
    text: data.text
  };
  // 管理者へのメール送信
  return mailTransport.sendMail(adminMail, (err, info) => {
    if (err) {
      return res.send(err.toString());
    }
    return res.send('Email sent succesfully');
  });
});
