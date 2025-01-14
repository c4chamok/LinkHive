import React, { useRef, useState } from 'react';

import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAppContext from '../../Contexts/useAppContext';

const Login = () => {
    const { login, googleSignIn } = useAppContext()
    const [showPass, setShowPass] = useState(false)
    const inputRef = useRef()
    const location = useLocation();
    const navigate = useNavigate()
    const from = location.state?.from?.pathname || "/";
    const userLoginHandle = (e) => {

        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        login(email, password)
            .then(() => {
                navigate(from)
                toast.success(`success login`, {
                    position: "top-right",
                    autoClose: 2000,
                })
            })
            .catch((err) => {
                toast.error(`Error : ${err}`, {
                    position: "top-right",
                    autoClose: 2000,
                })
            })
    }

    const googleSignInHandle = () => {
        googleSignIn()
            .then(() => {
                navigate(from)
            })
            .catch((err) => {
                toast.error(`Error : ${err}`, {
                    position: "top-right",
                    autoClose: 2000,
                })
            })
    }

    document.title = "RatePal | Login"

    const navigateToReset = () => {

        navigate('/password-reset', { state: { email: inputRef.current.value } })
    }

    return (
        <div className='min-h-screen flex flex-col items-center w-full'>
            <form onSubmit={userLoginHandle} className=' p-4 flex flex-col justify-center gap-2 min-h-[400px]'>
                <h2 className='text-4xl mb-2'>Login</h2>
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input ref={inputRef} type="email" name='email' className="grow" placeholder="Email" />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd" />
                    </svg>
                    <input placeholder='password' name='password' type={showPass ? "text" : "password"} className="grow" />
                    {
                        showPass ?
                            <FaEyeSlash onClick={() => setShowPass(false)} className='cursor-pointer'></FaEyeSlash>
                            :
                            <FaEye onClick={() => setShowPass(true)} className='cursor-pointer'></FaEye>
                    }

                </label>
                <a
                    onClick={navigateToReset}
                    className='underline cursor-pointer'>Forgot password</a>
                <button className='btn bg-indigo-500 text-white hover:bg-indigo-600' type='submit'>Login</button>
                <span className='border-t border-[#c6c6c68e] border-dashed my-2'></span>
                <button type='button' onClick={googleSignInHandle} className='btn bg-indigo-500 text-white hover:bg-indigo-600'><FaGoogle></FaGoogle> Login With google</button>
                <p className=' mt-3'>Not a user. Please 
                <Link className='underline' to={'/register'} state={{from}}>Register</Link></p>
            </form>
        </div>
    );
};

export default Login;