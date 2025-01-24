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
    const [searchText, setSearchText] = useState("");
    
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

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const { allUsers, refetch } = getAllUsers(skip, usersPerPage, searchText);

    return (
        <div className="w-full h-full flex flex-col items-center">
            <h1 className="text-4xl mt-10">Manage all Users</h1>

            <div className="w-[60%] p-6 mt-10 bg-gray-100">
                <div className="flex items-center justify-end">
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            onChange={(event)=>setSearchText(event.target.value)}
                            type="text"
                            className="grow"
                            placeholder="Search" />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd" />
                        </svg>
                    </label>
                </div>
                <div className="overflow-x-auto w-full mt-5">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>user name</th>
                                <th className="flex justify-center">email</th>
                                <th><span className="flex justify-center">Membership</span></th>
                                <th><span className="flex justify-center">role</span></th>
                                <th><span className="flex justify-center">Swich Role</span></th>
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