import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const CommentsRow = ({ comment, setFullComment, currentPage, index, userFromDB, refresh }) => {
    console.log(comment);
    const [feedback, setFeedback] = useState("");
    const axiosSecure = useAxiosSecure();

    const handleReport = async (commentId) => {
        if (!feedback) {
            Swal.fire({
                icon: 'warning',
                title: 'Feedback Required',
                text: 'Please select a feedback reason before reporting.',
            });
            return;
        }

        const confirmReport = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to report this comment.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, report it!'
        });

        if (confirmReport.isConfirmed) {
            const serverResponse = await axiosSecure.post('/report', {
                reportedById: userFromDB?._id,
                reportedByEmail: userFromDB?.email,
                type: "comment",
                targetId: commentId,
                reportReason: feedback
            });
            Swal.fire({
                icon: 'success',
                title: 'Reported Successfully',
                text: 'The comment has been reported.',
            });
            refresh();
        }
    };

    const reportDelete = async () => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to cancel this report.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (confirmDelete.isConfirmed) {
            const serverRes = await axiosSecure.delete(`/report?reportId=${comment.userReport._id}`);
            Swal.fire({
                icon: 'success',
                title: 'Report Cancelled',
                text: 'The report has been successfully cancelled.',
            });
            refresh();
        }
    };

    return (
        <tr className="">
            <td>{(currentPage - 1) * 5 + index + 1}</td>
            <td>
                {comment.content.length > 20 ? (
                    <>
                        {comment.content.slice(0, 20)}...{" "}
                        <button
                            onClick={() => setFullComment(comment.content)}
                            className="text-blue-500 hover:underline"
                        >
                            Read More
                        </button>
                    </>
                ) : (
                    comment.content
                )}
            </td>

            <td className="flex justify-center">
                {
                    comment?.userReport?.adminAction === "pending" ? <span className="p-2 rounded bg-yellow-200">pending</span> :
                        <select
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        >
                            <option value="">select feedback...</option>
                            <option value="False information">False information</option>
                            <option value="Irrelevent content">Irrelevent content</option>
                            <option value="violent activity">violent activity</option>
                        </select>
                }

            </td>
            <td >
                <span className="flex justify-center">
                    {comment?.userReport?.adminAction === "pending" ?
                        <button
                            onClick={reportDelete}
                            className={`btn btn-sm btn-error `}>
                            Cancel report
                        </button> :
                        comment?.userReport?.adminAction === "pending"? <span className='p-3 bg-green-400'>{comment?.userReport?.adminAction}</span> :
                        <button
                            onClick={() => handleReport(comment?._id)}
                            className={`btn btn-sm btn-primary 
                    ${!feedback && "btn-disabled"}`}>
                            Report
                        </button>
                    }
                </span>
            </td>
        </tr>
    );
};

export default CommentsRow;
