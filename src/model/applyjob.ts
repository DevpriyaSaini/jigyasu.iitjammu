import mongoose, { models, Schema, Model, Document } from "mongoose";

export interface IApply extends Document {
  studentname: string;
  email: string;
  degree: string;
  description: string;
  projectname:string;
  projectId:string;
  profemail:string;
  resume: string;
}

const applySchema = new Schema<IApply>(
  {
    studentname: { type: String, required: true },
    degree: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    resume: { type: String, required: true },
    profemail: { type: String, required: true },
    projectId: { type: String, required: true },
    projectname: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Use model, not schema
const ApplyJobModel: Model<IApply> = models.Apply || mongoose.model<IApply>("Apply", applySchema);

export default ApplyJobModel;
