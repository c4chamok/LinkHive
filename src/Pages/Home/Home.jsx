import React, { useContext, useEffect } from 'react';
import getAllPosts from '../../TanStackAPIs/getAllPosts';
import PostCard from '../../Components/PostCard/PostCard';


const Home = () => {
   const { allPosts, refetch } = getAllPosts()
    console.log(allPosts);
    return (
        <div className='flex flex-col items-center'>
            <div className='w-6/12'>
                {
                    allPosts.map(post=><PostCard post={post}/>)
                }
            </div>
        </div>
    );
};

export default Home;