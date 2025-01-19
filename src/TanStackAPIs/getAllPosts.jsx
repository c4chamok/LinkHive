import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const getAllPosts = () => {
    const axiosPublic = useAxiosPublic()
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['allPosts'],
        refetchOnWindowFocus: false,
        queryFn: () => axiosPublic('/post')
    })

    return { refetch, allPosts: data?.data }
};

export default getAllPosts;