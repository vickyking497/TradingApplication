import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BookmarkFilledIcon, DotIcon } from '@radix-ui/react-icons'
import { BookmarkIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TradingForm from './TradingForm'
import StockChart from '../Home/StockChart'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoinDetails } from '@/State/Coin/Action'
import { addItemToWatchlist, getUserWatchlist } from '@/State/Watchlist/Action'
import { existInWatchlist } from '@/Utils/existInWatchlist'

const StockDetails = () => {

  const coin = useSelector((store) => store.coin)
  const watchlist = useSelector((store) => store.watchlist)

   const dispatch = useDispatch()
   const {coinId} =useParams();
   
   

   useEffect(() => {

    if (!coinId) return;
    dispatch(fetchCoinDetails({coinId,jwt:localStorage.getItem("jwt")}))

   },[coinId, dispatch])

   useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUserWatchlist(jwt));
    }
   }, [dispatch])

   const handleAddToWatchlist=()=>{
    dispatch(addItemToWatchlist({coinId:coin.coinDetails?.id,jwt:localStorage.getItem("jwt")}))
   }
   
  return (
    <div className='p-5 mt-5 '>
      <div className='flex justify-between'>
        <div className='flex gap-5 items-center'>
          <div>
            <Avatar>
              <AvatarImage src ={coin.coinDetails?.image?.large || coin.coinDetails?.image}/>
            </Avatar>
          </div>
          <div> 
          <div className="flex items-center gap-2">
            <p>{coin.coinDetails?.name}</p>
            <DotIcon className="text-gray-400"/>
            <p className=' text-gray-400'>{coin.coinDetails?.market_data?.current_price?.usd}</p>
          </div>
          <div className='flex items-end gap-2'>
            <p className='text-xl font-bold'></p>
            <p className='text-red-600'>
             
                <span>{coin.coinDetails?.market_data?.market_cap_change_24h}</span>
                <span>({coin.coinDetails?.market_data?.market_cap_change_percentage_24h}%)</span>

            </p>
          </div> 
            </div>
        </div>
        <div>
          <Button onClick = {handleAddToWatchlist}>
            {existInWatchlist(watchlist.items || [],coin.coinDetails)? <BookmarkFilledIcon className='h-6 w-6'/> :
            <BookmarkIcon className='h-6 w-6'/>
            }
          </Button>
          <Dialog>
  <DialogTrigger asChild>
    <Button size="lg">Trade</Button>
    </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>How much you want to spend?</DialogTitle>
      <DialogDescription>
        Enter the amount and place a buy or sell market order.
      </DialogDescription>
    </DialogHeader>
    <TradingForm/>
  </DialogContent>
</Dialog>
        </div>
      </div>
      <div className='mt-20'>
              <StockChart coinId={coinId}/>
      </div>
      
    </div>
  )
}

export default StockDetails
