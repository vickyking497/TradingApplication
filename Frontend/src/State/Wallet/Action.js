import api from '@/config/api';
import * as types from './ActionType';

const normalizeJwt = (jwt) => (jwt || "").replace(/^Bearer\s+/i, "").trim();

export const getUserWallet =(jwt) => 
    async(dispatch) =>{
    dispatch({type : types.GET_USER_WALLET_REQUEST});

    try{
        const token = normalizeJwt(jwt || localStorage.getItem("jwt"));
        const response = await api.get(`/api/wallet`,{
            headers:{
                Authorization : `Bearer ${token}`,
            },
        });
        dispatch({
            type: types.GET_USER_WALLET_SUCCESS,
            payload:response.data,
        });
        console.log("User Wallet",response.data);
    }catch(error){
        console.log(error);
        dispatch({
            type : types.GET_USER_WALLET_FAILURE,
            error:error.message,
        });
    }
};

export const getWalletTransactions =({jwt})=>
    async(dispatch) =>{
    dispatch({type : types.GET_WALLET_TRANSACTION_REQUEST});

    try{
        const token = normalizeJwt(jwt || localStorage.getItem("jwt"));
        let response;
        try {
            response = await api.get(`/api/transactions`,{
                headers:{
                    Authorization : `Bearer ${token}`,
                },
            });
        } catch (error) {
            response = await api.get(`/api/wallet/transactions`,{
                headers:{
                    Authorization : `Bearer ${token}`,
                },
            });
        }
        const transactions = Array.isArray(response.data)
            ? response.data
            : response?.data?.transactions
            || response?.data?.walletTransactions
            || response?.data?.data
            || response?.data?.content
            || response?.data?.items
            || [];
        dispatch({
            type: types.GET_WALLET_TRANSACTION_SUCCESS,
            payload:transactions,
        });
        console.log("Wallet Transaction",transactions);
    }catch(error){
        console.log(error);
        dispatch({
            type : types.GET_WALLET_TRANSACTION_FAILURE,
            error:error.message,
        });
    }
};

export const depositMoney =({jwt,orderId,paymentId,navigate})=>
    async(dispatch) =>{
        dispatch({type : types.DEPOSIT_MONEY_REQUEST});

    try{
        const token = normalizeJwt(jwt || localStorage.getItem("jwt"));
        const response = await api.put(`/api/wallet/deposit`, null, {
            params:{
                order_id:orderId,
                payment_id:paymentId,
            },
            headers:{
                Authorization : `Bearer ${token}`,
            },
        });
        dispatch({
            type: types.DEPOSIT_MONEY_SUCCESS,
            payload:response.data,
        });
        navigate("/wallet")

        console.log(response.data);
    }catch(error){
        console.log(error);
        dispatch({
            type : types.DEPOSIT_MONEY_FAILURE,
            error:error.message,
        });
    }
};

export const paymentHandler =({jwt,amount,paymentMethod})=>
    async(dispatch) =>{
        dispatch({type : types.DEPOSIT_MONEY_REQUEST});

    try{
        const token = normalizeJwt(jwt || localStorage.getItem("jwt"));
        const normalizedMethod = String(paymentMethod || "").toUpperCase();
        const response = await api.post(`/api/payment/${normalizedMethod}/amount/${amount}`,null,
        {
            headers:{
                Authorization : `Bearer ${token}`,
            },
        });
        let redirectUrl = response?.data?.payment_url || response?.data?.paymentUrl || response?.data?.url;
        if (redirectUrl?.includes("loacalhost")) {
            redirectUrl = redirectUrl.replace("loacalhost", "localhost");
        }
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
        
        
    }catch(error){
        console.log(error);
        dispatch({
            type : types.DEPOSIT_MONEY_FAILURE,
            error:error.message,
        });
    }
};

export const transferMoney =({jwt,walletId,reqData})=>
    async(dispatch) =>{
        dispatch({type : types.TRANSFER_MONEY_REQUEST});

    try{
        const token = normalizeJwt(jwt || localStorage.getItem("jwt"));
        const response = await api.put(`/api/wallet/${walletId}/transfer`,reqData,
        {
            headers:{
                Authorization : `Bearer ${token}`,
            },
        });
        dispatch({
            type: types.TRANSFER_MONEY_SUCCESS,
            payload:response.data,
        });
       console.log("transfer money sent",response.data)
       return response.data;
    }catch(error){
        console.log(error);
        dispatch({
            type : types.TRANSFER_MONEY_FAILURE,
            error:error.message,
        });
        throw error;
    }
};
