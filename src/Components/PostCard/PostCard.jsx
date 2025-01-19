import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaComment, FaCrown, FaUserCircle, FaShareAlt } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

const PostCard = ({ post }) => {
    const {
        title,
        description,
        image,
        tags,
        upVote,
        downVote,
        commentCount,
        authorData,
        createdAt,
    } = post;

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-5 relative">
            {/* 3-Dot Menu */}
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

            {/* Title and Author */}
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

            {/* Timestamp */}
            <p className="text-gray-500 text-xs mt-4">
                Posted on {new Date(createdAt).toLocaleDateString()}
            </p>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            {/* Post Image */}
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover mb-4 rounded-lg"
                />
            )}

            {/* Description */}
            <p className="text-gray-700 text-sm mb-4">{description}</p>

            {/* Tags */}
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

            {/* Interaction Buttons */}
            <div className="flex justify-between items-center border-t pt-4">
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                    <FaThumbsUp />
                    <span>{upVote} Upvote</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-600">
                    <FaThumbsDown />
                    <span>{downVote} Downvote</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                    <FaComment />
                    <span>{commentCount} Comments</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                    <FaShareAlt />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
};

export default PostCard;
