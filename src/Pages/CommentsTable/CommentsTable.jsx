import React, { useEffect, useState } from "react";
import useAppContext from "../../Contexts/useAppContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link, useParams } from "react-router";


const CommentsTable = () => {
    const param = useParams()
    const axiosSecure = useAxiosSecure();
    const { user } = useAppContext();
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [feedback, setFeedback] = useState("")

    const CommentsPerPage = 5;
    const totalPages = Math.ceil(totalComments / CommentsPerPage);
    const pages = [...Array(totalPages).keys()];

    console.log(totalComments);

    useEffect(() => {
        const fetchTotalComments = async () => {
            try {
                const { data } = await axiosSecure.get(
                    `/commentscount?postId=${param.postId}`
                );
                setTotalComments(data.totalCount);
            } catch (error) {
                console.error("Error fetching total Comments:", error);
            }

        };

        fetchTotalComments();
    }, [user?.email]);


    const fetchComments = async () => {

        try {
            const skip = (currentPage - 1);
            const { data } = await axiosSecure.get(
                `/comments?postId=${param.postId}&page=${skip}&size=${CommentsPerPage}`
            );
            setComments(data);
        } catch (error) {
            console.error("Error fetching Comments:", error);
        }

    };

    useEffect(() => {
        fetchComments();
    }, [currentPage, totalPages]);

    console.log(comments);


    return (
        <div className="w-full h-full flex flex-col items-center">
            <h1 className="text-4xl mt-10">See all your Posts</h1>
            <div className="w-[60%] p-6 mt-10 bg-gray-100">
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Content</th>
                                <th className="flex justify-center">Feedback</th>
                                <th><span className="flex justify-center">Report</span></th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {comments.map((comment, index) => (
                                <tr className="" key={comment._id}>
                                    <td>{(currentPage - 1) * CommentsPerPage + index + 1}</td>
                                    <td>{comment.content}</td>

                                    <td className="flex justify-center">
                                        <select
                                            value={feedback}
                                            onChange={(e)=>setFeedback(e.target.value)}
                                        >
                                            <option value="">select feedback...</option>
                                            <option value="false-info">False inFormation</option>
                                            <option value="irr-cont">Irrelevent content</option>
                                            <option value="recist">Recist</option>
                                            <option value="violent">violent activity</option>
                                        </select>
                                    </td>
                                    <td >
                                        <span className="flex justify-center">
                                            <button
                                                className="btn btn-sm btn-primary">
                                                Report
                                            </button>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="flex justify-center items-center mt-4 gap-2">

                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`btn btn-sm ${currentPage === 1 ? "btn-disabled" : ""}`}
                    >
                        Previous
                    </button>


                    {pages.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`btn btn-sm ${currentPage === index + 1 ? "btn-active btn-primary" : ""
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`btn btn-sm ${currentPage === totalPages ? "btn-disabled" : ""
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentsTable;