import { resend } from '@/lib/resend';

import { ApiResonce } from '@/types/ApiResponse';
import VerificationEmail from '../../emails/verificationemail';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode:string
): Promise<ApiResonce>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "verification code",
            react:VerificationEmail({username:username,otp:verifyCode}),
        });
        return {success:true,message:"Verification email succefully "}
    } catch (error) {
        console.log("Error sending verification email",error);
        return {success:false,message:"falied in sending verification email"}
    }
}