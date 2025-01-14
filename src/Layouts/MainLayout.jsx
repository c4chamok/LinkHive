import React from 'react';
import { Outlet } from 'react-router';

const MainLayout = () => {
    return (
        <div className='text-5xl'>
            this ius layout
            {/* <Navbar></Navbar> */}
            <Outlet/>
        </div>
    );
};

export default MainLayout;