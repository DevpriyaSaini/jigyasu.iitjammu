import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
  studentname: string;
  email: string;
  password: string;
  isVerified: boolean;
  VerifyCode?: string;        
  VerifyCodeExpiry?: Date;     
}

const userSchema: Schema<User> = new Schema(
  {
    studentname: {
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
          // ✅ Must start with year (4 digits) and end with @iitjammu.ac.in
          return /^[0-9]{4}[a-zA-Z0-9._%+-]*@iitjammu\.ac\.in$/.test(value);
        },
        message:
          "Email must start with year (e.g., 2024xxxx) and end with @iitjammu.ac.in",
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
      default: "",
    },
    VerifyCodeExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

//  Hash password before saving
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

//  Password comparison method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const studentmodel =
  mongoose.models.Student || mongoose.model<User>("Student", userSchema);

export default studentmodel;
