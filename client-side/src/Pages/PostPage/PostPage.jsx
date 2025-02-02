import React, { useState, useEffect } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useParams } from "react-router";
import LoadingPage from "../LoadingPage/LoadingPage";
import getUserFromDB from "../../TanStackAPIs/getUserFromDB";
import PostPageView from "../../Components/PostPageView/PostPageView";

const PostPage = () => {

    const axiosPublic = useAxiosPublic()
    const param = useParams()
    const [post, setPost]= useState({});
    const [isPending, setIsPending] = useState(true);
    
    const { userFromDB } = getUserFromDB()
    
    async function postDataLoad() {
        setIsPending(true);
        try {
            const { data } = await axiosPublic(
                `/post?userId=${userFromDB?._id || ""}&pid=${param.postId}`
            );
            setPost(data[0]);
        } catch (error) {
            console.error("Failed to load post data:", error);
        } finally {
            setIsPending(false);
        }
    }
    useEffect(() => {
        if (userFromDB) {
            postDataLoad();
        }
    }, [userFromDB]);


    if(isPending) return <LoadingPage/>

    return (
        <div>      
            {
                post && (<PostPageView post={post} userId={userFromDB? userFromDB._id : ""} refreshPost={postDataLoad}/>)
            }
        </div>

    );
};

export default PostPage;
