import React, { useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const UsersRow = ({ user, currentPage, index, userFromDB, refresh }) => {
    const axiosSecure = useAxiosSecure();

    const toggleUserRole = async () => {
        const serverRes = await axiosSecure(`/togglerole?userId=${user._id}`)
        refresh();
    }
    return (
        <tr className="">
            <td>{(currentPage - 1) * 5 + index + 1}</td>
            <td>
                {user.name}
            </td>

            <td className="flex justify-center">
                {user.email}

            </td>
            <td >
                <span className="flex justify-center">
                    {user.membership ? "Mebmer" : "Free"}
                </span>
            </td>
            <td >
                <span className="flex justify-center">
                    {user.role}
                </span>
            </td>
            <td >
                <span className="w-full flex justify-center">
                    {
                        userFromDB._id === user._id ? <span>can't switch role</span> : (
                        user.role === "admin" ?
                            <button
                                onClick={toggleUserRole}
                                className={`btn btn-sm btn-error `}>
                                Make user
                            </button> :

                            <button
                                onClick={toggleUserRole}
                                className={`btn btn-sm btn-primary`}>
                                Make Admin
                            </button>)
                    }
                </span>
            </td>
        </tr>
    );
};

export default UsersRow;