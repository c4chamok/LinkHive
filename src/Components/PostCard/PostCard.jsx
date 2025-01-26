import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaComment, FaCrown, FaUserCircle, FaShareAlt } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Link } from "react-router";
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, TwitterShareButton, XIcon } from "react-share";


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

    const shareUrl = `https://linkhivesps.web.app/post/${_id}`

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
        <div className="bg-white shadow-lg rounded-lg p-2 pt-4 relative">
            <div className="flex justify-between items-center">
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
                {/* <div className=" dropdown">
                    
                    <button

                        className="text-gray-600 hover:text-gray-900 focus:outline-none"
                    >
                        <HiDotsVertical size={20} />
                    </button>

                    <div tabIndex={0} className="dropdown-content menu right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Report
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Save
                        </button>
                    </div>

                </div> */}
                <p className="text-gray-500 text-xs">
                    Posted on {new Date(createdAt).toLocaleDateString()}
                </p>
            </div>

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
            <div className="flex justify-between gap-3 pt-2 items-center border-t">
                <button onClick={upvoting} className={`flex justify-center rounded-lg w-full py-2 items-center gap-2 text-gray-600 hover:text-blue-600 
                    ${vote === "upVote" ? " bg-blue-500/35" : ""}`}>
                    <FaThumbsUp />
                    <span>{voteCount.upVotes} Upvote</span>
                </button>
                <button onClick={downvoting} className={`flex justify-center rounded-lg w-full py-2 items-center gap-2 text-gray-600 hover:text-red-600 
                    ${vote === "downVote" ? " bg-red-500/35" : ""}`}>
                    <FaThumbsDown />
                    <span>{voteCount.downVotes} Downvote</span>
                </button>
                <Link to={`/post/${_id}`} className={`flex justify-center rounded-lg w-full py-2 items-center gap-2 text-gray-600 hover:text-green-600 
                            ${userInteraction.commented && "bg-green-500/35"}`}>
                    <FaComment />
                    <span>{commentCount} Comments</span>
                </Link>
                <div className=" dropdown">
                    <button className="flex justify-center rounded-lg w-full py-2 items-center gap-2 text-gray-600 hover:text-purple-600">
                        <FaShareAlt />
                        <span>Share</span>
                    </button>
                    <div tabIndex={0} className=" z-30 dropdown-content -top-16 right-0 mt-2 flex justify-center items-center gap-5 p-3 bg-white border border-gray-200 rounded-lg shadow-md">
                        <div className="Demo__some-network">
                            <FacebookShareButton
                                url={shareUrl}
                                className="Demo__some-network__share-button"
                            >
                                <FacebookIcon size={32} round />
                            </FacebookShareButton>
                        </div>
                        <div className="Demo__some-network">
                            <TwitterShareButton
                                url={shareUrl}
                                title={title}
                                className="Demo__some-network__share-button"
                            >
                                <XIcon size={32} round />
                            </TwitterShareButton>
                        </div>
                        <div className="Demo__some-network">
                            <TelegramShareButton
                                url={shareUrl}
                                title={title}
                                className="Demo__some-network__share-button"
                            >
                                <TelegramIcon size={32} round />
                            </TelegramShareButton>
                        </div>
                        <div className="Demo__some-network">
                            <LinkedinShareButton
                                url={shareUrl}
                                className="Demo__some-network__share-button"
                            >
                                <LinkedinIcon size={32} round />
                            </LinkedinShareButton>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
