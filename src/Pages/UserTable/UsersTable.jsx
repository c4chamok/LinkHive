import React, { useEffect, useState } from "react";
import useAppContext from "../../Contexts/useAppContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link } from "react-router";
import getUserFromDB from "../../TanStackAPIs/getUserFromDB";
import getAllUsers from "../../TanStackAPIs/getAllUsers";
import UsersRow from "../../Components/UsersRow/UsersRow";

const UsersTable = () => {
    const axiosSecure = useAxiosSecure();
    const { userFromDB } = useAppContext()
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const skip = (currentPage - 1);

    const usersPerPage = 5;
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const pages = [...Array(totalPages).keys()];

    useEffect(() => {
        const fetchTotalusers = async () => {
            try {
                const { data } = await axiosSecure.get(`/userscount`);
                setTotalUsers(data.totalCount);
            } catch (error) {
                console.error("Error fetching total users:", error);
            }
        };

        fetchTotalusers();
    }, []);

    const { allUsers, refetch } = getAllUsers(skip, usersPerPage);

    console.log(allUsers);
    return (
        <div className="w-full h-full flex flex-col items-center">
            <h1 className="text-4xl mt-10">See all your Posts</h1>
            
            <div className="w-[60%] p-6 mt-10 bg-gray-100">
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>user name</th>
                                <th className="flex justify-center">email</th>
                                <th><span className="flex justify-center">role</span></th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {allUsers?.map((user, index) => (<UsersRow
                                key={user._id}
                                userFromDB={userFromDB}
                                currentPage={currentPage}
                                index={index}
                                user={user}
                                refresh={refetch}
                            >
                            </UsersRow>))}
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

export default UsersTable;