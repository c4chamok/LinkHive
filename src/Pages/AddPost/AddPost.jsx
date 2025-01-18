import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import useAppContext from "../../Contexts/useAppContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import getUserFromDB from "../../TanStackAPIs/getUserFromDB";

const AddPost = () => {
    const { userFromDB } = getUserFromDB()
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
    const [isUploading, setIsUploading] = useState(false);
    const [tags, setTags] = useState([]);
    const axiosSecure = useAxiosSecure();

    const tagOptions = [
        { value: "technology", label: "Technology" },
        { value: "education", label: "Education" },
        { value: "health", label: "Health" },
        { value: "lifestyle", label: "Lifestyle" },
    ];

    const onSubmit = async (data) => {
        try {
            let imageUrl = "";
            if (data.image[0]) {
                setIsUploading(true);
                const formData = new FormData();
                formData.append("image", data.image[0]);

                const res = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbb_key}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                imageUrl = res.data.data.display_url;
                setIsUploading(false);
            }

            const postData = {
                title: data.title,
                description: data.description,
                image: imageUrl,
                tags: tags.map(tag => tag.value),
                authorId: userFromDB?._id,
                authorEmail: userFromDB?.email
            };

            const insertResponse = await axiosSecure.post('/post', postData)

            console.log("Post Data:", insertResponse);

        }finally{
            reset();
            setTags(null)
        }

    };

    return (
        <div className="w-full flex justify-center items-center">
            <div className="w-[50%] p-6 shadow-lg rounded-lg">
                <h1 className="text-2xl font-semibold mb-6">Create New Post</h1>
                <form onSubmit={handleSubmit(onSubmit)} className=" grid-cols-2 grid gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            {...register("title", { required: "Title is required" })}
                            className="mt-1 w-full p-2 h-[30px] border-b-2 border border-gray-800 rounded-md shadow-sm text-xl  focus-within:outline-none"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            className="mt-1 block border-b-2 border rounded-md border-gray-800 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tags</label>
                        <Select
                            isMulti
                            value={tags}
                            options={tagOptions}
                            onChange={setTags}
                            className="mt-1 border-b-2 border border-gray-800 rounded-md"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            rows="4"
                            className="mt-1 p-3 block w-full col-span-2 rounded-md border-b-2 border border-gray-800 shadow-sm focus-within:outline-none"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full flex col-span-2 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isUploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Create Post"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPost;