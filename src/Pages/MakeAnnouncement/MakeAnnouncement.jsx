import React, { useEffect, useState } from "react";
import getUserFromDB from "../../TanStackAPIs/getUserFromDB";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import getAnnounces from "../../TanStackAPIs/getAnnounces";
import Swal from "sweetalert2";

const MakeAnnouncement = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { userFromDB } = getUserFromDB();
    const axiosSecure = useAxiosSecure();
    const [totalAnnounces, setTotalAnnounces] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);

    const announcesPerPage = 5;
    const totalPages = Math.ceil(totalAnnounces / announcesPerPage);
    const pages = [...Array(totalPages).keys()];

    useEffect(() => {
        const fetchTotalAnnounces = async () => {
            if (userFromDB?.email) {
                const { data } = await axiosSecure.get(
                    `/announcecount`
                );
                setTotalAnnounces(data.totalCount);
            }
        };
        fetchTotalAnnounces()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userFromDB?._id) return
        const insRes = axiosSecure.post('/announce', {
            title,
            description,
            adminImage: userFromDB?.profileImage,
            adminName: userFromDB?.name
        })
        Swal.fire({
            icon: 'success',
            title: 'Announcement Added',
        });
        setTitle("");
        setDescription("");
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const { allAnnounces, refetch } = getAnnounces((currentPage - 1), announcesPerPage)

    const handleDelete = async (announceId) => {
        const { data } = await axiosSecure.delete(`/announce?announceId=${announceId}`);
        Swal.fire({
            icon: 'success',
            title: 'Announce deleted',
        });
        refetch()
    }

    return (
        <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl font-bold text-center mt-20 text-blue-600">Make an Announcement</h1>
            <button
                onClick={() => setOpenModal(true)}
                className=" bg-blue-600 mt-5 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
                Create announce
            </button>
            {openModal &&
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter title"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter description"
                                    rows="4"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => setOpenModal(false)}
                                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            }

            <div className="w-8/12 mt-7">
                {
                    allAnnounces?.map((announce, index) => (
                        <div key={index} className="flex h-fit items-center justify-between p-5 bg-white shadow-lg rounded-lg">
                            <div className="w-fit flex gap-5">
                                <div className="w-fit flex flex-col items-center">
                                    <img className="rounded-full size-28" src={announce.adminImage} alt="Admin" />
                                    <span className="font-bold text-gray-800">{announce.adminName}</span>
                                </div>
                                <div className="w-fit pt-4">
                                    <h3 className="text-2xl font-bold text-gray-900">{announce.title}</h3>
                                    <p className="text-gray-600">{announce.description}</p>
                                </div>
                            </div>
                            <div className="w-fit flex justify-center">
                                <button
                                    onClick={() => handleDelete(announce._id)}
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="flex justify-center items-center mt-6 gap-2">

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
    );
};

export default MakeAnnouncement;
