import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAllOrdersForUser } from '@/State/Order/Action'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Activity = () => {
  const dispatch = useDispatch();
  const order = useSelector((store) => store.order);
  const orders = Array.isArray(order?.orders) ? order.orders : [];
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, currentPage, pageSize]);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(()=>{
    dispatch(getAllOrdersForUser({jwt:localStorage.getItem("jwt")}))
  }, [dispatch])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages])
  
  return (
     <div className="p-5 lg:px-20">
              <h1 className="text-3xl font-bold pb-5">Activity</h1>
               <Table className="border-x">
               
                <TableHeader>
                  <TableRow>
                       <TableHead className="py-5">Date&Time</TableHead>
                        <TableHead>Trading Pair</TableHead>
                        <TableHead>Buy Price</TableHead> 
                        <TableHead>Sell Price</TableHead>
                        <TableHead>Order Type</TableHead>
                           <TableHead >profit?Loss</TableHead>
                           <TableHead className="text-right "> Value</TableHead>  
                  </TableRow> 
               </TableHeader>
                <TableBody>
                  {paginatedOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-gray-400">
                        No activity found
                      </TableCell>
                    </TableRow>
                  )}
                  {paginatedOrders.map((item,index)=> {
                    const coin = item?.orderItem?.coin || {};
                    const symbol = (coin?.symbol || "").toUpperCase();
                    const symbolLower = (coin?.symbol || "").toLowerCase();
                    const buyPrice = Number(item?.orderItem?.buyPrice || 0);
                    const sellPrice = Number(item?.orderItem?.sellPrice || 0);
                    const quantity = Number(item?.orderItem?.quantity || 0);
                    const value = Number(item?.price || 0);
                    const hasBothPrices = buyPrice > 0 && sellPrice > 0;
                    const profitLoss = hasBothPrices ? (sellPrice - buyPrice) * quantity : 0;
                    const ts = item?.timeStamp ? new Date(item.timeStamp) : null;
                    const dateText = ts ? ts.toLocaleDateString() : "-";
                    const timeText = ts ? ts.toLocaleTimeString() : "-";
                    const avatarSrc =
                      coin?.image ||
                      (symbolLower ? `https://assets.coincap.io/assets/icons/${symbolLower}@2x.png` : "");
                    const fallbackText =
                      symbol.slice(0, 2) ||
                      coin?.name?.slice(0, 2)?.toUpperCase() ||
                      "NA";

                    return (
                    <TableRow key={item?.id || index}> 
                     <TableCell>
                      <p>{dateText}</p>
                      <p className="text-gray-400">{timeText}</p>
                     </TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                          <Avatar className="z-50"> 
                              <AvatarImage src={avatarSrc} /> 
                              <AvatarFallback>{fallbackText}</AvatarFallback>
                          </Avatar> 
                              <span>{coin?.name ? `${coin.name}${symbol ? `/${symbol}` : ""}` : "-"}</span> 
                      </TableCell> 
                      <TableCell>{buyPrice ? buyPrice.toFixed(2) : "-"}</TableCell>
                      <TableCell>{sellPrice ? sellPrice.toFixed(2) : "-"}</TableCell>
                      <TableCell>{item?.orderType || "-"}</TableCell>
                      <TableCell className={profitLoss >= 0 ? "text-green-500" : "text-red-500"}>
                        {hasBothPrices ? profitLoss.toFixed(2) : "-"}
                      </TableCell>
                      <TableCell className="text-right ">{value ? `$${value.toFixed(2)}` : "-"}</TableCell>
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
  )
}

export default Activity
