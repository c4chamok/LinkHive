import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAppContext from '../../Contexts/useAppContext';
import axios from 'axios';

const Register = () => {
    const { register, updateUserProfile, googleSignIn } = useAppContext()
    const [showPass, setShowPass] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const location = useLocation();
    const from = location.state?.from || "/";
    const navigate = useNavigate()
    document.title = "RatePal | Register"

    const userRegisterHandle = async (e) => {
        e.preventDefault();
        const form = e.target;
        const userName = form.name.value;
        const imgFile = form.image.files[0];
        const email = form.email.value;
        const password = form.password.value;
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbb_key}`, { image: imgFile}, {
            headers: {
                'content-type': 'multipart/form-data'
                }
            })
        console.log(res.data.data.display_url);

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
        }
        else if(!/[A-Z]/.test(password)) {
            setPasswordError("Password must contain at least one uppercase letter.");
        }
        else if(!/[a-z]/.test(password)) {
            setPasswordError("Password must contain at least one lowercase letter.");
        }
        else {
            setPasswordError('')
            try {
                await register(email, password);
                await updateUserProfile({
                    displayName: userName,
                    photoURL: res.data.data.display_url,
                });
                toast.success("Registration successful!");
                // navigate(from);
            } catch (err) {
                toast.error(`Error: ${err.message}`, {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        }

    }

    const googleSignInHandle = () => {
        googleSignIn()
        .then(() => {
            navigate('/')
        })
        .catch((err)=> {
            toast.error(`Error : ${err}`  , {
            position: "top-right",
            autoClose: 2000
            })
        })
    }


    return (
        <div className='min-h-screen flex flex-col items-center w-full'>
            <form onSubmit={userRegisterHandle} className=' p-4 flex flex-col justify-center gap-2 min-h-[400px]'>
                <h2 className='text-4xl mb-2'>Register Today</h2>
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="text" name='name' className=" w-full" placeholder="Name" required/>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="file" name='image' className="grow" placeholder="Image URL" required/>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="email" name='email' className="grow" placeholder="Email" required/>
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
                    <input placeholder='password' name='password' type={showPass ? "text" : "password"} className="grow" required/>
                    {
                        showPass ?
                            <FaEyeSlash onClick={() => setShowPass(false)} className='cursor-pointer'></FaEyeSlash>
                            :
                            <FaEye onClick={() => setShowPass(true)} className='cursor-pointer'></FaEye>
                    }
                </label>
                {
                    passwordError &&
                    <p className='text-xs text-red-500'>{passwordError}</p> 
                    
                }
                <button className='btn bg-indigo-500 text-white hover:bg-indigo-600' type='submit'>Register</button>
                <span className='border-t border-[#c6c6c68e] border-dashed my-2'></span>
                <button type='button' onClick={googleSignInHandle} className='btn bg-indigo-500 text-white hover:bg-indigo-600'><FaGoogle></FaGoogle> SignUp With google</button>
                <p className=' mt-3'>Already a user. Please <Link className='underline' to={'/login'}>Login</Link></p>
            </form>
        </div>
    );
};

export default Register;