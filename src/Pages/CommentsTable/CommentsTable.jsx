import React, { useEffect, useState } from "react";
import useAppContext from "../../Contexts/useAppContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link, useParams } from "react-router";
import getUserFromDB from "../../TanStackAPIs/getUserFromDB";
import CommentsRow from "../../Components/CommentsRow/CommentsRow";


const CommentsTable = () => {
    const param = useParams()
    const axiosSecure = useAxiosSecure();
    const { user } = useAppContext();
    const { userFromDB } = getUserFromDB();
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [fullComment, setFullComment] = useState("");
    // console.log(userFromDB);
    const CommentsPerPage = 10;
    const totalPages = Math.ceil(totalComments / CommentsPerPage);
    const pages = [...Array(totalPages).keys()];

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
        if (userFromDB?._id) {
            try {
                const skip = (currentPage - 1);
                const { data } = await axiosSecure.get(
                    `/comments?postId=${param.postId}&page=${skip}&size=${CommentsPerPage}&userId=${userFromDB?._id}`
                );
                setComments(data);
            } catch (error) {
                console.error("Error fetching Comments:", error);
            }
        }

    };

    useEffect(() => {
        fetchComments();
    }, [currentPage, totalPages, userFromDB?._id]);


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    console.log(comments);
    return (
        <div className="w-full h-full flex flex-col items-center">
            <h1 className="text-4xl mt-10">See all your Posts</h1>
            {fullComment && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white  p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Full Comment</h2>
                        <p className="mb-6">{fullComment}</p>
                        <button
                            onClick={()=>setFullComment("")}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
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
                            {comments.map((comment, index) => (<CommentsRow 
                            key={comment._id}
                            userFromDB={userFromDB} 
                            currentPage={currentPage} 
                            index={index} 
                            comment={comment} 
                            setFullComment={setFullComment}
                            refresh={fetchComments}
                            >
                            </CommentsRow>))}
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