import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaComment, FaShareAlt, FaCrown } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import getAllPosts from '../../TanStackAPIs/getAllPosts';

const PostPageView = ({post, userId, refreshPost}) => {
    const { refetch } = getAllPosts()
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();
    console.log(post);

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
            userInteraction,
        } = post;
        const [voteCount, setVoteCount] = useState({ upVotes, downVotes });
        const [menuOpen, setMenuOpen] = useState(false);
        const [vote, setVote] = useState(userInteraction.vote);
        const [comments, setComments] = useState([]);
        console.log(comments);

        const fetchComments = async () => {
            if (_id) {
                const { data } = await axiosPublic.get(`/comments?postId=${_id}`);
                setComments(data);
            } 
        };
    
        useEffect(() => {
            fetchComments();
        }, [_id]);
    
        const handleVote = async (postId, userId, newVote) => {
            const { data } = await axiosSecure.post("/vote", {
                postId,
                vote: newVote,
                userId,
            });
            setVoteCount({
                upVotes: data.upVoteCount,
                downVotes: data.downVoteCount,
            });
            refetch()
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
    
        const handleCommentSubmit = async (event) => {
            event.preventDefault();
            const { coment } = event.target
            if (!coment.value.trim()) return;
            const { data } = await axiosSecure.post("/comment", {
                postId: _id,
                userId,
                content: coment.value.trim(),
            });
            fetchComments();
            refreshPost();
        };
    
        return (
            <div className="max-w-3xl mx-auto p-5">
                <div className="bg-white shadow-md rounded-lg overflow-hidden p-5 relative mb-8">
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
                                <img src={authorData?.profileImage} className="rounded-full w-7 h-7" alt="" />
                                <p className="text-sm text-gray-600">{authorData?.name}</p>
                                {authorData?.membership && (
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
                        <button
                            onClick={upvoting}
                            className={`flex items-center gap-2 text-gray-600 hover:text-blue-600 ${
                                vote === "upVote" ? "bg-blue-500/35" : ""
                            }`}
                        >
                            <FaThumbsUp />
                            <span>{voteCount.upVotes} Upvote</span>
                        </button>
                        <button
                            onClick={downvoting}
                            className={`flex items-center gap-2 text-gray-600 hover:text-red-600 ${
                                vote === "downVote" ? "bg-red-500/35" : ""
                            }`}
                        >
                            <FaThumbsDown />
                            <span>{voteCount.downVotes} Downvote</span>
                        </button>
                        <button className={`flex items-center gap-2 text-gray-600 hover:text-green-600 
                            ${userInteraction.commented && "bg-green-500/35"}`}>
                            <FaComment />
                            <span>{commentCount} Comments</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                            <FaShareAlt />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
    
                {/* Comments Section */}
                <div className="bg-white shadow-md rounded-lg p-5">
                    <h3 className="text-lg font-bold mb-4">Comments</h3>
    
                    {comments.length > 0 ? (
                        <ul className="space-y-4">
                            {comments.map((comment) => (
                                <li
                                    key={comment._id}
                                    className="border-b pb-4 flex gap-4 items-start"
                                >
                                    <img
                                        src={comment.userDetails.profileImage}
                                        alt=""
                                        className="rounded-full w-8 h-8"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-700">
                                            {comment.userDetails.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {comment.content}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                    )}
    
                    <form onSubmit={handleCommentSubmit} className="mt-4">
                        <textarea
                            name='coment'
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
                            rows="3"
                            placeholder="Write a comment..."
                        ></textarea>
                        <button
                            type="submit"
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Post Comment
                        </button>
                    </form>
                </div>
            </div>
    
        );
    };

export default PostPageView;