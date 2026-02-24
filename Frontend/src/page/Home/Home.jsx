import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'
import AssetTable from './AssetTable'
import StockChart from './StockChart'
import { Cross1Icon, DotIcon } from '@radix-ui/react-icons'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {  MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDispatch, useSelector } from 'react-redux'
import { getCoinList, getTop50CoinList } from '@/State/Coin/Action'

 const Home = () => {
        const [category,setCategory] = React.useState("all");
        const [inputValue,setInputValue] = React.useState("");
        const [isBotRelease,setIsBotRelease] = React.useState(false);
        const coin = useSelector((store) => store.coin)
        const dispatch = useDispatch();

        const handleBotRelease = () => {
            setIsBotRelease(!isBotRelease);
        }

        const handleCategoryChange = (value) => {
            setCategory(value)
        };


const handleChange = (e) => {
    setInputValue(e.target.value);
}
 const handleKeyPress = (e) => {   
     if(e.key === "Enter"){
        console.log( inputValue);
    }
    setInputValue("");
}

  useEffect(() =>{
    dispatch(getCoinList(1))
    dispatch(getTop50CoinList())
  },[dispatch])

  const displayedCoins = React.useMemo(() => {
    const list = Array.isArray(coin.coinList) ? coin.coinList : [];
    const top50 = Array.isArray(coin.top50) ? coin.top50 : [];

    if (category === "top50") {
      return top50;
    }

    if (category === "topGainers") {
      return [...list].sort(
        (a, b) => (b?.price_change_percentage_24h || 0) - (a?.price_change_percentage_24h || 0)
      );
    }

    if (category === "topLosers") {
      return [...list].sort(
        (a, b) => (a?.price_change_percentage_24h || 0) - (b?.price_change_percentage_24h || 0)
      );
    }

    return list;
  }, [category, coin.coinList, coin.top50])

  return (
    <div className='relative'>
        <div className='lg:flex'>
            <div className='lg:w-[50%] lg:broder-r'>

                <div className='p-3 flex items-center gap-4'>
                
                    <Button 
                    onClick={()=>handleCategoryChange("all")}
                    variant={category=="all" ? "default" : "outline"}
                    className="rounded-full">
                        All 
                    </Button>

                    <Button 
                    onClick={()=>handleCategoryChange("top50")}
                    variant={category=="top50" ? "default" : "outline"}
                    className="rounded-full">
                        Top 50 
                    </Button>

                    <Button 
                    onClick={()=>handleCategoryChange("topGainers")}
                    variant={category=="topGainers" ? "default" : "outline"}
                    className="rounded-full">
                        Top Gainers 
                    </Button>

                    <Button 
                    onClick={()=>handleCategoryChange("topLosers")}
                    variant={category=="topLosers" ? "default" : "outline"}
                    className="rounded-full">
                        Top Losers 
                    </Button>
                </div>
                <AssetTable coin = {displayedCoins} category={category}/>
            </div>  
            <div className="hidden lg:block lg:w-[50%] p-5">
                <StockChart coinId={"bitcoin"}/>
                <div className="flex gap-5 items-center ">
                    <div>
                        <Avatar>
                            <AvatarImage 
                            src={"https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628" }/>
                        </Avatar>
                    </div>
                    <div>
                    <div className="flex items-center gap-2 ">
                        <p>ETH</p>
                        <DotIcon className= "text-gray-400"></DotIcon>
                        <p className="text-sm text-gray-400">Ethereum</p>
                    </div>
                    <div className="flex items-end gap-2">
                    <p className="text-xl font-bold">5464</p>
                    <p className="text-red-600">
                        <span>-1319049822.578</span>
                        <span>(-0.29803%)</span>
                    </p>
                    </div>
                    </div>
                </div>
            </div>  
        </div>
        <section className="absolute bottom-5 right-5 z-40 flex flex-col justify-end items-end gap-2">
          { isBotRelease && <div className="rounded-md w-[20rem] md:w-[25rem] lg:w-[25rem] h-[70vh] bg-[#1e2329] border border-[#2b3139] shadow-lg">
            <div className="flex justify-end items-center border-b px-6 h-[12%]">
             <p>Chat Bot</p>
             <Button
             onClick = {handleBotRelease} variant="ghost" size="icon">
                <Cross1Icon />
             </Button>
            </div>
            <div className="h-[76%] flex flex-col overflow-y-auto gap-5 px-5 py-2 scroll-container">

                <div className="self-start pb-5 w-auto">
                        <div className="justify-end self-end px-5 py-2 rounded-md bg-[#181a20] border border-[#2b3139] w-auto">
                            <p>hi, Raam Arora</p>
                            <p>you can ask crypto related any question</p>  
                            <p>like, price, market cap extra...</p>

                         </div>
                </div>

               {[1,1,1,1].map((item, index) => (
                <div key={index} className={`${index % 2 == 0 ? "self-start" : "self-end"} pb-5 w-auto`}>

                       {index % 2 == 0 ? 
                         <div className="px-5 py-2 rounded-md bg-[#181a20] border border-[#2b3139] w-auto">
                            <p>prompt</p>
                         </div>
                        : 
                         <div className="px-5 py-2 rounded-md bg-[#f0b90b] text-[#14171c] w-auto">
                            <p>ans</p>
                         </div>
                       }

                </div>

                       ))}
            <div className="h-[12%] broder-t">
            <Input 
            className="w-full h-full broder-none outline-none"
            placeholder="Type your message here..."
            onChange={handleChange}
            value = {inputValue}
            onKeyPress={handleKeyPress}
            />
            </div>

            </div>

           </div>}

            <div className="relative w-[10rem] cursor-pointer group">
             <Button 
             onClick={handleBotRelease}
             className="w-full h-[3rem] gap-2 items-center" >  
                <MessageCircle size={25}
                className="fill-[#f0b90b] - rotate-90 stroke-none group-hover:fill-[#ffd24d]" />
                <span className="text-2xl">
                Chat Bot
                </span>
            </Button>
            </div>
        </section>
    </div>
  )
}

export default Home
