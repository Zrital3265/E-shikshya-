import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import ejs from "ejs";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import {User} from "../models/user.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

console.log(email)
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetCode = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordCode = resetCode;
    user.resetPasswordCodeExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const templatePath = path.join(__dirname, "../view/email/resetCode.ejs");
    const htmlContent = await ejs.renderFile(templatePath, { activationCode:resetCode, user: { name: user.name }});
    
    // console.log("Starting password reset process"); // Before everything

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // console.log("Transporter created"); // Check if transporter is initialized
    
     await transporter.sendMail({
      from: `E-shikshya <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your Password Reset Code",
      html: htmlContent,
    });
    
    // console.log("Email send info:", info); // Check if email sending succeeds
  
    res.status(200).json({ success: true, message: "Reset code sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error); // Log the actual error
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    // Find user with valid reset code and unexpired timestamp
    const user = await User.findOne({
      email,
      resetPasswordCode: resetCode,
      resetPasswordCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired code" });
    }

    // Add password comparison check
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Hash and Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpires = undefined;


    // Clear reset code fields after successful reset
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpires = undefined;  
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordCode: resetCode,
      resetPasswordCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    res.status(200).json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
