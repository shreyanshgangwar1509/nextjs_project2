import { dbconnect } from "@/lib/dbconnect";
import UserModel, { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbconnect();
    const {username,content }=await request.json()
    try {
        const user = await UserModel.findOne({ username })
        
        if (!user) {
            return Response.json({
            success: false,
            message: "Usr not found"
        }, {
            status: 404
        }) 
        }
        // is user accepting message 
        if (!user.isAcceptingMessage) {
            return Response.json({
            success: true,
            message: "User is not accepting message "
        }, {
            status: 403
        }) 
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)

        await user.save();
        return Response.json({
            success: true,
            message: "meassge send successfully "
        }, {
            status: 401
        }) 
    } catch (error) {
        console.log('erroe adding messages ',error);
        
        return Response.json({
            success: false,
            message: "Error "
        }, {
            status: 500
        }) 
    }
}