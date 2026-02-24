import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getUserWatchlist } from '@/State/Watchlist/Action'
import { BookmarkFilledIcon } from '@radix-ui/react-icons'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Watchlist = () => {
  const watchlist = useSelector((store) => store.watchlist)
  const items = Array.isArray(watchlist?.items) ? watchlist.items : []
  const dispatch= useDispatch()
  const handleRemoveFromWatchlist = (value) => {
   
    console.log(value);
  }

  useEffect(()=>{
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUserWatchlist(jwt));
    }
  }, [dispatch])

  return (
    <div className="p-5 lg:px-20">
          <h1 className="text-3xl font-bold pb-5">Watchlist</h1>
           <Table className="border-x">
           
            <TableHeader>
              <TableRow>
                   <TableHead className="py-5">Coin</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Volume</TableHead> 
                    <TableHead>Market Cap</TableHead>
                    <TableHead>24</TableHead>
                       <TableHead > Price</TableHead>
                       <TableHead className="text-right text-red-600"> Remove</TableHead>  
              </TableRow> 
           </TableHeader>
            <TableBody>
              {items.map((item,index)=> {
                const coin = item?.coin || item;
                const symbol = coin?.symbol?.toLowerCase() || "";
                const avatarSrc =
                  coin?.image?.large ||
                  coin?.image ||
                  (symbol ? `https://assets.coincap.io/assets/icons/${symbol}@2x.png` : "");
                const fallbackText =
                  coin?.symbol?.slice(0, 2)?.toUpperCase() ||
                  coin?.name?.slice(0, 2)?.toUpperCase() ||
                  "NA";

                return (
                <TableRow key={coin?.id || index}> 
                  <TableCell className="font-medium flex items-center gap-2">
                      <Avatar className="z-50"> 
                          <AvatarImage src={avatarSrc} alt={coin?.name || "coin"} />
                          <AvatarFallback>{fallbackText}</AvatarFallback>
                      </Avatar> 
                          <span>{coin?.name}</span> 
                  </TableCell> 
                  <TableCell>{coin?.symbol}</TableCell>
                  <TableCell>{coin?.total_volume}</TableCell>
                  <TableCell>{coin?.market_cap}</TableCell>
                  <TableCell>{coin?.price_change_percentage_24h}</TableCell>
                  <TableCell >${coin?.current_price}</TableCell>
                  <TableCell className="text-right ">
                    <Button variant="ghost" onClick={() => handleRemoveFromWatchlist(coin?.id)} size = "icon" className = "h-10 w-10 ">
                      
                      <BookmarkFilledIcon className="h-6 w-6"/>
                    </Button>
                  </TableCell>
                  </TableRow>
              )})}
            </TableBody>
          </Table>
        </div>
  )
}

export default Watchlist
