import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import getUserFromDB from "./getUserFromDB";

const getAllUsers = (skip, dataPerPage, searchText) => {
    const axiosSecure = useAxiosSecure()
    const { userFromDB } = getUserFromDB()
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['allUsers', userFromDB, skip, dataPerPage, searchText],
        refetchOnWindowFocus: false,
        queryFn: () => axiosSecure(`/allusers?page=${skip}&size=${dataPerPage}&searchText=${searchText}`)
    })

    return { refetch, allUsers: data?.data }
};

export default getAllUsers;