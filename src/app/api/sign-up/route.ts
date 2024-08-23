import { sendVerificationEmail } from "@/helpers/sendverificationemails";
import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';

// dbconnect()

export async function POST(reqest: Request) {
    await dbconnect()
    try {
        const { username, email, password } = await reqest.json();
        const existuserIsVerifiedByusername = await UserModel.findOne({
            username,
            isverifiedd: true,
        });
        if (existuserIsVerifiedByusername) {
            return Response.json({
                success: false,
                message:"Username already exist",
            }, {
                status:400
            })
        }
        const existinguserByEmail = await UserModel.findOne({
            email,
            isverifiedd:true,
        })
        const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();
        if (existinguserByEmail) {
            if (existinguserByEmail.isverifiedd) {
                return Response.json({
                success: false,
                message:"Email already exist with this email"
            },{status:400})
            } else {
                const hashedpassword = await bcrypt.hash(password, 10);
                existinguserByEmail.password = hashedpassword;
                existinguserByEmail.verifyCode = verifyCode
                existinguserByEmail.verifyCOdeExpiry = new Date(Date.now() + 3600000)
                await existinguserByEmail.save();
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username, password: hashedPassword, email, verifyCOdeExpiry: expiryDate, verifyCode
                ,
                isverifiedd: false,
                isAcceptingMessage: true,
                message:[]
            })

            await newUser.save();
        }
        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message:emailResponse.message
            },{status:500})
        }
        return Response.json({
                success: true,
                message:"User registered successfully "
            },{status:200})
        




        // if (!existuserIsVerifiedByusername) {
        //     const user = await new UserModel({ username, email, password });
        //     if (!user) {
        //         console.log('Somethign went wrong in making user');
        //     }
        //     return Response.json({
        //     success: true,
        //     message:"User created successfully",
        //     }, {
        //     status:500
        //     })
        // }
        // else {
            
        // }
        
    } catch (error) {
        console.log('Error registering user',error);
        return Response.json({
            success: false,
            message:"Error registering user"
        }, {
            status:500
        })
    }
}

