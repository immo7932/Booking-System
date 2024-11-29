const userModel = require("../models/Users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Otp = require("../models/Otp.js");
const middleWare1 = require("../middlewareAdmin.js");

const sendOtpEmail = require("../mailer/sendOtpEmail.js");
const resetMailOptions = require("../mailer/resetPasswordMail.js");
const crypto = require("crypto");
const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.LOCALURL
    : process.env.GLOBALURL;
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input before saving
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters." });
  }

  try {
    // Check if the email is already in use
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists." }); // Conflict status
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({ name, email, password: hashedPassword, role });

    // Save the user to the database

    const savedUser = await user.save();
    const otpValue = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const hashedOtp = await bcrypt.hash(otpValue, 10);

    // Save OTP to database
    const otpEntry = new Otp({
      userId: savedUser._id,
      otp: hashedOtp,
    });
    await otpEntry.save();

    // Send OTP via email
    await sendOtpEmail(email, otpValue);

    // Return success response with the created user data
    return res.status(201).json({ success: true, user: savedUser });
  } catch (err) {
    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Invalid data. Please check your inputs.",
        details: err.errors,
      });
    }

    // Handle other errors, such as database connection issues
    return res.status(500).json({
      error: "Server error. Unable to create user.",
      details: err.message,
    });
  }
};

//verify otp
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified." });
    }

    // Find the OTP entry
    const otpEntry = await Otp.findOne({ userId: user._id });
    if (!otpEntry) {
      return res.status(400).json({ message: "OTP not found or expired." });
    }

    // Compare OTPs
    const isMatch = await bcrypt.compare(otp, otpEntry.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Verify the user
    user.isVerified = true;
    await user.save();

    // Delete the OTP entry
    await Otp.deleteOne({ _id: otpEntry._id });

    res.status(200).json({ message: "User verified successfully." });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

//resend email for otp
// routes/auth.js (continued)
const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified." });
    }

    // Delete any existing OTP for this user
    await Otp.deleteMany({ userId: user._id });

    // Generate new OTP
    const otpValue = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const hashedOtp = await bcrypt.hash(otpValue, 10);

    // Save new OTP to database
    const otpEntry = new Otp({
      userId: user._id,
      otp: hashedOtp,
    });

    await otpEntry.save();

    // Send OTP via email
    await sendOtpEmail(email, otpValue);

    res.status(200).json({ message: "OTP resent to email." });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const foundUser = await userModel.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    if(!foundUser.isVerified){
      return res.status(401).json({ error: "Need to verify you Account." });

    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Extract the userId and other necessary data
    const userId = foundUser._id;
    const userData = {
      id: userId,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role, // Ensure the role is included
    };

    // Include role in the JWT payload
    const payload = {
      user: {
        id: userId,
        role: foundUser.role, // Include role here
      },
    };

    const authToken = jwt.sign(
      payload,
      "b0742345623214e7f5aac75a4200799d80b55d26a62b97cd23015c33ae3ac11513e2e7", // Consider using environment variables
      { expiresIn: "59m" } // Token expires in 10 minutes
    );

    res.cookie("authToken", authToken, {
      httpOnly: true, // Not accessible via JavaScript
      secure: false, // Use secure cookies in production
      maxAge: 10 * 60 * 1000 * 60, // 10 minutes
      sameSite: "None", // Protect against CSRF
    });
    // console.log(res.cookie);

    // Send the userId and user data back to the frontend
    return res.status(200).json({
      success: true,
      userId: userId,
      authToken,
      user: userData,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ error: "Server error. Unable to login." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      // To prevent email enumeration, respond with the same message
      return res.status(200).json({
        message:
          "you will receive a Email Regarding password reset link shortly.",
      });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    // Hash the token before saving to the database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token and expiration on user model
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const resetURL = `${API_URL}/resetPassword/${resetToken}`;
    await resetMailOptions(email, resetURL);

    // Email content

    res.status(200).json({
      message:
        "If this email is registered, you will receive a password reset link shortly.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

const updateNewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Hash the token to compare with the stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token and valid expiration
    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired password reset token.",
      });
    }

    // Update user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword; // This will trigger the pre-save hook to hash the password
    // Remove reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  updateNewPassword,
};
