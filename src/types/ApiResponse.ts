import { Message } from "@/model/User";
export interface ApiResonce {
    success: boolean,
    message: string,
    isAcceptingMessage?: boolean,
    messages?:Array<Message>
    
}

