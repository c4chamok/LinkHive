import React from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import { Outlet } from 'react-router';

const DashboardLayot = () => {
    
    return (
        <div className='w-screen h-screen flex'>
            <Sidebar/>
            <Outlet/>
        </div>
    );
};

export default DashboardLayot;