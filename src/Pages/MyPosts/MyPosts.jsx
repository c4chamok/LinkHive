import React, { useEffect, useState } from "react";
import useAppContext from "../../Contexts/useAppContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const PostsTableWithPagination = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const postsPerPage = 5; // Number of posts per page
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const pages = [...Array(totalPages).keys()];

    // Fetch total post count for the user
    useEffect(() => {
        const fetchTotalPosts = async () => {
            if (user?.email) {
                try {
                    const { data } = await axiosSecure.get(
                        `/postscountbyuser?userEmail=${user.email}`
                    );
                    setTotalPosts(data.totalCount); // Ensure your backend sends totalCount
                } catch (error) {
                    console.error("Error fetching total posts:", error);
                }
            }
        };

        fetchTotalPosts();
    }, [user?.email, axiosSecure]);

    // Fetch paginated posts
    useEffect(() => {
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
        console.log(totalPages);

        fetchPosts();
    }, [user?.email, currentPage, axiosSecure]);


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
                            </tr>
                        </thead>
                        <tbody className="">
                            {posts.map((post, index) => (
                                <tr className="" key={post._id}>
                                    <td>{(currentPage - 1) * postsPerPage + index + 1}</td>
                                    <td>{post.title}</td>
                                    <td><span className="flex justify-center">{post.upVotes + post.downVotes}</span></td>
                                    <td className="flex justify-center">
                                        <button className="btn btn-sm btn-primary">
                                            See Comments ({post.commentCount})
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-4 gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`btn btn-sm ${currentPage === 1 ? "btn-disabled" : ""}`}
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
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

                    {/* Next Button */}
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
