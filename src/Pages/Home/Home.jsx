import React, { useContext, useEffect, useState } from 'react';
import getAllPosts from '../../TanStackAPIs/getAllPosts';
import PostCard from '../../Components/PostCard/PostCard';
import getUserFromDB from '../../TanStackAPIs/getUserFromDB';
import Banner from '../../Components/banner/Banner';
import useAppContext from '../../Contexts/useAppContext';
import useAxiosPublic from '../../Hooks/useAxiosPublic';


const Home = () => {
    const { searchText, setSearchText } = useAppContext();
    const axiosPublic = useAxiosPublic()
    const { userFromDB } = getUserFromDB();
    const [sortBy, setSortBy] = useState("latest");
    const [totalPosts, setTotalPosts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(()=>{
        axiosPublic('/postcount')
        .then(res=>setTotalPosts(res?.data?.totalcount))
    },[])

    const postsPerPage = 5;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const pages = [...Array(totalPages).keys()];


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const { allPosts, refetch } = getAllPosts(searchText, (currentPage-1), postsPerPage, sortBy)
    return (
        <div className='bg-gray-100 flex w-full flex-col items-center'>
            <Banner />
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