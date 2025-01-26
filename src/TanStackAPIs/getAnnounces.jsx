import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import getUserFromDB from "./getUserFromDB";

const getAnnounces = (skip=0, dataPerPage=5) => {
    const axiosSecure = useAxiosSecure()
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['allAnnounces', skip, dataPerPage],
        refetchOnWindowFocus: false,
        queryFn: () => axiosSecure(`/announce?page=${skip}&size=${dataPerPage}`)
    })

    return { refetch, allAnnounces: data?.data }
};

export default getAnnounces;