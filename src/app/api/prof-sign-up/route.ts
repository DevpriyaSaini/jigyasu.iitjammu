import { Connectiondb } from "@/lib/dbconnect";
import profModel from "@/model/prof";
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
      subject: "Verify Your Email - Professor Portal",
      html: `
        <h2>Welcome, Prof. ${name} 🎓</h2>
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
    const { profname, email, password } = await request.json();

    // Validate input
    if (!profname || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Generate OTP and expiry (10 minutes)
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Check if professor exists
    let prof = await profModel.findOne({ email });

    if (prof) {
      if (prof.isVerified) {
        return NextResponse.json(
          { success: false, message: "Professor already exists" },
          { status: 400 }
        );
      } else {
        // Exists but not verified: update details
        prof.profname = profname;
        prof.password = password;
        prof.VerifyCode = otp;
        prof.VerifyCodeExpiry = otpExpiry;
        await prof.save();

        await sendmail(profname, email, otp);

        return NextResponse.json(
          {
            success: true,
            message: "OTP resent. Please verify your email.",
            userId: prof._id,
          },
          { status: 200 }
        );
      }
    } else {
      // Does not exist: create new
      prof = await profModel.create({
        profname,
        email,
        password,
        isVerified: false,
        VerifyCode: otp,
        VerifyCodeExpiry: otpExpiry,
      });

      await sendmail(profname, email, otp);

      return NextResponse.json(
        {
          success: true,
          message: "Professor registered successfully. OTP sent to email.",
          userId: prof._id,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Error during professor registration:", error);
    return NextResponse.json(
      { success: false, message: "Error registering professor" },
      { status: 500 }
    );
  }
}

// OTP Verification for Professor
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

    const prof = await profModel.findOne({ email });
    if (!prof) {
      return NextResponse.json(
        { success: false, message: "Professor not found" },
        { status: 404 }
      );
    }

    if (prof.isVerified) {
      return NextResponse.json(
        { success: true, message: "Professor already verified" },
        { status: 200 }
      );
    }

    // Check OTP validity
    if (
      prof.VerifyCode !== otp ||
      !prof.VerifyCodeExpiry ||
      prof.VerifyCodeExpiry < new Date()
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Mark professor as verified
    prof.isVerified = true;
    prof.VerifyCode = "";
    prof.VerifyCodeExpiry = undefined;
    await prof.save();

    return NextResponse.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying professor OTP:", error);
    return NextResponse.json(
      { success: false, message: "Error verifying OTP" },
      { status: 500 }
    );
  }
}
