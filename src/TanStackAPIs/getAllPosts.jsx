import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import getUserFromDB from "./getUserFromDB";

const getAllPosts = () => {
    const axiosPublic = useAxiosPublic()
    const { userFromDB } = getUserFromDB()
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['allPosts', userFromDB],
        refetchOnWindowFocus: false,
        queryFn: () => axiosPublic(`/post?userId=${userFromDB ? userFromDB._id : ""}`)
    })

    return { refetch, allPosts: data?.data }
};

export default getAllPosts;