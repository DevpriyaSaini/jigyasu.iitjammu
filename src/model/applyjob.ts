import mongoose,{models, Schema} from "mongoose";

export interface apply {
    studentname:string,
    email:string,
    degree:string,
    description:string;
    resume:string
}

const applySchema=new Schema<apply>({
     studentname:{
        type:String,
        required:true
     },
     degree:{
        type:String,
        required:true
     },
     email:{
 type:String,
        required:true
     },
    description:{
        type:String,
        required:true
     },
     resume:{
        type:String,
        required:true
     },
    },{timestamps:true})

    const applyjobmodel=models?.apply||mongoose.model("apply",applySchema);
export default applySchema;