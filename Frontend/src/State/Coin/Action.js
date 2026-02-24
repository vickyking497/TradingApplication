import axios from "axios";
import { FETCH_COIN_BY_ID_FAILURE, FETCH_COIN_BY_ID_REQUEST, FETCH_COIN_BY_ID_SUCCESS, FETCH_COIN_DETAILS_FAILURE, FETCH_COIN_DETAILS_REQUEST, FETCH_COIN_DETAILS_SUCCESS, FETCH_COIN_LIST_FAILURE, FETCH_COIN_LIST_REQUEST, FETCH_COIN_LIST_SUCCESS, FETCH_MARKET_CHART_FAILURE, FETCH_MARKET_CHART_REQUEST, FETCH_MARKET_CHART_SUCCESS, FETCH_TOP_50_COINS_FAILURE, FETCH_TOP_50_COINS_REQUEST, FETCH_TOP_50_COINS_SUCCESS, SEARCH_COIN_FAILURE, SEARCH_COIN_REQUEST, SEARCH_COIN_SUCCESS } from "./ActionType";
import { baseUrl } from "@/config/api";
import api from "@/config/api";

const normalizeJwt = (jwt) => (jwt || "").replace(/^Bearer\s+/i, "").trim();
const inFlight = new Set();

const getAuthConfig = (jwt) => {
    const token = normalizeJwt(jwt || localStorage.getItem("jwt"));
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const getCoinList=(page)=>async(dispatch)=>{

    dispatch({type:FETCH_COIN_LIST_REQUEST})

    try {
        const {data}=await axios.get(`${baseUrl}/coins?page=${page}`);
        console.log("Coin List",data);
        dispatch({type:FETCH_COIN_LIST_SUCCESS,payload:data})
    } catch (error) {
        dispatch({type:FETCH_COIN_LIST_FAILURE,payload:error.message})
        console.log(error);
    }
}

export const getTop50CoinList=()=>async(dispatch)=>{

    dispatch({type:FETCH_TOP_50_COINS_REQUEST})

    try {
        const response=await axios.get(`${baseUrl}/coins/top50`);
        console.log("Top 50",response.data);
        dispatch({type:FETCH_TOP_50_COINS_SUCCESS,payload:response.data})
    } catch (error) {
        dispatch({type:FETCH_TOP_50_COINS_FAILURE,payload:error.message})
        console.log(error);
    }
}

export const fetchMarketChart=({coinId,days,jwt})=>async(dispatch)=>{
    const safeCoinId = encodeURIComponent(coinId || "");
    const requestKey = `chart:${safeCoinId}:${days}`;
    if (!safeCoinId || inFlight.has(requestKey)) return;
    inFlight.add(requestKey);

    dispatch({type:FETCH_MARKET_CHART_REQUEST})

    try {
        const response=await api.get(`/coins/${safeCoinId}/chart?days=${days}`,
           getAuthConfig(jwt));
        dispatch({type:FETCH_MARKET_CHART_SUCCESS,payload:response.data})
    } catch (error) {
        dispatch({type:FETCH_MARKET_CHART_FAILURE,payload:error.message})
        console.log(error);
    } finally {
        inFlight.delete(requestKey);
    }
}

export const fetchCoinById=({coinId,jwt})=>async(dispatch)=>{
    const safeCoinId = encodeURIComponent(coinId || "");
    if (!safeCoinId) return;

    dispatch({type:FETCH_COIN_BY_ID_REQUEST})

    try {
        const response=await api.get(`/coins/${safeCoinId}`,
           getAuthConfig(jwt));
        dispatch({type:FETCH_COIN_BY_ID_SUCCESS,payload:response.data})
        console.log("Coin By id",response.data)
    } catch (error) {
        dispatch({type:FETCH_COIN_BY_ID_FAILURE,payload:error.message})
        console.log(error);
    }
}

export const fetchCoinDetails=({coinId,jwt})=>async(dispatch)=>{
    const safeCoinId = encodeURIComponent(coinId || "");
    const requestKey = `details:${safeCoinId}`;
    if (!safeCoinId || inFlight.has(requestKey)) return;
    inFlight.add(requestKey);

    dispatch({type:FETCH_COIN_DETAILS_REQUEST})

    try {
        const response=await api.get(`/coins/details/${safeCoinId}`,
           getAuthConfig(jwt));
        dispatch({type:FETCH_COIN_DETAILS_SUCCESS,payload:response.data})
        console.log("Coin Details",response.data)
    } catch (error) {
        try {
            const fallbackResponse = await api.get(`/coins/${safeCoinId}`, getAuthConfig(jwt));
            dispatch({type:FETCH_COIN_DETAILS_SUCCESS,payload:fallbackResponse.data})
        } catch (fallbackError) {
            dispatch({type:FETCH_COIN_DETAILS_FAILURE,payload:fallbackError.message})
            console.log(fallbackError);
        }
    } finally {
        inFlight.delete(requestKey);
    }
}

export const searchCoin=({keyword,jwt})=>async(dispatch)=>{

    dispatch({type:SEARCH_COIN_REQUEST})

    try {
        const response=await api.get(`/coins/search?q=${keyword}`,
           getAuthConfig(jwt));
        dispatch({type:SEARCH_COIN_SUCCESS,payload:response.data})
        console.log("Search Coin",response.data)
    } catch (error) {
        dispatch({type:SEARCH_COIN_FAILURE,payload:error.message})
        console.log(error);
    }
}
