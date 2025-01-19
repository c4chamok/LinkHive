import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import useAppContext from '../../Contexts/useAppContext';
import getUserFromDB from '../../TanStackAPIs/getUserFromDB';



const Navbar = () => {
    const { user, logout, showSearchbar, setShowSearchbar } = useAppContext()
    const { userFromDB } = getUserFromDB()
    // const userFromDB = null;
    const [isNavBg, setIsNavBg] = useState();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    console.log(user,userFromDB);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleScroll = () => {
        if (window.scrollY > 450) {
            setIsNavBg(true);
        } else {
            setIsNavBg(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className={`flex sticky top-0 z-10 ${isNavBg ? "bg-gradient-to-r from-green-100 to-slate-100" : "bg-slate-100/50"}  flex-col items-center`}>
            <div className="navbar w-[98%] justify-between relative z-10 ">
                <div className="flex items-center md:gap-5">
                    <Link to={'/'} className="text-2xl font-bold bg-gradient-text mr-3 text-green-400">RatePal</Link>
                </div>
                <div className='lg:flex hidden items-center gap-2'>
                    <NavLink
                        className='px-4 py-2 font-semibold hover:bg-green-100 hover:text-gray-800 rounded-[50px] '
                        to={'/'}>Home</NavLink>
                    <NavLink
                        className='px-4 py-2 font-semibold hover:bg-green-100 hover:text-gray-800 rounded-[50px] '
                        to={'/demo'}>Services</NavLink>
                    <NavLink
                        className='px-4 py-2 font-semibold hover:bg-green-100 hover:text-gray-800 rounded-[50px] '
                        to={'/aboutus'}>About</NavLink>
                    {user &&
                        <div className='flex items-center gap-2'>
                            <NavLink
                                className='px-4 py-2 font-semibold hover:bg-green-100 hover:text-gray-800 rounded-[50px] '
                                to={'/addservice'}> Add Service</NavLink>
                            <NavLink
                                className='px-4 py-2 font-semibold hover:bg-green-100 hover:text-gray-800 rounded-[50px]  '
                                to={'/myservices'}>My Services</NavLink>
                            <NavLink
                                className='px-4 py-2 font-semibold hover:bg-green-100 hover:text-gray-800 rounded-[50px] '
                                to={'/myreviews'}>My Reviews</NavLink>
                        </div>
                    }
                </div>
                <div className="relative flex gap-2 items-center">
                    {!user && <div className='flex gap-4 items-center mr-4'>
                        <Link to={'/login'} className='px-6 py-2 rounded-[50px] border border-gray-400 text-slate-400-400 hover:bg-slate-900 hover:text-white'>Login</Link>
                        <Link to={'/register'} className='px-6 py-2 rounded-[50px] border border-indigo-400 text-slate-800 hover:text-white hover:bg-indigo-400'>Register</Link>
                    </div>}
                    <div ref={menuRef} className='relative'>
                        {user &&
                            <span className="flex items-center gap-2 hover:bg-slate-300 rounded-xl p-2 relative ml-2 cursor-pointer" onClick={toggleMenu}>
                                    <img
                                        className={`h-10 w-10 rounded-full ${userFromDB?.membership && "border-yellow-500 border-[3px]" }`}
                                        src={user?.photoURL}
                                    />
                                    {
                                        isMenuOpen ? <FaChevronUp /> : <FaChevronDown/>
                                    }
                            </span>
                        }
                        {
                            isMenuOpen &&
                            <div
                                className="right-5 absolute bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
                                {
                                    user &&
                                    <div className='flex flex-col items-center justify-center pb-2 mb-2 border-b'>
                                        <div className='text-xl text-center text-gray-900 font-semibold'> {user?.displayName}</div>
                                    </div>
                                }
                                <div className='flex flex-col'>
                                    <NavLink

                                        className='px-4 py-2 font-semibold hover:bg-green-100 hover:text-gray-800 rounded-[50px] '
                                        to={'/'}>Home</NavLink>
                                    <NavLink
                                        className='px-4 py-2 font-semibold hover:bg-green-100 hover:text-gray-800 rounded-[50px] '
                                        to={'/allservices'}>Services</NavLink>
                                </div>
                                {user &&
                                    <div className='flex flex-col'>
                                        <NavLink
                                            className='px-4 py-2 font-semibold hover:bg-green-100 hover:text-gray-800 rounded-[50px] '
                                            to={'/dashboard'}> Dashboard</NavLink>
                                        <div className='w-full'>
                                            {user ?
                                                <button onClick={logout} className="btn w-full px-6">Logout</button>
                                                :
                                                <Link to={'/login'} className='btn px-6'>Login</Link>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;