import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import getUserFromDB from "./getUserFromDB";

const getAllUsers = (skip, dataPerPage) => {
    const axiosSecure = useAxiosSecure()
    const { userFromDB } = getUserFromDB()
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['allUsers', userFromDB, skip, dataPerPage],
        refetchOnWindowFocus: false,
        queryFn: () => axiosSecure(`/allusers?page=${skip}&size=${dataPerPage}`)
    })

    return { refetch, allUsers: data?.data }
};

export default getAllUsers;