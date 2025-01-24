import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { Link } from 'react-router';

const ReportsRow = ({ report, currentPage, index, userFromDB, refresh }) => {
    const axiosSecure = useAxiosSecure();

    const takeAction = async () => {
        const { data } = await axiosSecure.delete(`/delete-reported?reportId=${report._id}`)
        refresh()
    }


    return (
        <tr className="">
            <td>{(currentPage - 1) * 5 + index + 1}</td>
            <td>
                <span className="flex justify-center">
                    {report.type}
                </span>
            </td>

            <td className="">
                <span className="flex justify-center items-center">
                    {report.reportedByEmail}
                </span>
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
                <span className="flex justify-center">
                    
                    {
                    report.type === 'comment' &&  ( report?.content?.postId === undefined ? "link not found":
                    <Link to={`/post/${report?.content?.postId}`} className='btn btn-sm btn-info'>content</Link>)
                    }
                </span>
            </td>
            <td >
                <span className="w-full flex justify-center">
                    {
                        report?.adminAction === "pending" ?
                            <button
                                onClick={takeAction}
                                className='btn btn-sm btn-error'
                            >Remove Activity</button> :
                            <span className='p-2 bg-green-400 rounded-md'>{report?.adminAction} </span>
                    }

                </span>
            </td>
        </tr>
    );
};

export default ReportsRow;