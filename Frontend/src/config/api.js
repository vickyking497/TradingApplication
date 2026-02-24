import axios from "axios"

export const baseUrl=import.meta.env.VITE_API_BASE_URL || "http://localhost:8081"

const api=axios.create({
    baseURL:baseUrl,
    headers:{
        "Content-Type" : "application/json"
    }
})

export default api; 