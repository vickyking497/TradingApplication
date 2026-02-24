import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentDetails, withdrawalRequest } from '@/State/Withdrawal/Action';

const WithdrawalForm = () => {
  const [amount, setAmount] = React.useState("");
  const dispatch = useDispatch();
  const wallet = useSelector((store) => store.wallet);
  const withdrawal = useSelector((store) => store.withdrawal);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt && !withdrawal?.paymentDetails) {
      dispatch(getPaymentDetails({ jwt }));
    }
  }, [dispatch, withdrawal?.paymentDetails]);

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handeleSubmit = () => {
    dispatch(withdrawalRequest({amount, jwt: localStorage.getItem('jwt')}));
    console.log(amount);
  };

  const accountNumber = String(withdrawal?.paymentDetails?.accountNumber || '');
  const maskedAccountNumber = accountNumber ? accountNumber.replace(/.(?=.{4})/g, '*') : 'Not added';

  return (
    <div className='pt-10 space-y-5'>
      <div className='flex justify-between items-center rounded-md bg-[#181a20] border border-[#2b3139] text-xl font-bold px-5 py-4'>
        <p>Available Balance</p>
        <p>${wallet?.userWallet?.balance ?? 0}</p>
      </div>

      <div className='flex flex-col items-center'>
        <h1>Enter Withdrawal Amount</h1>
        <div className='flex items-center justify-center'>
          <Input
            onChange={handleChange}
            value={amount}
            className='py-7 border-none outline-none focus:outline-none px-0 text-center text-2xl'
            placeholder='$9999'
            type='number'
          />
        </div>
      </div>

      <div>
        <p className='pb-2'>Transfer to</p>
        <div className='flex items-center gap-5 border py-2 px-5 rounded-md'>
          <img
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Razorpay_logo.svg/1200px-Razorpay_logo.svg.png'
            alt='bank'
            className='h-8 w-8'
          />
          <div>
            <p className='text-xl font-bold text-white'>
              {withdrawal?.paymentDetails?.bankName || 'Add payment details first'}
            </p>
            <p className='text-xs text-gray-300'>{maskedAccountNumber}</p>
          </div>
        </div>
      </div>

      <DialogClose asChild>
        <Button onClick={handeleSubmit} className='w-full py-7 text-xl'>
          Withdraw
        </Button>
      </DialogClose>
    </div>
  );
};

export default WithdrawalForm
