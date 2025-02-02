import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import getUserFromDB from "./getUserFromDB";

const getReportedActivities = (skip, dataPerPage) => {
    const axiosSecure = useAxiosSecure()
    const { userFromDB } = getUserFromDB()
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['allReports', userFromDB, skip, dataPerPage],
        refetchOnWindowFocus: false,
        queryFn: () => axiosSecure(`/report?page=${skip}&size=${dataPerPage}`)
    })

    return { refetch, allReports: data?.data }
};

export default getReportedActivities;