import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Components/Navbar/Navbar';
import useAppContext from '../Contexts/useAppContext';
import LoadingPage from '../Pages/LoadingPage/LoadingPage';
import getUserFromDB from '../TanStackAPIs/getUserFromDB';

const MainLayout = () => {
    const {loading, user} = useAppContext()

    if(loading) return <LoadingPage/>
    return (
        <div>
            <Navbar></Navbar>
            <Outlet/>
        </div>
    );
};

export default MainLayout;