import axios from "axios";


const axiosPublic = axios.create({
    baseURL: "https://link-hive-server.vercel.app"
})

const useAxiosPublic = () => {
    return axiosPublic
};

export default useAxiosPublic;