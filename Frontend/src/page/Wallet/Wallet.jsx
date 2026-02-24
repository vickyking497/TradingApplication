import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { CopyIcon, ReloadIcon, ShuffleIcon, UpdateIcon, UploadIcon } from '@radix-ui/react-icons'
import { DollarSign, WalletIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import TopUpForm from './TopUpForm'
import WithdrawalForm from './WithdrawalForm'
import TransferForm from './TransferForm'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { depositMoney, getUserWallet, getWalletTransactions } from '@/State/Wallet/Action'
import { useLocation, useNavigate } from 'react-router-dom'

const getTransactionSignedAmount = (item) => {
  const rawAmount = Math.abs(Number(item?.amount || 0));
  const directionText = String(
    item?.direction || item?.transactionType || item?.entryType || item?.side || ""
  ).toLowerCase();
  const labelText = `${item?.purpose || ""} ${item?.type || ""}`.toLowerCase();

  const looksLikeCredit =
    /(credit|deposit|received|receive|top[\s-]?up|add money|incoming)/.test(directionText) ||
    /(deposit|received|top[\s-]?up|add money|incoming)/.test(labelText);
  const looksLikeDebit =
    /(debit|withdraw|withdrawal|sent|send|outgoing|payout)/.test(directionText) ||
    /(withdraw|withdrawal|sent|send|outgoing|bank account withdrawal|transfer to)/.test(labelText);

  if (looksLikeCredit && !looksLikeDebit) return rawAmount;
  if (looksLikeDebit && !looksLikeCredit) return -rawAmount;

  const numericAmount = Number(item?.amount || 0);
  return Number.isNaN(numericAmount) ? 0 : numericAmount;
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const Wallet = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const wallet = useSelector((store) => store.wallet)
  const transactions = Array.isArray(wallet.transactions) ? wallet.transactions : [];
  const searchQuery = (new URLSearchParams(location.search).get("q") || "").toLowerCase().trim();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    return transactions.filter((item) =>
      [item?.purpose, item?.type, item?.date, item?.createdAt, item?.amount]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery)
    );
  }, [transactions, searchQuery]);
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(()=>{
    handleWalletRefresh();
  },[])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("order_id");
    const paymentId = searchParams.get("razorpay_payment_id") || searchParams.get("payment_id");

    if (orderId && paymentId) {
      dispatch(
        depositMoney({
          jwt: localStorage.getItem("jwt"),
          orderId,
          paymentId,
          navigate,
        })
      );
    }
  }, [dispatch, location.search, navigate]);

  const handleFetchUserWallet=()=>{
    dispatch(getUserWallet(localStorage.getItem("jwt")))
  }
  const handleFetchWalletTransactions = () => {
    dispatch(getWalletTransactions({ jwt: localStorage.getItem("jwt") }));
  };
  const handleWalletRefresh = () => {
    handleFetchUserWallet();
    handleFetchWalletTransactions();
  };
  return (
    <div className="flex flex-col items-center">
      
      <div className='pt-10 w-full lg:w-[60%]'>
        <Card>
          <CardHeader className ="pb-9">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">

                <WalletIcon size={30}/>
                <div>
                  <CardTitle className="text-2xl">My Wallet</CardTitle>
                  <div className="flex items-center gap-2">
                    <p  className='text-slate-400 text-sm'>
                      #{wallet.userWallet?.id}
                    </p>
                    <CopyIcon size={12} className="cursor-pointer hover:text-[#f0b90b] "/>
                  </div>
                </div>
              </div>
              <div>
                <ReloadIcon onClick={handleWalletRefresh} className="w-6 h-6 cursor-pointer hover:text-[#f0b90b]"/>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign/>
              <span className="text-3xl font-semibold">
                {wallet.userWallet.balance}
              </span>
            </div>
            <div className="flex gap-7 mt-5">
              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover:text-[#f0b90b] cursor-pointer rounded-md bg-[#1e2329] border border-[#2b3139] flex flex-col items-center justify-center shadow-sm">
                    <UploadIcon/>
                    <span className="text-sm mt-2">Add Money</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Top up your wallet
                    </DialogTitle>
                    <DialogDescription>
                      Add funds securely to your wallet balance.
                    </DialogDescription>
                  </DialogHeader>
                  <TopUpForm/>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover:text-[#f0b90b] cursor-pointer rounded-md bg-[#1e2329] border border-[#2b3139] flex flex-col items-center justify-center shadow-sm">
                    <UploadIcon/>
                    <span className="text-sm mt-2">Withdrawal</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Request Withdrawal
                    </DialogTitle>
                    <DialogDescription>
                      Withdraw available wallet balance to your saved account.
                    </DialogDescription>
                  </DialogHeader>
                  <WithdrawalForm/>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover:text-[#f0b90b] cursor-pointer rounded-md bg-[#1e2329] border border-[#2b3139] flex flex-col items-center justify-center shadow-sm">
                    <ShuffleIcon/>
                    <span className="text-sm mt-2">Transfer</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                      Transfer to other  wallet
                    </DialogTitle>
                    <DialogDescription>
                      Transfer funds to another wallet by wallet ID.
                    </DialogDescription>
                  </DialogHeader>
                  <TransferForm onSuccess={handleWalletRefresh}/>
                </DialogContent>
              </Dialog>
            </div>

          </CardContent>
        </Card>

        <div className="py-5 pt-10">
          <div className="flex gap-2 items-center pb-5">
            <h1 className="text-2xl font-semibold ">History</h1>
            <UpdateIcon onClick={handleFetchWalletTransactions} className="h-7 w-7 p-0 cursor-pointer hover:text-[#f0b90b]"/>
        </div >
        <div  className="space-y-5">
         {paginatedTransactions.map((item,index) =>  {
           const signedAmount = getTransactionSignedAmount(item);
           return <div key={item.id || index}>
            
              <Card className=" px-5 flex justify-between items-center pd-2">
                <div className="flex items-center gap-5">
                  <Avatar>
                    <AvatarFallback> 
                      <ShuffleIcon className=""/>
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h1>{item.purpose || item.type || "Wallet Transfer"}</h1>
                    <p className="text-sm text-gray-400">{formatDateTime(item?.date || item?.createdAt)}</p>

                  </div>

                </div>
                <div>
                  <p className={`${signedAmount >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {signedAmount >= 0 ? "+" : "-"}${Math.abs(signedAmount)}
                  </p>
                </div>

              </Card>
           

          </div>})}
          {paginatedTransactions.length === 0 && (
            <Card className="px-5 py-4 text-sm text-gray-400">
              {searchQuery ? "No matching wallet transactions found" : "No wallet transactions found"}
            </Card>
          )}
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Rows per page:</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {pageNumbers.map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
      </div>
      </div>
      </div>

    </div>
  )
}

export default Wallet
