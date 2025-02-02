import React, { useEffect } from 'react';
import useAppContext from '../Contexts/useAppContext';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from '../Hooks/useAxiosPublic';

const getUserFromDB = () => {
    const { user, loading } = useAppContext()
    const axiosPublic = useAxiosPublic();

    const { isPending, error, data, refetch } = useQuery({
        queryKey: [user?.email , 'userfromDB'],
        enabled: !!user?.email ,
        queryFn: async () => {
            const token = localStorage.getItem('access-token')
            const response = await axiosPublic('/user',{ headers: { authorization : `Bearer ${token}`} })
            return response?.data

        }
            
    })

    return { refetch, userFromDB: data, isPending }

};

export default getUserFromDB;