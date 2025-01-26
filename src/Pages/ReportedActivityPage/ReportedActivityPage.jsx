import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAppContext from '../../Contexts/useAppContext';
import getReportedActivities from '../../TanStackAPIs/getReportedActivities';
import ReportsRow from '../../Components/ReportsRow/ReportsRow';
import { all } from 'axios';

const ReportedActivityPage = () => {
    const axiosSecure = useAxiosSecure();
    const { userFromDB } = useAppContext()
    const [totalReports, setTotalReports] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const skip = (currentPage - 1);

    const ReportsPerPage = 10;
    const totalPages = Math.ceil(totalReports / ReportsPerPage);
    const pages = [...Array(totalPages).keys()];

    useEffect(() => {
        const fetchTotalReports = async () => {
            try {
                const { data } = await axiosSecure.get(`/reportscount`);
                setTotalReports(data.totalCount);
            } catch (error) {
                console.error("Error fetching total users:", error);
            }
        };

        fetchTotalReports();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const { allReports, refetch } = getReportedActivities(skip, ReportsPerPage);

    console.log(allReports);



    return (
        <div className="w-full h-full flex flex-col items-center">
            <h1 className="text-4xl mt-10">Total Reports {totalReports}</h1>

            <div className="w-[80%] p-6 mt-10 bg-gray-100">
                <div className="overflow-x-auto w-full mt-5">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Activity Type</th>
                                <th className="flex justify-center">Reported By</th>
                                <th><span className="flex justify-center">Feedback</span></th>
                                <th><span className="flex justify-center">Time</span></th>
                                <th><span className="flex justify-center">Content link</span></th>
                                <th><span className="flex justify-center">Action</span></th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {allReports?.map((report, index) => (<ReportsRow
                                key={report._id}
                                userFromDB={userFromDB}
                                currentPage={currentPage}
                                index={index}
                                report={report}
                                refresh={refetch}
                            >
                            </ReportsRow>))}
                        </tbody>
                    </table>
                </div>


                <div className="flex justify-center items-center mt-4 gap-2">

                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`btn btn-sm ${currentPage === 1 ? "btn-disabled" : ""}`}
                    >
                        Previous
                    </button>


                    {pages.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`btn btn-sm ${currentPage === index + 1 ? "btn-active btn-primary" : ""
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`btn btn-sm ${currentPage === totalPages ? "btn-disabled" : ""
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportedActivityPage;