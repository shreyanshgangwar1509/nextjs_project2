import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document{
    content: string,
    createdAt:Date,
}
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required:true
    },
    createdAt: {
        type: Date,
        required: true,
        default:Date.now
    }
})
export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCOdeExpiry: Date,
    isAcceptingMessage: boolean,
    isverifiedd:boolean,
    messages:Message[],
}
const UserSchema: Schema<User> = new Schema({
    email: {
        type: String,
        required: [true, "email is reuired"],
        unique: true,
        // email testing
        match:[/.+\@.+\..+/,'please use a valid email address ']
    },

    username: {
        type: String,
        required: [true, "Username is reuired"],
        unique: true,
        trim:true,
    },
    password: {
        type: String,
        required: [true, "password is reuired"],
    },
    verifyCode: {
        type: String,
        required: [true, "verifycode is reuired"],
    },
    verifyCOdeExpiry: {
        type: Date,
        required: [true, "verifycodeexpiry  is reuired"],
    },
    isverifiedd: {
        type: Boolean,
        default:false,
        
    },
    isAcceptingMessage: {
        type: Boolean,
        default:true,
    },
    messages: [MessageSchema]


})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema)

export default UserModel;