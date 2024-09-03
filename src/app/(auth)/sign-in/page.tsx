import {useDebounceValue} from 'usehooks-ts'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
function page() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernaemMEssage] = useState('');
  const [isCheckingUsername, setIsCHeckingUsername] = useState(false);
  const [isSubmitting,setIssubmitting] = useState() 
  const debouncedUsername = useDebounceValue(username, 300);
  
  return (
    <div>page</div>
  )
}

export default page