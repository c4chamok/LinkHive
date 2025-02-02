import React from 'react';
import getUserFromDB from '../TanStackAPIs/getUserFromDB';
import LoadingPage from '../Pages/LoadingPage/LoadingPage';
import { Navigate } from 'react-router';

const AdminRoute = ({children}) => {
    const { userFromDB: user, isPending: loading } = getUserFromDB()
    const isAdmin = user?.role === 'admin'

    if(loading){
        return <LoadingPage></LoadingPage>
    }

    if(isAdmin){
        return children
    }

    return (
        <Navigate to={'/dashboard'}></Navigate>
    );
};

export default AdminRoute;