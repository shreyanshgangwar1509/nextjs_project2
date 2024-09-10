'use client'

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/Skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  
  const toast = useToast();
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
    
  }

  const { data: session } = useSession()
  
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  });

  const { register, watch, setValue } = form
  
  const acceptmessage = watch('acceptmessages')

  
  const fetchAcceptMessaga = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptmessages', response.data.isAcceptingMessage)

    } catch (error) {
      const axioserror = error as AxiosError<ApiResponse>
      toast.toast({
        title: "Error",
        description: axioserror.response?.data.message || "Failed to fetch message",
        variant: "destructive"
    })
    } finally {
      setIsSwitchLoading(false)
    }
  },[setValue])
  const fetchMessage = useCallback(async (referesh:boolean = false) => {
    setIsSwitchLoading(false);
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (referesh) {
        toast.toast({
          title: "Referesh Messages",
          description:"Showing latest messages"
        })
      }
    } catch (error) {
      const axioserror = error as AxiosError<ApiResponse>
      toast.toast({
        title: "Error",
        description: axioserror.response?.data.message || "Failed to fetch message",
        variant: "destructive"
    })
    } finally {
      setLoading(false);
      setIsSwitchLoading(false)
    }
  },[setLoading,setMessages])

  useEffect(() => {
    if (!session || !session.user) {
      return 
    }
    fetchMessage()
    fetchAcceptMessaga()
  },[session,setValue,fetchAcceptMessaga,fetchMessage])
  // handel switch change 
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptmessage:!acceptmessage
      })
      setValue('acceptmessages', !acceptmessage)
      toast.toast({
        title: response.data.message,
        variant:'default',
      })
    } catch (error) {
      const axioserror = error as AxiosError<ApiResponse>
      toast.toast({
        title: "Error",
        description: axioserror.response?.data.message || "Failed to fetch message",
        variant: "destructive"
    })
    }
  }
  const username = session?.user as User
  const baseUrl = `${window.location.protocol}??${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.toast({
      title: "Urll copied",
      description:"Profile url has been copied to clipboard"
    })
  }


  if (!session || !session.user) {
    return <>Please Login</>
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptmessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptmessage ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessage(true);
        }}
      >
        
        {loading ? (
          <><Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" /></div></>
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              // key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default page