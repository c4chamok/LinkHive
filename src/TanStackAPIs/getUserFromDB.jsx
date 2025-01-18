import React, { useEffect } from 'react';
import useAppContext from '../Contexts/useAppContext';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useQuery } from "@tanstack/react-query";

const getUserFromDB = () => {
    const { user } = useAppContext()
    const axiosSecure = useAxiosSecure();

    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['userfromDB', user?.email],
        enabled: !!user?.email,
        refetchOnWindowFocus: false,
        queryFn: () => axiosSecure('/user')
    })

    return { refetch, userFromDB: data?.data }

};

export default getUserFromDB;