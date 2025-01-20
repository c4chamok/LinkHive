import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaComment, FaCrown, FaUserCircle, FaShareAlt } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Link } from "react-router";

const PostCard = ({ post, userId }) => {
    const {
        _id,
        title,
        description,
        image,
        tags,
        upVotes,
        downVotes,
        commentCount,
        authorData,
        createdAt,
        userInteraction
    } = post;



    const axiosSecure = useAxiosSecure();
    const [voteCount, setvoteCount] = useState({ upVotes, downVotes });
    const [menuOpen, setMenuOpen] = useState(false);
    const [vote, setVote] = useState(userInteraction.vote);

    const handleVote = async (postId, userId, newVote) => {
        const { data } = await axiosSecure.post('/vote', {
            postId,
            vote: newVote,
            userId,
        });
        setvoteCount({
            upVotes: data.upVoteCount,
            downVotes: data.downVoteCount
        })
    };

    const upvoting = () => {
        const newVote = vote === "upVote" ? "" : "upVote";
        setVote(newVote);
        handleVote(_id, userId, newVote);
    };

    const downvoting = () => {
        const newVote = vote === "downVote" ? "" : "downVote";
        setVote(newVote);
        handleVote(_id, userId, newVote);
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-5 relative">

            <div className="absolute top-4 right-4">
                <button
                    className="text-gray-600 hover:text-gray-900 focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <HiDotsVertical size={20} />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Report
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Save
                        </button>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mt-1">
                        <img src={authorData?.profileImage} className="rounded-full size-7" alt="" />
                        <p className="text-sm text-gray-600">{authorData.name}</p>
                        {authorData.membership && (
                            <span className="bg-yellow-300 text-yellow-800 text-xs font-medium px-2 py-1 rounded-lg flex items-center">
                                <FaCrown className="mr-1" />
                                Member
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-gray-500 text-xs mt-4">
                Posted on {new Date(createdAt).toLocaleDateString()}
            </p>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>

            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover mb-4 rounded-lg"
                />
            )}

            <p className="text-gray-700 text-sm mb-4">{description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-lg"
                    >
                        #{tag}
                    </span>
                ))}
            </div>
            <div className="flex justify-between items-center border-t pt-4">
                <button onClick={upvoting} className={`flex items-center gap-2 text-gray-600 hover:text-blue-600 
                    ${vote === "upVote" ? " bg-blue-500/35":""}`}>
                    <FaThumbsUp />
                    <span>{voteCount.upVotes} Upvote</span>
                </button>
                <button onClick={downvoting} className={`flex items-center gap-2 text-gray-600 hover:text-red-600 
                    ${vote === "downVote" ? " bg-red-500/35":""}`}>
                    <FaThumbsDown />
                    <span>{voteCount.downVotes} Downvote</span>
                </button>
                <Link to={`/post/${_id}`} className={`flex items-center gap-2 text-gray-600 hover:text-green-600 
                            ${userInteraction.commented && "bg-green-500/35"}`}>
                    <FaComment />
                    <span>{commentCount} Comments</span>
                </Link>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                    <FaShareAlt />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
};

export default PostCard;
