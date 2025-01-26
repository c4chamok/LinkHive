import React, { useEffect, useState } from "react";
import useAppContext from "../../Contexts/useAppContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link } from "react-router";

const PostsTableWithPagination = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const postsPerPage = 10;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const pages = [...Array(totalPages).keys()];


    useEffect(() => {
        const fetchTotalPosts = async () => {
            if (user?.email) {
                try {
                    const { data } = await axiosSecure.get(
                        `/postscountbyuser?userEmail=${user.email}`
                    );
                    setTotalPosts(data.totalCount);
                } catch (error) {
                    console.error("Error fetching total posts:", error);
                }
            }
        };

        fetchTotalPosts();
    }, [user?.email, axiosSecure]);

    const fetchPosts = async () => {
        if (user?.email) {
            try {
                const skip = (currentPage - 1);
                const { data } = await axiosSecure.get(
                    `/postsbyuser?userEmail=${user.email}&page=${skip}&size=${postsPerPage}`
                );
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }
    };
    useEffect(() => {

        fetchPosts();
    }, [user?.email, currentPage, axiosSecure]);

    const handleDelete = async (postId) => {
        const { data } = await axiosSecure.delete(`/post?postId=${postId}`);
        Swal.fire({
            icon: 'success',
            title: 'Post Successfully',
        });
        fetchPosts();

    }


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center">
            <h1 className="text-4xl mt-10">See all your Posts</h1>
            <div className="w-[60%] p-6 mt-10 bg-gray-100">
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th><span className="flex justify-center">Total Votes</span></th>
                                <th className="flex justify-center">Actions</th>
                                <th><span className="flex justify-center">Delete</span></th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {posts.map((post, index) => (
                                <tr className="" key={post._id}>
                                    <td>{(currentPage - 1) * postsPerPage + index + 1}</td>
                                    <td>{post.title}</td>
                                    <td><span className="flex justify-center">{post.upVotes + post.downVotes}</span></td>
                                    <td className="flex justify-center">
                                        <Link to={`/dashboard/comments/${post._id}`} className="btn btn-sm btn-primary">
                                            See Comments ({post.commentCount})
                                        </Link>
                                    </td>
                                    <td >
                                        <span className="flex justify-center">
                                            <button
                                                onClick={() => handleDelete(post._id)}
                                                className="btn btn-sm btn-primary">
                                                Delete
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

export default PostsTableWithPagination;
