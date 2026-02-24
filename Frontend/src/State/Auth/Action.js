import axios from "axios"
import { GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionType";
import api from "@/config/api";


export const register=(userData)=>async(dispatch)=>{

    dispatch({type:REGISTER_REQUEST})

    

    try {
        const response=await api.post(`/auth/signup`,userData);
        const user = response.data;
        console.log(user);

        dispatch({type:REGISTER_SUCCESS,payload:user.jwt})
        localStorage.setItem("jwt",user.jwt)

    } catch (error) {
        dispatch({type:REGISTER_FAILURE,payload:error.message})
        console.log(error);
    }

}

export const login=(userData)=>async(dispatch)=>{

    dispatch({type:LOGIN_REQUEST})

   

    try {
        const response=await api.post(`/auth/signin`,userData.data);
        const user = response.data;
        console.log(user);

        dispatch({type:LOGIN_SUCCESS,payload:user.jwt})
        localStorage.setItem("jwt",user.jwt)
        userData.navigate("/")

    } catch (error) {
        dispatch({type:LOGIN_FAILURE,payload:error.message})
        console.log(error);
    }

}

export const getUser=(jwt)=>async(dispatch)=>{

    dispatch({type:GET_USER_REQUEST})

   

    try {
        const response=await api.get(`/api/users/profile`,{
            headers:{
                Authorization : `Bearer ${jwt}`
            }
        });
        const user = response.data;
        console.log(user);

        dispatch({type:GET_USER_SUCCESS,payload:user})

    } catch (error) {
        dispatch({type:GET_USER_FAILURE,payload:error.message})
        console.log(error);
    }

}

export const logout=()=>(dispatch)=>{
    localStorage.clear();
    dispatch({ type :LOGOUT});

};