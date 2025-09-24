import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
  profname: string;
  email: string;
  password: string;
  isVerified: boolean;
  role?: string;
  VerifyCode?: string;
}

const userSchema: Schema<User> = new Schema(
  {
    profname: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: function (value: string) {
          // ✅ Must start with a letter (name) and end with @iitjammu.ac.in
          return /^[a-zA-Z][a-zA-Z0-9._%+-]*@iitjammu\.ac\.in$/.test(value);
        },
        message:
          "Email must start with a name (letters) and end with @iitjammu.ac.in",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    VerifyCode: {
      type: String,
    },
    role: {
      type: String,
      default: "prof",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});



const profModel =
  mongoose.models.professor || mongoose.model<User>("professor", userSchema);
export default profModel;
