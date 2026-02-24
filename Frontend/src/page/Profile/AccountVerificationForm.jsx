import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useState } from "react";


const AccountVerificationForm = () => {
  const [value,setValue] = useState("");
  const handleSubmit=()=>{
    console.log(value); 
  }

  return (
    <div className="flex justify-center ">
      <div className="space-y-5 mt-10 w-full">
        <div className="flex justify-between items-center">
          <p> Email : </p>
          <p>vicky@gmail.com</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Send Otp</Button>  
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter Otp</DialogTitle> 
                  <DialogDescription>
                    Enter the 6-digit OTP sent to your email.
                  </DialogDescription>
                  </DialogHeader>
                  <div className="py-5 flex gap-10 justify-center items-center">
                    <InputOTP
                    value ={value}
                     onChange={(value)=>setValue(value)} 
                     maxLength={6} z>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
    <DialogClose asChild>
        <Button onClick={handleSubmit} className = {"w-[10rem]"}>
          Submit
        </Button>
    </DialogClose>
                  </div>
              </DialogContent>

          </Dialog>
        </div>

      </div>

    </div>
  )
}

export default AccountVerificationForm
