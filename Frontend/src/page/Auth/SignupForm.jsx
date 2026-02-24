import { Button } from '@/components/ui/button'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { register } from '@/State/Auth/Action'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

const SignupForm = () => {
    const dispatch= useDispatch()
    const form = useForm({
        resolver :"",
        defaultValues : {
            fullname : "",
            email : "",
            password : ""
    }
})
const onSubmit = (data) => {
    dispatch(register(data))
    console.log(data);
}
  return (
    <div className='px-10 py-2'> 
     <h1 className='text-xl font-bold text-center pb-5'>Cretae new Account</h1>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="fullname" render={({field})=> (
                <FormItem>
                    <FormLabel>Full Name</FormLabel>
                   <FormControl>
                    <Input 
                    
                    className=" border border-gray-700  p-5 w-full" placeholder='Enter your name' {...field}/>
                   </FormControl>
                   <FormMessage/>
                </FormItem>
                   
            )}/>

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

export default SignupForm