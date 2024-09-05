import { signUpSchema } from '@/schemas/signUpSchema';
import { ApiResonce } from '@/types/ApiResponse';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import { z } from 'zod';

function page() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernaemMEssage] = useState('');
  const [isCheckingUsername, setIsCHeckingUsername] = useState(false);
  const [isSubmitting,setIssubmitting] = useState(false) 
  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  // zod implementeion 
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password:""
    }

  })
  useEffect(() => { 
    const CheckusernameUni = async () => {
      if (debounced(username)) {
        setIsCHeckingUsername(true);
        setUsernaemMEssage("")
        try {
          const response = await axios.get(`/api/check-username-uniQue?username=${debounced}`)
          let MessagePort = response.data.message; 
          setUsernaemMEssage(MessagePort)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResonce>;
          setUsernaemMEssage(
            axiosError.response?.data.message ?? "Error checking username "
          )
        } finally {
          setIsCHeckingUsername(false);
        }
      }
    }
    CheckusernameUni();
  }, [debounced])
  const onSubmit = async (data:z.infer<typeof signUpSchema>) => {
    setIssubmitting(true);
    try {
      const response = await axios.post<ApiResonce>('/api/sing-up', data)
      toast({
        title: 'Success', 
        description:response.data.message
      })

      router.replace(`/verify/${username}`)
      setIssubmitting(false)
    } catch (error) {
      console.error("Error in singing up ", error);
      const axiosError = error as AxiosError<ApiResonce>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        deccription: errorMessage,
        variant:"destructive"
      })
      setIssubmitting(false)
      
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg0gray-200'>
      <div className=' w-full  maax-w-md p-8 spacce-y-7 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
          Join Mystery Message
          </h1>
          <p className='mb-4'>Sign up to start your anonymous adventure</p>
        </div>
        
      </div>
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
                    onChange={(e:any) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }} />
                  
                </FormControl>
                {isSubmitting && <Loader2 className="animate-spin" />}
                <p className={`text-sm ${usernameMessage === "Username is valid (available )" ? 'text-green-500':'text-red-600'}`}></p>
                <FormMessage/>
            </FormItem>
            )} />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field}
                    } />
                  
                </FormControl>
                {isSubmitting && <Loader2 className="animate-spin" />}
                <FormMessage/>
            </FormItem>
            )} />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field}
                    onChange={(e:any) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }} />
                  
                </FormControl>
                {isSubmitting && <Loader2 className="animate-spin" />}
                <FormMessage/>
            </FormItem>
            )} />
          <BUtton type="submit" disabled={isSubmitting}>
            {
              isSubmitting?(<Loader2 className="mr-2 h-4 w-4 animate-spin"/>):('Singup')
            }
          </BUtton>
        </form>
      </Form>
      <div className='text-center mt-4'>
        <p>
          Already a memeber?{" "}
          <Link href ="sing-in" className='text-blue-600 hover:text-blue-800'>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default page