import { Connection } from "mongoose";

declare global{
    var mongoose:{
        conn:Connection|null;
        promise:promise<Connection>|null
    }
}


export {}