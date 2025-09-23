import { error } from "console";
import mongoose from "mongoose";

const MONGO_URI=process.env.MONGO_URI;

if(!MONGO_URI){
    throw new Error("Please define mongo_uri in env variables")
}

let cached=global.mongoose;

if(!cached){
    cached=global.mongoose={conn:null,promise:null}
}

export async function Connectiondb() {
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        const opts={
            bufferCommands:true,
            maxPoolSize:10
        }

     

       mongoose.connect(MONGO_URI as string,opts).then(()=>mongoose.connection)
    }
    try {
        cached.conn=await cached.promise
    } catch (error) {
        cached.promise=null;
        throw error;
    }
    return cached.conn
}
