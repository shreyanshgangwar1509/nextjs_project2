// import { dbconnect } from '@/lib/dbconnect';
// import UserModel from '@/model/User';
// import { usernameValidation } from '@/schemas/signUpSchema';
// import { z } from 'zod';

// const UsernameQuerySchema = z.object({
//     username:usernameValidation
// })

// export async function GET(request: Request) {
//     // to check reuest type
//     if (request.method !== 'GET') {
//         return Response.json({
//                 success: false,
//                 message:'Method is not allowed '
//             }, {
//                 status:405
//             })
//     }
//     await dbconnect();
//     // localhost:3000/api/cu?username=shreyansh
//     try {
//         const {searchParams} = new URL(request.url);
//         const queryParam = { username: searchParams.get('username') }
//         // validation with zod
//         const result = UsernameQuerySchema.safeParse(queryParam);
//         console.log(result);

//         if (!result.success) {
//             const usernameError = result.error.format().username?._errors || []
//             return Response.json({
//                 success: false,
//                 message:usernameError?.length>0?usernameError.join(', '):'INvalid username ',
//             }, {
//                 status:400
//             })
//         }
//         const { username } = result.data;
//         const user = await UserModel.findOne({ username, isverifiedd: true })
        
//         if (user) {
//             return Response.json({
//                 success: false,
//                 message:'Username is alreedy exist '
//             }, {
//                 status:400
//             })
//         }
//         else {
//             return Response.json({
//                 success: false,
//                 message:'Username is valid (available )'
//             }, {
//                 status:400
//             })
//         }
        



//     } catch (error) {
//         console.error("Error checking username ", error)
//         return Response.json({
//             success: false,
//             message:"Error checking username"
//         }, {
//             status:500
//         })
//     }
// }
import { dbconnect } from '@/lib/dbconnect';
import UserModel from '@/model/User';
import { usernameValidation } from '@/schemas/signUpSchema';
import { z } from 'zod';

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    if (request.method !== 'GET') {
        return new Response(JSON.stringify({
            success: false,
            message: 'Method not allowed'
        }), {
            status: 405
        });
    }

    await dbconnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = { username: searchParams.get('username') };

        // Validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result);

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            return new Response(JSON.stringify({
                success: false,
                message: usernameError.length > 0 ? usernameError.join(', ') : 'Invalid username',
            }), {
                status: 400
            });
        }

        const { username } = result.data;
        const user = await UserModel.findOne({ username });

        if (user) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Username already exists'
            }), {
                status: 400
            });
        } else {
            return new Response(JSON.stringify({
                success: true,
                message: 'Username is available'
            }), {
                status: 200
            });
        }

    } catch (error) {
        console.error("Error checking username:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error checking username"
        }), {
            status: 500
        });
    }
}
