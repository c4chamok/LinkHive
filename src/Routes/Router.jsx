import { createBrowserRouter, Navigate } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home"
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import DashboardLayot from "../Layouts/DashboardLayot";
import AddPost from "../Pages/AddPost/AddPost";
import PostPage from "../Pages/PostPage/PostPage";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import LoadingPage from "../Pages/LoadingPage/LoadingPage";
import MyProfile from "../Pages/MyProfile/MyProfile";
import PaymentPage from "../Pages/PaymentPage/PaymentPage"


const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout></MainLayout>,
        children: [
            {
                path:'/',
                element: <Home></Home>
            },
            {
                path: '/login',
                element: <Login/>
            },
            {
                path: '/register',
                element: <Register/>
            },
            {
                path: '/post/:postId',
                element: <PostPage/>
            },
        ]
    },
    {
        path: '/dashboard',
        element: <DashboardLayot/>,
        children:[
            {
                path: '',
                element: <Navigate to={'profile'}/>
            },
            {
                path: 'profile',
                element: <MyProfile/>
            },
            {
                path: 'addpost',
                element: <AddPost/>
            },
            {
                path: 'myposts',
                element: <h3 className="text-5xl">Thsi is my Posts</h3>
            },
            {
                path: 'checkout',
                element: <PaymentPage/>
            },
        ]
    }
]);


export default router