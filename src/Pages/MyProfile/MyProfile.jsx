import React from "react";
import { FaUserCircle, FaCrown, FaMedal } from "react-icons/fa";
import getUserFromDB from "../../TanStackAPIs/getUserFromDB";
import { Link, Navigate } from "react-router";

const MyProfile = () => {

    const { userFromDB: user, refetch } = getUserFromDB()

    if (user?.role === 'admin') return <Navigate to={`/dashboard/admin-profile`}></Navigate>

  return (

    <div className=" w-full flex justify-center items-center">
      <div className="w-[40%]  bg-white shadow-lg rounded-lg overflow-hidden">

        <div className="flex flex-col items-center p-8 border-b">

          <img
            src={user?.profileImage || "https://via.placeholder.com/150"}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
          />
          <h1 className="text-xl font-semibold text-gray-800 mt-4">{user?.name}</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <span className={`text-xs mt-2 px-3 py-1 rounded-full ${user?.membership ? "bg-yellow-300 text-yellow-800" 
            : "bg-gray-200 text-gray-600"}`}>
            {user?.membership ? "Premium Member" : "Free User"}
          </span>
        </div>


        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-gray-800 text-2xl font-semibold">{user?.postsCount}</p>
            <p className="text-gray-500 text-sm">Posts</p>
          </div>
          <div>
            <p className="text-gray-800 text-2xl font-semibold">{user?.commentCount}</p>
            <p className="text-gray-500 text-sm">Comments</p>
          </div>
          <div>
            <p className="text-gray-800 text-2xl font-semibold">{user?.badges.length}</p>
            <p className="text-gray-500 text-sm">Badges</p>
          </div>
        </div>


        <div className="px-6 pb-6">
          <h3 className="text-gray-800 font-medium text-lg mb-3">Badges</h3>
          <div className="flex items-center gap-4">
            {user?.badges.length > 0 ? (
              user?.badges.map((badge, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
                    badge === "bronze" ? "bg-amber-200 text-amber-700" :
                    badge === "silver" ? "bg-gray-300 text-gray-700" :
                    badge === "gold" ? "bg-yellow-300 text-yellow-800" : ""
                  }`}
                >
                  <FaMedal />
                  <span>{badge.charAt(0).toUpperCase() + badge.slice(1)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No badges earned yet.</p>
            )}
          </div>
        </div>

        {!user?.membership && (
          <div className="p-6 border-t">
            <Link to={'/dashboard/subscribe'}
              className="w-full bg-green-500 text-white font-medium text-sm py-2 px-4 rounded-lg hover:bg-green-600 transition"
            >
              Become a Member
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
