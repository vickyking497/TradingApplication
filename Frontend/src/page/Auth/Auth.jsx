import { Button } from "@/components/ui/button"
import SignupForm from "./SignupForm"
import { useLocation, useNavigate } from "react-router-dom"
import ForgotPasswordForm from "./ForgotPasswordForm"
import SigninForm from "./SigninForm"

const Auth = () => {
    const navigate=useNavigate()
    const location =useLocation();
    return(
    <div>
    <div className="fixed inset-0 bg-[#030712] bg-opacity-70 flex justify-center items-center">

         <div
        className="flex flex-col justify-center items-center
        h-[35rem] w-[30rem]
        rounded-md
        bg-black bg-opacity-60
        shadow-2xl shadow-white
        backdrop-blur-md p-8"
      >
<h1 className="text-6xl font-extrabold tracking-wide">
  <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">
    VIC
  </span>{" "}
  <span className="text-white">
    TRADING
  </span>
</h1>



            {location.pathname=="/signup" ? <section className="w-full">
                <SignupForm/>
                <div className="flex items-center justify-center">
                    <span>alreday have account?</span>
                    <Button onClick={()=>navigate("/signin")} variant="ghost">
                        signin
                    </Button>
                </div>
            </section> : location.pathname=="/forgot-password"?<section className="w-full">
                    <ForgotPasswordForm/>
                     <div className="flex items-center justify-center">
                    <span>back to login?</span>
                    <Button onClick={()=>navigate("/signin")} variant="ghost">
                        signin
                    </Button>
                </div>
            </section>: <section className="w-full">
                <SigninForm/>
                 <div className="flex items-center justify-center">
                    <span>Don't have account?</span>
                    <Button onClick={()=>navigate("/signup")} variant="ghost">
                        signup
                    </Button>
                </div>
                <div className="mt-10">
                    <Button
                    className='w-full py-5' 
                    onClick={()=>navigate("/forgot-password")} variant="outline">
                        Forgot Password
                    </Button>
                </div>
                </section>}

        </div>

    </div>


    </div>
)}

export default Auth


