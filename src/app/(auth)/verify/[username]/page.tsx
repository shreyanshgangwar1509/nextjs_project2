'use client'
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResonce } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
const VerifyAccount = () => {
    const router = useRouter()
    const param = useParams<{ username: string }>()
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        
    })
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code:data.code
      })
      toast({
        title: "Success",
        description: response.data.message||"User verified "
      })
      router.replace('sign-in')
    } catch (error) {
      console.error("Error in singing up ", error);
      const axiosError = error as AxiosError<ApiResonce>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        deccription: errorMessage,
        variant:"destructive"
      })
      
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg0gray-200'>
      <div className=' w-full  maax-w-md p-8 spacce-y-7 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'>
          <FormField
            control={form.control}
            name="usernaem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field}
                    />
                  
                </FormControl>
                {isSubmitting && <Loader2 className="animate-spin" />}
                <p className={`text-sm ${usernameMessage === "Username is valid (available )" ? 'text-green-500':'text-red-600'}`}></p>
                <FormMessage/>
            </FormItem>
                )} />
              <Button type="submit">Submit</Button>
            </form>
            </Form>
        </div>
      </div>
    </div>
  )
}

export default page