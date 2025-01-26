import React from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import { Outlet } from 'react-router';

const DashboardLayot = () => {
    
    return (
        <div className='w-full h-screen overflow-hidden flex'>
            <Sidebar/>
            <div className="overflow-y-scroll w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayot;