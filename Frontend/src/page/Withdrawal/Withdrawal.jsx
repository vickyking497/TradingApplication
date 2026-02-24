import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getWithdrawalHistory } from '@/State/Withdrawal/Action';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

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

const Withdrawal = () => {
  const location = useLocation();
   const dispatch = useDispatch();
  const withdrawal = useSelector((store) => store.withdrawal);
  const history = Array.isArray(withdrawal?.history) ? withdrawal.history : [];
  const searchQuery = (new URLSearchParams(location.search).get("q") || "").toLowerCase().trim();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filteredHistory = useMemo(() => {
    if (!searchQuery) return history;
    return history.filter((item) =>
      [item?.date, item?.status, item?.amount, "bank"]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery)
    );
  }, [history, searchQuery]);
  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / pageSize));
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHistory.slice(start, start + pageSize);
  }, [filteredHistory, currentPage, pageSize]);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(()=>{
    dispatch(getWithdrawalHistory(localStorage.getItem("jwt")))
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
                  <h1 className="text-3xl font-bold pb-5">Withdrawal</h1>
                   <Table className="border-x">
                   
                    <TableHeader>
                      <TableRow>
                           <TableHead className="py-5">Date</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Amount</TableHead> 
                            <TableHead className="text-right "> Status</TableHead>  
                      </TableRow> 
                   </TableHeader>
                    <TableBody>
                      {paginatedHistory.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-sm text-gray-400">
                            {searchQuery ? "No matching withdrawals found" : "No withdrawals found"}
                          </TableCell>
                        </TableRow>
                      )}
                      {paginatedHistory.map((item,index)=> ( 
                        <TableRow key={index}> 
                         <TableCell>
                          <p>{formatDateTime(item?.date || item?.createdAt)}</p>
                         </TableCell>
                          <TableCell>Bank</TableCell>
                          <TableCell>${item.amount}</TableCell>
                          <TableCell className="text-right ">{item.status}</TableCell>
                          </TableRow>
                      ))}
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

export default Withdrawal
