import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbconnect()

    try {
        const { username, code } = await request.json();
        const decodedusername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedusername })
        
        if (!user) {
            return Response.json(
                {
                    succcess: false,
                    message:"Usr not found"
                }, {
                    status:500
                }
            )
        }

        const isCodeValid = user.verifyCode == code
        const isCodeNotExpired = new Date(user.verifyCOdeExpiry) > new Date()
        
        if (isCodeValid && isCodeNotExpired) {
            user.isverifiedd = true
            await user.save();
            return Response.json(
                {
                    succcess: true,
                    message:"User verified successfully"
                }, {
                    status:200
                }
            )
        }
        else if (!isCodeNotExpired) {
            return Response.json(
                {
                    succcess: false,
                    message:"Verfication code is expired please signup again "
                }, {
                    status:400
                }
            )
        }
        else {
            return Response.json(
                {
                    succcess: false,
                    message:"Invalid Verfication code "
                }, {
                    status:400
                }
            )
        }

    } catch (error) {
        console.error("Error checking username ", error)
        return Response.json({
            success: false,
            message:"Error checking username"
        }, {
            status:500
        })
    }
}