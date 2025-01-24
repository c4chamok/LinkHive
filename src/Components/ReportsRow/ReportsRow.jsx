import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const ReportsRow = ({ report, currentPage, index, userFromDB, refresh }) => {
    const axiosSecure = useAxiosSecure();

    
    return (
        <tr className="">
            <td>{(currentPage - 1) * 5 + index + 1}</td>
            <td>
                {report.type}
            </td>

            <td className="flex justify-center">
                {report.reportedByEmail}

            </td>
            <td >
                <span className="flex justify-center">
                    {report.reportReason}
                </span>
            </td>
            <td >
                <span className="flex justify-center">
                    {new Date(report.reportedAt).toUTCString()}
                </span>
            </td>
            <td >
                <span className="w-full flex justify-center">
                    <button 
                        className='btn btn-sm btn-error'
                    >Remove Activity</button>
                </span>
            </td>
        </tr>
    );
};

export default ReportsRow;