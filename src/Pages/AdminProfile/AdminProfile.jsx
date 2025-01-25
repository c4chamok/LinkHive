import React, { useEffect, useState } from 'react';
import getAdminData from '../../TanStackAPIs/getAdminData';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const AdminProfile = () => {
    const { adminData: data } = getAdminData();
    const axiosSecure = useAxiosSecure();
    const [tags, setTags] = useState([]);
    const adminData = data?.adminData;
    const usersCount = data?.usersCount;
    const postsCount = data?.postsCount;
    const commentsCount = data?.commentsCount;

    const fetchTags = (params) => {
        axiosSecure('/tags').then(res=>setTags(res.data));
    }

    useEffect(()=>{
        fetchTags()
    },[])

    const handleAddTag = async (e) => {
        e.preventDefault();
        const tagValue = e.target.tag.value
        if (!tagValue.trim()) return;        
        const serverRes = await axiosSecure.post('/tags', { tag: tagValue });
        fetchTags()
        console.log(serverRes);
    };

    const pieData = [
        { name: 'Posts', value: postsCount || 0 },
        { name: 'Comments', value: commentsCount || 0 },
        { name: 'Users', value: usersCount || 0 },
    ];

    const COLORS = ['#4caf50', '#2196f3', '#ff9800'];

    return (
        <div className="p-6 bg-gray-100 w-full h-screen">
            <div className='flex items-center justify-between gap-10'>
                <div className="bg-white flex-1 p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <img
                            src={adminData?.profileImage}
                            alt="Admin Profile"
                            className="w-20 h-20 rounded-full mr-6"
                        />
                        <div>
                            <h2 className="text-2xl font-bold">{adminData?.name}</h2>
                            <p className="text-gray-600">{adminData?.email}</p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <h3 className="text-lg font-bold">{postsCount || 0}</h3>
                            <p className="text-gray-600">Total Posts</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold">{commentsCount || 0}</h3>
                            <p className="text-gray-600">Total Comments</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold">{usersCount || 0}</h3>
                            <p className="text-gray-600">Total Users</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white flex-1 p-6 rounded-lg shadow-md mt-6">
                    <h3 className="text-xl font-bold mb-4">Site Activity Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-xl font-bold mb-4">Manage Tags</h3>
                <form onSubmit={handleAddTag} className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Enter new tag"
                        name='tag'
                        className="flex-1 p-2 border rounded-lg"
                    />
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                        Add Tag
                    </button>
                </form>

                <div className="mt-4">
                    <h4 className="font-bold">Tags:</h4>
                    <div className="flex gap-2 flex-wrap mt-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                            >
                                {tag.tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;