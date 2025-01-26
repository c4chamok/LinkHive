import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAppContext from '../../Contexts/useAppContext';

const Login = () => {
    const { login, googleSignIn } = useAppContext();
    const [showPass, setShowPass] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userLoginHandle = async (data) => {
        const { email, password } = data;
        try {
            await login(email, password);
            navigate(from);
            toast.success('Successfully logged in!', {
                position: "top-right",
                autoClose: 2000,
            });
        } catch (err) {
            toast.error(`Error: ${err.message}`, {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    const googleSignInHandle = async () => {
        try {
            await googleSignIn();
            navigate(from);
        } catch (err) {
            toast.error(`Error: ${err.message}`, {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    document.title = "RatePal | Login";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
            <div className="backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-4xl font-bold text-center text-white mb-6">Login</h2>
                <form onSubmit={handleSubmit(userLoginHandle)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPass ? 'text' : 'password'}
                                {...register('password', { required: 'Password is required' })}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password"
                            />
                            {showPass ? (
                                <FaEyeSlash
                                    onClick={() => setShowPass(false)}
                                    className="absolute top-2 right-2 text-gray-500 cursor-pointer"
                                />
                            ) : (
                                <FaEye
                                    onClick={() => setShowPass(true)}
                                    className="absolute top-2 right-2 text-gray-500 cursor-pointer"
                                />
                            )}
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="text-right">
                        <Link to="/password-reset" className="text-sm text-white underline">Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition"
                    >
                        Login
                    </button>

                    <div className="text-center text-white my-4">OR</div>

                    <button
                        type="button"
                        onClick={googleSignInHandle}
                        className="w-full flex items-center justify-center bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                        <FaGoogle className="mr-2" /> Login with Google
                    </button>

                    <p className="text-center text-white mt-4">
                        Not a user?{' '}
                        <Link to="/register" state={{ from }} className="underline">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
