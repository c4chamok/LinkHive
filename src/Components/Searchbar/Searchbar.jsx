import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router';
import useAppContext from '../../Contexts/useAppContext';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import getAllPosts from '../../TanStackAPIs/getAllPosts';


const Searchbar = () => {
    const [result, setResult] = useState([]);
    const {searchText, setSearchText} = useAppContext();
    const axiosPublic = useAxiosPublic();

    const initSearch = async (event) => {
        // const searchValue = event.target.value;
        // setSearchText(searchValue);

        // if (searchValue === '') {
        //     setResult([]);
        //     return;
        // }

        // axiosPublic(`/searchpost?searchText=${searchValue}`)
        //     .then((res) => {
        //         setResult(res.data);
        //     });
    };

    // const {refetch} = getAllPosts(searchText)
    const handleSearch = (event) => {
        event.preventDefault();
        const searchValue = event.target.search.value;
        setSearchText(searchValue);
    }

    return (
        <div

            className="relative z-30 bg-white/35 rounded-md">
            <form
                className="flex gap-2 bg-transparent items-center dropdown"
                onSubmit={()=>handleSearch(event)}
            >
                <label className="input bg-transparent focus-within:outline-none focus-within:ring-0 input-bordered flex items-center gap-2">
                    <input
                        tabIndex={0}
                        onChange={initSearch}
                        type="text"
                        name="search"

                        placeholder="Search for posts"
                        className=" grow rounded-md w-full"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd" />
                    </svg>
                </label>
                {/* <div
                    tabIndex={0}
                    className="absolute menu menu-sm dropdown-content top-full left-0 right-0 mt-1 bg-white border shadow-md rounded-md overflow-y-auto">
                    {result.length > 0 ? (
                        result.map((item) => (
                            <div
                                key={item._id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-4" 
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-12 h-12 object-cover rounded-md"
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.companyName}</p>
                                    <p className="text-sm text-blue-500">{item.price} BDT</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500">No Results Found</div>
                    )}
                    <button
                        className="px-4 py-2 text-blue-500 hover:text-blue-700 cursor-pointer border-t"
                        type='button'
                    >
                        Show More
                    </button>
                </div> */}
            </form>
        </div>
    );
};

export default Searchbar;
