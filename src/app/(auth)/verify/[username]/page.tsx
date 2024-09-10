'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
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
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
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
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>OPT</FormLabel>
                <FormControl>
                  <Input placeholder="otp" {...field}
                    />
                  
                </FormControl>
                
                
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

export default VerifyAccount