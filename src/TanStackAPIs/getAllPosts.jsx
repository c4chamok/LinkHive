import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import getUserFromDB from "./getUserFromDB";

const getAllPosts = (searchText="", skip=0, postsPerPage=5,sortBy='latest') => {
    const axiosPublic = useAxiosPublic()
    const { userFromDB } = getUserFromDB()
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['allPosts', userFromDB, searchText, skip, postsPerPage, sortBy],
        refetchOnWindowFocus: false,
        queryFn: () => axiosPublic(`/post?userId=${userFromDB ? userFromDB._id : ""}&searchText=${searchText.trim()? searchText : ""}&page=${skip}&size=${postsPerPage}&sort=${sortBy}`)
    })

    return { refetch, allPosts: data?.data }
};

export default getAllPosts;