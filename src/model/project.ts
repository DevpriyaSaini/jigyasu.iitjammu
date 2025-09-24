import mongoose,{models, Schema} from "mongoose";

export interface project {
    projectname:string,
    postedby:string,
    description:string;
    email:string;
    deadline:string,
    image:string
}

const projectschema=new Schema<project>({
     projectname:{
        type:String,
        required:true
     },
     postedby:{
        type:String,
        required:true
     },
     deadline:{
        type:String,
        required:true
     },
    description:{
        type:String,
        required:true
     },
    email:{
        type:String,
        required:true
     },
     image:{
        type:String,
        required:true
     },
    },{timestamps:true})

    const projectmodel=models?.project||mongoose.model("project",projectschema);
export default projectmodel;