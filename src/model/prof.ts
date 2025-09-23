import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
  profname: string;
  email: string;
  password: string;
  isVerified: boolean;
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

// Password comparison method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const profModel =
  mongoose.models.User || mongoose.model<User>("User", userSchema);
export default profModel;
