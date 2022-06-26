import axios from 'axios';
import queryString from 'query-string';

const baseURL = "http://localhost:3000/api/";
const getToken = () => localStorage.getItem("token");
const axiosClient = axios.create({
    baseURL: baseURL,
    paramsSerializer: params => queryString.stringify({...params})
    
});

axiosClient.interceptors.request.use(async (config) => {
    return {
        ...config,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
    }
});

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }

    return response;
}, (error) => {
    throw error;
});

export default axiosClient;