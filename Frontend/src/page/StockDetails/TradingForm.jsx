import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getUserAssets } from '@/State/Asset/Action'
import { payOrder } from '@/State/Order/Action'
import { getUserWallet } from '@/State/Wallet/Action'
import { DotIcon } from '@radix-ui/react-icons'


import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const TradingForm = () => {

    const [orderType,setOrderType] =useState("BUY")
    const [amount,setAmount] = useState("");
    const [quantity,setQuantity] = useState("");
    const coin = useSelector((store) => store.coin);
    const wallet = useSelector((store) => store.wallet);
    const asset = useSelector((store) => store.asset);
    const order = useSelector((store) => store.order);
    const [formError, setFormError] = useState("");
    const [didSubmit, setDidSubmit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const coinDetails = coin?.coinDetails;
    const symbol = coinDetails?.symbol?.toUpperCase() || "-";
    const coinName = coinDetails?.name || "-";
    const currentPrice = coinDetails?.market_data?.current_price?.usd || 0;
    const priceChange24h = coinDetails?.market_data?.price_change_24h || 0;
    const priceChangePercentage24h = coinDetails?.market_data?.price_change_percentage_24h || 0;
    const imageSrc =
      coinDetails?.image?.large ||
      coinDetails?.image ||
      (coinDetails?.symbol
        ? `https://assets.coincap.io/assets/icons/${coinDetails.symbol.toLowerCase()}@2x.png`
        : "");
    const matchedUserAsset = Array.isArray(asset?.userAssets)
      ? asset.userAssets.find(
          (item) =>
            item?.coin?.id === coinDetails?.id ||
            item?.coin?.symbol?.toLowerCase() === coinDetails?.symbol?.toLowerCase()
        )
      : null;
    const availableQuantity = Number(matchedUserAsset?.quantity ?? 0);
    const availableAmount = Number(wallet?.userWallet?.balance ?? 0);
    const buyExceedsAvailable =
      orderType === "BUY" && Number(amount || 0) > availableAmount;
    const sellExceedsAvailable =
      orderType === "SELL" && Number(quantity || 0) > availableQuantity;


    const handleChange =(e)=>{
        const inputValue = e.target.value ?? "";
        setFormError("");
        setDidSubmit(false);
        const price = coinDetails?.market_data?.current_price?.usd;
        if (orderType === "BUY") {
            setAmount(inputValue);
            const volume = calculateBuyCost(inputValue, price);
            setQuantity(volume);
            return;
        }
        setQuantity(inputValue);
        const sellAmount = calculateSellValue(inputValue, price);
        setAmount(sellAmount);
    };

    const calculateBuyCost =(amountValue,price)=>{
        if (!price || amountValue === "") return "";
        let volume = amountValue/price

        let decimalplaces = Math.max(2,price.toString().split(".")[0].length)

        return volume.toFixed(decimalplaces)
    }
    const calculateSellValue = (quantityValue, price) => {
        if (!price || quantityValue === "") return "";
        const total = Number(quantityValue || 0) * Number(price);
        return total.toFixed(2);
    };

    useEffect(()=>{
        const jwt = localStorage.getItem("jwt");
        dispatch(getUserWallet(jwt));
        dispatch(getUserAssets(jwt));
    },[dispatch]);

    const handleBuyCrypto = async () =>{
        if (isSubmitting || order.loading) return;
        setDidSubmit(true);
        const parsedAmount = Number(amount || 0);
        const parsedQuantity = Number(quantity || 0);
        const selectedCoinId = coinDetails?.id;
        if (!selectedCoinId) {
            setFormError("Coin is not loaded yet. Please try again.");
            return;
        }
        if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
            setFormError("Enter a valid quantity.");
            return;
        }
        if (orderType === "BUY" && (!Number.isFinite(parsedAmount) || parsedAmount <= 0)) {
            setFormError("Enter a valid amount.");
            return;
        }
        if (orderType === "BUY" && parsedAmount > availableAmount) {
            setFormError("Insufficient funds for this transaction.");
            return;
        }
        if (orderType === "SELL" && parsedQuantity > availableQuantity) {
            setFormError("Insufficient quantity to sell.");
            return;
        }
        setFormError("");
        setIsSubmitting(true);
        try {
            await dispatch(payOrder({
              jwt:localStorage.getItem("jwt"),
              amount: parsedAmount,
              orderData:{
                coinId:selectedCoinId,
                quantity: parsedQuantity,
                orderType,
              } , 
            })
            );
            await dispatch(getUserWallet(localStorage.getItem("jwt")));
            await dispatch(getUserAssets(localStorage.getItem("jwt")));
            setAmount("");
            setQuantity("");
            setFormError("");
            setDidSubmit(false);
        } catch (error) {
            setFormError(error.message || "Order failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className="space-y-10 p-5">

        <div>
            <div className='flex gap-4 items-center justify-between'>
                <Input
                className="py-7 focus:outline-none"
                placeholder={orderType === "BUY" ? "Enter Amount..." : "Enter Quantity to Sell..."}
                onChange={handleChange}
                value={String(orderType === "BUY" ? (amount ?? "") : (quantity ?? ""))}
                type = "number"
                name = "amount"
                />
                <div>
                    <p className='border text-2xl flex justify-center items-center w-36 h-14 rounded-md'>
                        {orderType === "BUY" ? quantity : amount}
                    </p>
                </div>
            </div>
            {buyExceedsAvailable && <h1 className='text-red-600 text-center pt-4'>
                Insufficient funds for this transaction
            </h1>
            }
            {sellExceedsAvailable && <h1 className='text-red-600 text-center pt-4'>
                Insufficient quantity to sell
            </h1>
            }
            {formError && <h1 className='text-red-600 text-center pt-2'>{formError}</h1>}
            {didSubmit && order.error && <h1 className='text-red-600 text-center pt-2'>{order.error}</h1>}
        </div>
         <div className='flex gap-5 items-center'>
          <div>
                    <Avatar>
                      <AvatarImage src={imageSrc} />
                      <AvatarFallback>{symbol.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div> 
                  <div className="flex items-center gap-2">
                    <p>{symbol}</p>
                    <DotIcon className="text-gray-400"/>
                    <p className=' text-gray-400'>{coinName}</p>
                  </div>
                  <div className='flex items-end gap-2'>
                    <p className='text-xl font-bold'>{currentPrice}</p>
                    <p className='text-red-600'>
                        <span>{priceChange24h}</span>
                        <span>({priceChangePercentage24h}%)</span>
        
                    </p>
                  </div> 
                    </div>
        </div>
            <div className='flex items-center justify-between'>
                <p>Order Type</p>
                <p>Market Order</p>
            </div>

            <div className='flex items-center justify-between'>
                <p>{orderType=="BUY"? "Available amount ": "Available quantity"}</p>
                <p>{orderType=="BUY"? "$" +wallet.userWallet?.balance: availableQuantity}</p>
            </div>
            <div>
                <Button
                disabled={buyExceedsAvailable || sellExceedsAvailable || order.loading || isSubmitting || !coinDetails?.id || !amount}
                onClick={handleBuyCrypto}
                className={`w-full py-6 
                    ${orderType=="SELL"?"bg-red-600 text-white":""}`}>
                    {(order.loading || isSubmitting) ? "Processing..." : orderType}
                </Button>
                <Button
                variant="links"
                className="w-full mt-5 text-xl"
                onClick={() =>{
                    setOrderType(orderType=="BUY"?"SELL": "BUY");
                    setAmount("");
                    setQuantity("");
                    setFormError("");
                    setDidSubmit(false);
                }} >
                    {orderType=="BUY" ? "or Sell" : "or Buy"}
                </Button>
            </div>
             

    </div>
  )
}

export default TradingForm
