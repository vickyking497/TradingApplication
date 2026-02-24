import api from "@/config/api";
import * as types from "./ActionType";

const normalizeJwt = (jwt) => (jwt || "").replace(/^Bearer\s+/i, "").trim();

export const payOrder =({jwt,orderData,amount}) => async (dispatch)=>{
    dispatch({type:types.PAY_ORDER_REQUEST});

    try {
        const token = normalizeJwt(jwt || localStorage.getItem("jwt"));
        if (!token) {
            throw new Error("Missing auth token");
        }
        if (!orderData?.coinId) {
            throw new Error("Missing coinId");
        }
        if (!orderData?.orderType) {
            throw new Error("Missing orderType");
        }
        if (!Number.isFinite(Number(orderData?.quantity)) || Number(orderData.quantity) <= 0) {
            throw new Error("Invalid quantity");
        }

        const response = await api.post(`/api/orders/pay`,orderData,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        dispatch({
            type:types.PAY_ORDER_SUCCESS,
            payload:response.data,
            amount
        });
        console.log("order success",response.data)
        return response.data;
    } catch (error) {
        console.log("error",error)
        const message = error?.response?.data?.message || error.message;

        dispatch({
            type:types.PAY_ORDER_FAILURE,
            error:message
        });
        throw new Error(message);
    }
};

export const getOrderById =({jwt,orderId}) => async (dispatch)=>{
    dispatch({type:types.GET_ORDER_REQUEST});

    try {
        const response = await api.get(`/api/orders/${orderId}`,{
            headers:{
                Authorization:`Bearer ${jwt}`
            }
        });
        dispatch({
            type:types.GET_ORDER_SUCCESS,
            payload:response.data,
          
        });
       
    } catch (error) {
        console.log("error",error)

        dispatch({
            type:types.GET_ORDER_FAILURE,
            error:error.message
        });
        
    }
};

export const getAllOrdersForUser =({jwt,orderType,assetSymbol}) => async (dispatch)=>{
    dispatch({type:types.GET_ALL_ORDER_REQUEST});

    try {
        const response = await api.get(`/api/orders`,{
            headers:{
                Authorization:`Bearer ${jwt}`
            },
            params:{
                order_type :orderType,
                asset_symbol : assetSymbol,
            },
        });
        dispatch({
            type:types.GET_ALL_ORDER_SUCCESS,
            payload:response.data,
           
        });
        console.log("order success",response.data)
    } catch (error) {
        console.log("error",error)

        dispatch({
            type:types.GET_ALL_ORDER_FAILURE,
            error:error.message,
        });
        
    }
};
