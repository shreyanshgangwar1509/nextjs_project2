import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";

export async function GET(request: Request) {
    await dbconnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticcated"
        }, {
            status: 401
        })
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            {$match:{id:userId}},
            {$unwind: '$messages' },
            {$sort: { 'messages.createdAt': -1 } },
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])

        if (!user || user.length === 0)
        {
            return Response.json({
            success: true,
            message: "Usr not found"
        }, {
            status: 401
        }) 
        }
        return Response.json({
            success: true,
            messages:user[0].messages 
        }, {
            status: 201
        }) 
    } catch (error:any) {
        return Response.json({
            success: false,
            messages:error.messages 
        }, {
            status: 500
        }) 
    }

}