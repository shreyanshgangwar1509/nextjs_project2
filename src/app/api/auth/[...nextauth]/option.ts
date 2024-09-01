// option of sigin as google github

import { NextAuthOptions } from "next-auth";

import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/model/User";
import bcryptjs from "bcryptjs";
import CredentialProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialProvider({
            id: "domain-login",
            name: "Credentials",
            credentials: {
                username: { label: "Email", type: "text", placeholder: "shreyansh" },
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials: any): Promise<any>{
                await dbconnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {username:credentials.identifier}
                        ]
                    })
                    if (!user) {
                        throw new Error("no user found with this email")
                        
                    }
                    if (!user.isverifiedd) {
                        throw new Error("Please verify first before  login first")
                    }
                    const isPasswordCorrect = await bcryptjs.compare(credentials.password, user.password)
                    
                    if (isPasswordCorrect) {
                        return user;
                    }
                    else {
                        throw new Error("Incorrect password")
                    }
                } catch (error:any) {
                    throw new Error(error);
                }
                
            }
        })],
        pages: {
            signIn: '/sign-in',
    },
    session: {
            strategy:'jwt'
    },
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        },
        async jwt({ token, user }) {
            // modify token so that we can do anythingnusing token not by uerying agin and aigin to database
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        },
    },
    secret:process.env.NEXTAUTH_SECERET
    
}
