import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { addPaymentDetails } from '@/State/Withdrawal/Action'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

const PaymentDetialsForm = () => {
    const dispatch = useDispatch();
    const form = useForm({
        defaultValues : {
            accountHolderName : "",
            ifscCode : "",
            accountNumber : "",
            confirmAccountNumber : "",
            bankName : ""
    }
})
const onSubmit = (data) => {
    dispatch(addPaymentDetails({
        paymentDetails:data,
        jwt:localStorage.getItem("jwt")    
    }))
    console.log(data);
}
  return (
    <div className='px-10 py-2'> 
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="accountHolderName" render={({field})=> (
                <FormItem>
                    <FormLabel>Account Holder Name</FormLabel>
                   <FormControl>
                    <Input 
                    
                    className=" border border-gray-700  p-5 w-full" placeholder='Enter account holder name' {...field}/>
                   </FormControl>
                   <FormMessage/>
                </FormItem>
                   
            )}/>

             <FormField control={form.control} name="ifscCode" render={({field})=> (
                <FormItem>
                    <FormLabel>IFSC Code</FormLabel>
                   <FormControl>
                    <Input 
                   
                    className=" border border-gray-700  p-5 w-full" placeholder='Enter IFSC Code' {...field}/>
                   </FormControl>
                   <FormMessage/>
                </FormItem>
                   
            )}/>

             <FormField control={form.control} name="accountNumber" render={({field})=> (
                <FormItem>
                    <FormLabel>Account Number</FormLabel>
                   <FormControl>
                    <Input 
                  
                    className=" border border-gray-700  p-5 w-full" placeholder='Enter account number' {...field}/>
                   </FormControl>
                   <FormMessage/>
                </FormItem>
                   
            )}/>

            <FormField control={form.control} name="confirmAccountNumber" render={({field})=> (
                <FormItem>
                    <FormLabel>Confirm Account Number</FormLabel>
                   <FormControl>
                    <Input 
                    className=" border border-gray-700  p-5 w-full"
                    placeholder='Confirm account number' {...field}/>
                   </FormControl>
                   <FormMessage/>
                </FormItem>
                   
            )}/>

            <FormField control={form.control} name="bankName" render={({field})=> (
                <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                   <FormControl>
                    <Input 
                  
                    className=" border border-gray-700  p-5 w-full" placeholder='Enter bank name' {...field}/>
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

export default PaymentDetialsForm
