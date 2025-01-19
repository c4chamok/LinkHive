import React, { useContext, useEffect } from 'react';
import getAllPosts from '../../TanStackAPIs/getAllPosts';
import PostCard from '../../Components/PostCard/PostCard';
import getUserFromDB from '../../TanStackAPIs/getUserFromDB';


const Home = () => {
   const { allPosts, refetch } = getAllPosts()
   const { userFromDB } = getUserFromDB()
    console.log(allPosts,userFromDB);
    return (
        <div className='flex flex-col items-center'>
            <div className='w-6/12'>
                {
                    allPosts?.map((post)=>(<PostCard key={post?._id} post={post} userId={userFromDB? userFromDB._id : ""}/>))
                }
            </div>
        </div>
    );
};

export default Home;