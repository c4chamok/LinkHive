import React, { useContext, useEffect, useState } from 'react';
import getAllPosts from '../../TanStackAPIs/getAllPosts';
import PostCard from '../../Components/PostCard/PostCard';
import getUserFromDB from '../../TanStackAPIs/getUserFromDB';
import Banner from '../../Components/banner/Banner';
import useAppContext from '../../Contexts/useAppContext';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import getAnnounces from '../../TanStackAPIs/getAnnounces';


const Home = () => {
    const { searchText, setSearchText } = useAppContext();
    const axiosPublic = useAxiosPublic()
    const { userFromDB } = getUserFromDB();
    const [sortBy, setSortBy] = useState("latest");
    const [totalPosts, setTotalPosts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const { allAnnounces, refetch: refresh } = getAnnounces(0, 20);
    const [tags, setTags] = useState([]);
    document.title = "LinkHive | Home";
    const fetchTags = (params) => {
        axiosPublic('/tags').then(res => setTags(res.data));
    }

    useEffect(() => {
        fetchTags()
    }, [])

    useEffect(() => {
        axiosPublic('/postcount')
            .then(res => setTotalPosts(res?.data?.totalcount))
    }, [])

    const postsPerPage = 5;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const pages = [...Array(totalPages).keys()];


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const { allPosts, refetch } = getAllPosts(searchText, (currentPage - 1), postsPerPage, sortBy)
    return (
        <div className='bg-gray-100 flex w-full flex-col items-center mb-20'>
            <Banner />
            <div className="mt-16 w-7/12">
                <h4 className="font-bold">Tags:</h4>
                <div className="flex gap-2 flex-wrap mt-2">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            onClick={()=>setSearchText(tag.tag)}
                            className="bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer"
                        >
                            {tag.tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="w-8/12 mt-8">
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

                        </div>
                    ))
                }
            </div>

            <div className='w-full flex justify-center gap-7  mt-10'>
                <div className='p-4'>
                    <h4>Sort By</h4>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="select select-bordered w-full max-w-xs">
                        <option>Latest</option>
                        <option>Popularity</option>
                    </select>
                </div>
                <div className='w-6/12 flex flex-col gap-2'>
                    {
                        allPosts?.map((post) => (<PostCard key={post?._id} post={post} userId={userFromDB ? userFromDB._id : ""} />))
                    }
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
        </div>
    );
};

export default Home;