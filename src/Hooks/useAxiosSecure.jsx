import axios from "axios";
import useAppContext from "../Contexts/useAppContext";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const axiosSecure = axios.create({
    baseURL: "http://localhost:5000",
})

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logout } = useAppContext() || {}
    const [error, setError] = useState("");

    axiosSecure.interceptors.request.use(function (config) {
        const token = localStorage.getItem('access-token')
        // console.log('request stopped by interceptors', token)
        config.headers.authorization = `Bearer ${token}`;
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    useEffect(()=>{
        if(error){
            navigate('/login').then(res=>{
                setError("");
                console.log(error);
            })
        }
    },[error])

    axiosSecure.interceptors.response.use(response => {
        return response;
    }, async (error) => {
        const status = error.response.status;
        if (status === 401 || status === 403) {
            await logout()
            setError("unauthorized")
        }
        return Promise.reject(error);
    })
    return axiosSecure
};

export default useAxiosSecure;