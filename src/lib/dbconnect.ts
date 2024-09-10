import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number
}
const connection: ConnectionObject = {}

export const dbconnect = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log('Already connected to database');
        return 
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI! || '',
            {serverSelectionTimeoutMS: 30000,});
        connection.isConnected = db.connections[0].readyState
        
        console.log('DB connected succefully ');
        
    } catch (error: any) {
        
        console.log('Somthing went wrong with db connecton falied',error);
        process.exit(1)
    }
}
