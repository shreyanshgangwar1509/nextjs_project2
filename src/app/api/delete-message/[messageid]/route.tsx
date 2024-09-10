import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageid = params.messageid
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
    
    try {
        const updated = await UserModel.updateOne(
            { _id: user._id },
            {$pull:{messages:{_id:messageid}}}
        )
        if (updated.modifiedCount) {
            return Response.json({
            success: false,
            message: "Message not found or deleted"
        }, {
            status: 404
        })
        }
        return Response.json({
            success: true,
            message: "Message is deleted"
        }, {
            status: 200
        })


        
        } 
    catch (error:any) {
        return Response.json({
            success: false,
            message: error.message
        }, {
            status: 500
        })
    }

}