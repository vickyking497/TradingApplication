import api from '@/config/api';
import * as types from './ActionType';

const normalizeJwt = (jwt) => (jwt || "").replace(/^Bearer\s+/i, "").trim();

export const getAssetById =({assetId,jwt}) =>
    async(dispatch) =>{
        dispatch({type: types.GET_ASSET_REQUEST});
        try {
            const token = normalizeJwt(jwt || localStorage.getItem("jwt"));
            const response  = await api.get(`/api/asset/${assetId}`,{
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            });
            dispatch({
                type :types.GET_ASSET_SUCCESS,
                payload :response.data,
            });
            console.log("get asset by id",response.data)
        } catch (error) {
            dispatch({
                type : types.GET_ASSET_FAILURE,
                error :error.message,
            });
        }
    };

    export const getAssetDetails =({coinId,jwt}) =>
    async(dispatch) =>{
        dispatch({type: types.GET_ASSET_DETAILS_REQUEST});
        try {
            const token = normalizeJwt(jwt || localStorage.getItem("jwt"));
            const response  = await api.get(`/api/asset/coin/${coinId}/users`,{
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            });
            dispatch({
                type :types.GET_ASSET_DETAILS_SUCCESS,
                payload :response.data,
            });
            console.log("get asset details",response.data)
        } catch (error) {
            if (error?.response?.status === 404) {
                dispatch({
                    type: types.GET_ASSET_DETAILS_SUCCESS,
                    payload: null,
                });
                return;
            }
            dispatch({
                type : types.GET_ASSET_DETAILS_FAILURE,
                error :error.message,
            });
        }
    };

    export const getUserAssets =(jwt) =>
    async(dispatch) =>{
        dispatch({type: types.GET_USER_ASSET_REQUEST});
        try {
            const token = normalizeJwt(jwt || localStorage.getItem("jwt"));
            const response  = await api.get(`/api/asset`,{
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            });
            dispatch({
                type :types.GET_USER_ASSET_SUCCESS,
                payload :response.data,
            });
            console.log("get user asset ",response.data)
        } catch (error) {
            dispatch({
                type : types.GET_USER_ASSET_FAILURE,
                error :error.message,
            });
        }
    };
