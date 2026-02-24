export const existInWatchlist=(items,coin)=>{
    const coinId = coin?.id || coin?.coin?.id;

    for(let item of items){
        const itemId = item?.id || item?.coin?.id;
        if(itemId===coinId)return true;
    }

    return false;
}
