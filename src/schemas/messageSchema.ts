
import { z } from "zod"

export const MessageSchema = z.object({
    content: z
        .string()
        .min(10, 'content must be atleast of 10 character ')
        .max(300,'content must be atmost of 300 character '),
})