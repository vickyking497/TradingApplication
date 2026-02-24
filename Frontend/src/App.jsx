
import { Route, Routes } from 'react-router-dom'
import { Button } from './components/ui/button'
import Home from './page/Home/Home'
import Navbar from './page/Navbar/Navbar'
import Portfolio from './page/Portfolio/Portfolio'
import Activity from './page/Activity/Activity'
import Wallet from './page/Wallet/Wallet'
import Withdrawal from './page/Withdrawal/Withdrawal'
import PaymentDetails from './page/paymentDetails/PaymentDetails'
import StockDetails from './page/StockDetails/StockDetails'
import Watchlist from './page/Watchlist/Watchlist'
import Profile from './page/Profile/Profile'
import SearchCoin from './page/Search/SearchCoin'
import NotFound from './page/NotFound/NotFound'
import Auth from './page/Auth/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getUser } from './State/Auth/Action'

function App() {
 
  const auth = useSelector((store) => store.auth);
  const dispatch=useDispatch()

  useEffect(()=>{
    const token = auth.jwt || localStorage.getItem("jwt")
    if (token) {
      dispatch(getUser(token))
    }
  },[auth.jwt, dispatch])
  return (
    <>
    
   {auth.user ? <div>
<Navbar/>
     <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/portfolio' element={<Portfolio/>} />
      <Route path='/activity' element={<Activity/>} />
      <Route path='/wallet' element={<Wallet/>} />
      <Route path='/withdrawal' element={<Withdrawal/>} />
      <Route path='/payment-details' element={<PaymentDetails/>} />
      <Route path='/market' element={<StockDetails/>} />
      <Route path='/stock-details/:coinId' element={<StockDetails/>} />
      <Route path='/watchlist' element={<Watchlist/>} />
      <Route path='/profile' element={<Profile/>} />
      <Route path='/search' element={<SearchCoin/>} />
      <Route path='*' element={<NotFound/>} />

     </Routes>
    </div> : <Auth/>}
     

   
    </>
  )
}

export default App
