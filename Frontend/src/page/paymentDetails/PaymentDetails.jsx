import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PaymentDetialsForm from "./PaymentDetialsForm"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPaymentDetails } from "@/State/Withdrawal/Action"

const PaymentDetails = () => {
  const withdrawal = useSelector((store) => store?.withdrawal)
  const dispatch = useDispatch()

  useEffect(() => {
    const jwt = localStorage.getItem("jwt")
    if (jwt) {
      dispatch(getPaymentDetails({ jwt }))
    }
  }, [dispatch])

  if (!withdrawal) {
    return <div className="px-20 py-10">Loading...</div>
  }

  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold py-10">Payment Details</h1>
      {withdrawal.paymentDetails ? (
        <Card>
          <CardHeader>
            <CardTitle>{withdrawal.paymentDetails?.bankName}</CardTitle>
            <CardDescription>
              Account No :
              {String(withdrawal.paymentDetails?.accountNumber || "").replace(/.(?=.{4})/g, "*")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <p className="w-32">A/c Holder</p>
              <p className="text-gray-400"> : {(withdrawal.paymentDetails?.accountHolderName || withdrawal.paymentDetails?.accounHolderName)}</p>
            </div>
            <div className="flex items-center">
              <p className="w-32">IFSC Code</p>
              <p className="text-gray-400"> : {withdrawal.paymentDetails?.ifsc}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Add Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentDetialsForm />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PaymentDetails


