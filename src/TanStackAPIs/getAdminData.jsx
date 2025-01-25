import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useQuery } from "@tanstack/react-query";
const getAdminData = () => {
    const axiosSecure = useAxiosSecure();

    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['userfromDB'],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const token = localStorage.getItem('access-token')
            const response = await axiosSecure('/adminprofile',{ headers: { authorization : `Bearer ${token}`} })
            return response?.data
        }
            
    })

    return { refetch, adminData: data, isPending }

};

export default getAdminData;