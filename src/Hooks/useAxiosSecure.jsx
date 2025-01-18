import axios from "axios";
import useAppContext from "../Contexts/useAppContext";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
})

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logout } = useAppContext() || {}
    axiosSecure.interceptors.response.use(response => {
        return response;
    }, async (error) => {
        const status = error.response.status;
        if (status === 401 || status === 403) {
            await logout()
            navigate('/login')
        }
        return Promise.reject(error);
    })
    return axiosSecure
};

export default useAxiosSecure;