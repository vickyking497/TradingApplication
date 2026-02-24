import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useEffect, useMemo, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom'

const AssetTable = ({ coin = [], category = "all" }) => {


  const navigate=useNavigate();
  const location = useLocation();
  const rows = Array.isArray(coin) ? coin : [];
  const searchQuery = (new URLSearchParams(location.search).get("q") || "").toLowerCase().trim();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;
    return rows.filter((item) =>
      [item?.name, item?.symbol, item?.id]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery)
    );
  }, [rows, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery])


  

  return (
    <>
    <ScrollArea className={`${category=="all"?"h-[74vh]":"h-[82vh]"}`}>
    <Table>
    
       <TableHeader>
    <TableRow>
         <TableHead className="w-[100px]">Coin</TableHead>
          <TableHead>SYMBOL</TableHead>
          <TableHead>VOLUME</TableHead> 
          <TableHead>MARKET CAP</TableHead>
          <TableHead>24h</TableHead>
          <TableHead className="text-right">PRICE</TableHead> 
    </TableRow> 
  </TableHeader>
  <TableBody>
    {filteredRows.length === 0 && (
      <TableRow>
        <TableCell colSpan={6} className="text-center text-sm text-gray-400">
          {searchQuery ? "No matching coins found" : "No coins found"}
        </TableCell>
      </TableRow>
    )}
    {paginatedRows.map((item)=> ( 
      <TableRow key={item.id}> 
        <TableCell onClick={()=>navigate(`/stock-details/${item.id}`)} className="font-medium flex items-center gap-2 cursor-pointer">
            <Avatar> 
                <AvatarImage src={item.image}/> 
                
                </Avatar> 
                <span>{item.name}</span> 
        </TableCell> 
        <TableCell>{item.symbol}</TableCell>
        <TableCell>{item.total_volume}</TableCell>
        <TableCell>{item.market_cap}</TableCell>
        <TableCell>{item.price_change_percentage_24h}</TableCell>
        <TableCell className="text-right">${item.current_price}</TableCell>
        </TableRow>
    ))}
  </TableBody>
  
 
</Table>
  </ScrollArea>
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
  </>
  )
}

export default AssetTable
