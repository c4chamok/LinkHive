import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAppContext from '../../Contexts/useAppContext';
import axios from 'axios';

const Register = () => {
    const { register: appRegister, updateUserProfile, googleSignIn } = useAppContext();
    const [showPass, setShowPass] = useState(false);
    const location = useLocation();
    const from = location.state?.from || "/";
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            const { name, image, email, password } = data;
            const formData = new FormData();
            formData.append('image', image[0]);

            const imgRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbb_key}`,
                formData
            );

            const imageUrl = imgRes.data.data.display_url;

            await appRegister(email, password);
            await updateUserProfile({ displayName: name, photoURL: imageUrl });

            toast.success("Registration successful!");
            reset();
            navigate(from);
        } catch (err) {
            toast.error(`Error: ${err.message}`, {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            navigate('/');
        } catch (err) {
            toast.error(`Error: ${err.message}`, {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    return (
        <div className='min-h-screen flex flex-col items-center w-full'>
            <form onSubmit={handleSubmit(onSubmit)} className='p-4 flex flex-col justify-center gap-2 min-h-[400px]'>
                <h2 className='text-4xl mb-2'>Register Today</h2>

                <label className='input input-bordered flex items-center gap-2'>
                    <input
                        type='text'
                        placeholder='Name'
                        {...register('name', { required: 'Name is required' })}
                        className={`w-full ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                </label>
                {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}

                <label className='input input-bordered flex items-center gap-2'>
                    <input
                        type='file'
                        {...register('image', { required: 'Image is required' })}
                        className='grow'
                    />
                </label>
                {errors.image && <p className='text-sm text-red-500'>{errors.image.message}</p>}

                <label className='input input-bordered flex items-center gap-2'>
                    <input
                        type='email'
                        placeholder='Email'
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email address',
                            },
                        })}
                        className={`w-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                </label>
                {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}

                <label className='input input-bordered flex items-center gap-2'>
                    <input
                        type={showPass ? 'text' : 'password'}
                        placeholder='Password'
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters',
                            },
                            validate: {
                                hasUpperCase: (value) =>
                                    /[A-Z]/.test(value) || 'Password must contain an uppercase letter',
                                hasLowerCase: (value) =>
                                    /[a-z]/.test(value) || 'Password must contain a lowercase letter',
                            },
                        })}
                        className={`w-full ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {showPass ? (
                        <FaEyeSlash onClick={() => setShowPass(false)} className='cursor-pointer' />
                    ) : (
                        <FaEye onClick={() => setShowPass(true)} className='cursor-pointer' />
                    )}
                </label>
                {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}

                <button type='submit' className='btn bg-indigo-500 text-white hover:bg-indigo-600'>
                    Register
                </button>

                <span className='border-t border-[#c6c6c68e] border-dashed my-2'></span>

                <button
                    type='button'
                    onClick={handleGoogleSignIn}
                    className='btn bg-indigo-500 text-white hover:bg-indigo-600 flex items-center gap-2 justify-center'
                >
                    <FaGoogle /> SignUp With Google
                </button>

                <p className='mt-3'>
                    Already a user? Please{' '}
                    <Link className='underline' to={'/login'}>
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
