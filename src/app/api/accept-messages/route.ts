import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";

export async function POST(request: Request) {
    await dbconnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message:"Not authenticcated"
        }, {
            status:401
        })
    }
    const userId = user._id;
    const { acceptMessages } = await request.json()
    
    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptMessages},
            {new:true}
        )
        if (!updateUser) {
            return Response.json({
            success: false,
            message:"falied to update status to accept messages"
        }, {
            status:401
        })
        }
        else {
            return Response.json({
            success: true,
            message: "status update to accept messages",
            updateUser,
        }, {
            status:401
        })
        }
    } catch (error) {
        console.log("falied to update user status to accept meassage")
        return Response.json({
            success: false,
            message:"falied to update user status to accept meassage"
        }, {
            status:500
        })
    }
}

export async function GET(request:Request) {
    await dbconnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message:"Not authenticcated"
        }, {
            status:401
        })
    }

    const userId = user._id;
    try {
        const founduser = await UserModel.findById(userId)
        if (!founduser) {
                return Response.json({
                success: false,
                message:"falied to update status to accept messages"
            }, {
                status:404
            })
        }
        return Response.json({
            success: true,
            isAcceptingMessage:founduser.isAcceptingMessage
        }, {
                status:200
            })
    } catch (error) {
        console.log("Error in geting message acceptance status ");
        
        return Response.json({
            success: true,
            message:"Error in geting message acceptance status "
        }, {
                status:200
            })
    }
    
}