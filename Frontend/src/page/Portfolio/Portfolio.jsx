import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getUserAssets } from '@/State/Asset/Action'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const Portfolio = () => {

  const location = useLocation();
  const dispatch = useDispatch();
  const asset = useSelector((store) => store.asset)
  const assets = Array.isArray(asset?.userAssets) ? asset.userAssets : [];
  const searchQuery = (new URLSearchParams(location.search).get("q") || "").toLowerCase().trim();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filteredAssets = useMemo(() => {
    if (!searchQuery) return assets;
    return assets.filter((item) =>
      [item?.coin?.name, item?.coin?.symbol]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery)
    );
  }, [assets, searchQuery]);
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAssets.slice(start, start + pageSize);
  }, [filteredAssets, currentPage, pageSize]);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(()=>{
    dispatch(getUserAssets(localStorage.getItem("jwt")))
  },[dispatch])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery])

  return (
    <div className="p-5 lg:px-20">
      <h1 className="text-3xl font-bold pb-5">Portfolio</h1>
      <div className="w-full overflow-x-auto">
       <Table className="min-w-[760px]">
       
        <TableHeader>
          <TableRow>
               <TableHead className="">Asset</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Volume</TableHead> 
                <TableHead>Market Cap</TableHead>
                <TableHead>24</TableHead>
                <TableHead className="text-right"> Price</TableHead> 
          </TableRow> 
        </TableHeader>
        <TableBody>
          {paginatedAssets.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm text-gray-400">
                {searchQuery ? "No matching assets found" : "No assets found"}
              </TableCell>
            </TableRow>
          )}
          {paginatedAssets.map((item,index)=> {
            const symbol = item?.coin?.symbol?.toLowerCase() || "";
            const avatarSrc =
              item?.coin?.image ||
              (symbol ? `https://assets.coincap.io/assets/icons/${symbol}@2x.png` : "");
            const fallbackText =
              item?.coin?.symbol?.slice(0, 2)?.toUpperCase() ||
              item?.coin?.name?.slice(0, 2)?.toUpperCase() ||
              "NA";
            const quantity = Number(item?.quantity || 0);
            const marketCap = Number(item?.coin?.market_cap || 0);
            const change24hPercent = Number(item?.coin?.price_change_percentage_24h || 0);
            const currentPrice = Number(item?.coin?.current_price || 0);

            return (
            <TableRow key={index}> 
              <TableCell className="font-medium flex items-center gap-2">
                  <Avatar className="z-50"> 
                      <AvatarImage src={avatarSrc} alt={item?.coin?.name || "asset"} />
                      <AvatarFallback>{fallbackText}</AvatarFallback>
                  </Avatar> 
                      <span>{item.coin.name}</span> 
              </TableCell> 
              <TableCell>{item.coin.symbol.toUpperCase()}</TableCell>
              <TableCell>{quantity}</TableCell>
              <TableCell>${marketCap.toLocaleString()}</TableCell>
              <TableCell className={change24hPercent >= 0 ? "text-green-500" : "text-red-500"}>
                {change24hPercent.toFixed(2)}%
              </TableCell>
              <TableCell className="text-right">${currentPrice.toLocaleString()}</TableCell>
              </TableRow>
          )})}
        </TableBody>
      </Table>
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
  )
}

export default Portfolio
