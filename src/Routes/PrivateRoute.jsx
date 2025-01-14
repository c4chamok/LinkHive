import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import LoadingPage from '../Pages/LoadingPage/LoadingPage';
import { AuthContext } from '../Contexts/AuthProvider';

const PrivateRoute = ({children}) => {

    const location = useLocation();
    const {user, loading} = useContext(AuthContext)

    if(loading){
        return <LoadingPage></LoadingPage>
    }

    if(user){
        return children
    }

    return (
        <Navigate to={'/login'} state={{ from: location }}></Navigate>
    );
};

export default PrivateRoute;