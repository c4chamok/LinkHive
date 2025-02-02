import React from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import useAppContext from '../../Contexts/useAppContext';

const Sidebar = () => {
    const location = useLocation()
    const { userFromDB, refetchUser } = useAppContext()
    console.log(userFromDB);
    return (
        <div className="min-w-[15%] flex flex-col bg-slate-700">
        <div className="h-40"></div>
        <div className=" flex flex-col w-full">
            {userFromDB?.role === 'admin' && (
                <>
                    <NavLink
                        to="admin-profile"
                        className={({ isActive }) =>
                            `pl-3 h-10 flex items-center text-white font-bold ${
                                isActive && 'border-l-[10px] border-[#3f5dbdf5]'
                            }`
                        }
                    >
                        Admin Profile
                    </NavLink>
                    <NavLink
                        to="allusers"
                        className={({ isActive }) =>
                            `pl-3 h-10 flex items-center text-white font-bold ${
                                isActive && 'border-l-[10px] border-[#3f5dbdf5]'
                            }`
                        }
                    >
                        Users Data
                    </NavLink>
                    <NavLink
                        to="allreports"
                        className={({ isActive }) =>
                            `pl-3 h-10 flex items-center text-white font-bold ${
                                isActive && 'border-l-[10px] border-[#3f5dbdf5]'
                            }`
                        }
                    >
                        Reported Activities
                    </NavLink>
                    <NavLink
                        to="makeannouncement"
                        className={({ isActive }) =>
                            `pl-3 h-10 flex items-center text-white font-bold ${
                                isActive && 'border-l-[10px] border-[#3f5dbdf5]'
                            }`
                        }
                    >
                        Make Announcement
                    </NavLink>
                </>
            )}
            {userFromDB?.role !== 'admin' && (
                <NavLink
                    to="profile"
                    className={({ isActive }) =>
                        `pl-3 h-10 flex items-center text-white font-bold ${
                            isActive && 'border-l-[10px] border-[#3f5dbdf5]'
                        }`
                    }
                >
                    My Profile
                </NavLink>
            )}
            <NavLink
                to="addpost"
                className={({ isActive }) =>
                    `pl-3 h-10 flex items-center text-white font-bold ${
                        isActive && 'border-l-[10px] border-[#3f5dbdf5]'
                    }`
                }
            >
                Create a Post
            </NavLink>
            <NavLink
                to="myposts"
                className={({ isActive }) =>
                    `pl-3 h-10 flex items-center text-white font-bold ${
                        isActive && 'border-l-[10px] border-[#3f5dbdf5]'
                    }`
                }
            >
                My Posts
            </NavLink>
        </div>
        <div className="mt-5">
            <Link to="/" className="px-3 h-10 flex items-center text-white font-bold">
                Home
            </Link>
        </div>
    </div>
);
};

export default Sidebar;