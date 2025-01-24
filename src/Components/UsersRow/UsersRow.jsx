import React, { useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const UsersRow = ({ user, currentPage, index, userFromDB, refresh }) => {
    const axiosSecure = useAxiosSecure();
    

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
                    {user.role}
                </span>
            </td>
        </tr>
    );
};

export default UsersRow;