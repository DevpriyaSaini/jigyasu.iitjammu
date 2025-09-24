import { Connectiondb } from "@/lib/dbconnect";
import studentmodel from "@/model/studentlogin";
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_GMAIL_USER,
    pass: process.env.NEXT_PUBLIC_GMAIL_APP_PASS,
  },
});

// Function to send OTP email
async function sendmail(name: string, email: string, otp: string) {
  try {
    const mailOptions = {
      from: process.env.NEXT_PUBLIC_GMAIL_USER,
      to: email,
      subject: "Verify Your Email - Student Portal",
      html: `
        <h2>Welcome, ${name} 🎉</h2>
        <p>To complete your registration, please use the OTP below:</p>
        <h3 style="color:blue; font-size:22px;">${otp}</h3>
        <p>This OTP is valid for <b>10 minutes</b>. If you did not request this, please ignore.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

//  Registration with OTP 
export async function POST(request: NextRequest) {
  await Connectiondb();

  try {
    const { studentname, email, password } = await request.json();

    // Validate input
    if (!studentname || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Generate OTP and expiry (10 minutes)
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Check if user exists
    let user = await studentmodel.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 400 }
        );
      } else {
        // User exists but not verified: update details
        user.studentname = studentname;
        user.password = password;
        user.VerifyCode = otp;
        user.VerifyCodeExpiry = otpExpiry;
        await user.save();

        await sendmail(studentname, email, otp);

        return NextResponse.json(
          {
            success: true,
            message: "OTP resent. Please verify your email.",
            userId: user._id,
          },
          { status: 200 }
        );
      }
    } else {
      // User does not exist: create new
      user = await studentmodel.create({
        studentname,
        email,
        password,
        isVerified: false,
        VerifyCode: otp,
        VerifyCodeExpiry: otpExpiry,
      });

      await sendmail(studentname, email, otp);

      return NextResponse.json(
        {
          success: true,
          message: "User registered successfully. OTP sent to email.",
          userId: user._id,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}

// OTP Verification for Student
export async function PUT(request: NextRequest) {
  await Connectiondb();

  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const user = await studentmodel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: true, message: "User already verified" },
        { status: 200 }
      );
    }

    // Check OTP validity
    if (user.VerifyCode !== otp || !user.VerifyCodeExpiry || user.VerifyCodeExpiry < new Date()) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Mark user as verified
    user.isVerified = true;
    user.VerifyCode = "";
    user.VerifyCodeExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: "Error verifying OTP" },
      { status: 500 }
    );
  }
}
