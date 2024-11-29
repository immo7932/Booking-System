var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "dbmsproject09@gmail.com",
    pass: "zhjeutybhujsmqhj",
  },
});
transport.verify((error, success) => {
  if (error) {
    console.log("Nodemailer transporter configuration error:", error);
  } else {
    console.log("Nodemailer transporter is ready to send emails");
  }
});

module.exports = transport;
