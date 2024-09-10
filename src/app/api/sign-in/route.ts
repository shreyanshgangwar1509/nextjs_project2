import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/model/User";

// dbconnect()

export async function POST(reqest: Request) {
    await dbconnect()
    try {
        const { username, email, password } = await reqest.json();
        // finding user by username
        const user = UserModel.findOne({ username, password })
        // finding user by email 
    }
    catch(error) {
        console.log(error);
        
    }
}

