import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { login } from '@/State/Auth/Action'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const SigninForm = () => {
  const dispatch=useDispatch()
  const navigate = useNavigate()
    const form = useForm({
        resolver :"",
        defaultValues : {
            email : "",
            password : ""
    }
})
const onSubmit = (data) => {
  dispatch(login({data,navigate}))
    console.log(data);
}
  return (
    <div className='px-10 py-2'> 
     <h1 className='text-xl font-bold text-center pb-5'>Signin</h1>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

             <FormField control={form.control} name="email" render={({field})=> (
                <FormItem>
                  <FormLabel>email</FormLabel>
                   <FormControl>
                    <Input 
                   
                    className=" border border-gray-700  p-5 w-full" placeholder='Enter your email' {...field}/>
                   </FormControl>
                   <FormMessage/>
                </FormItem>
                   
            )}/>

             <FormField control={form.control} name="password" render={({field})=> (
                <FormItem>
                    <FormLabel>password</FormLabel>
                   <FormControl>
                    <Input 
                  
                    className=" border border-gray-700  p-5 w-full" placeholder='Enter password' {...field}/>
                   </FormControl>
                   <FormMessage/>
                </FormItem>
                   
            )}/>

            
            <Button type="submit" className="w-full py-5 ">Submit</Button>
            
            
            
        </form>

    </Form>
    </div>
  )
}

export default SigninForm