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
import MyPosts from "../Pages/MyPosts/MyPosts";
import CommentsTable from "../Pages/CommentsTable/CommentsTable";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import UsersTable from "../Pages/UserTable/UsersTable";


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
                element: <PrivateRoute><MyProfile/></PrivateRoute>
            },
            {
                path: 'addpost',
                element: <PrivateRoute><AddPost/></PrivateRoute>
            },
            {
                path: 'myposts',
                element: <PrivateRoute><MyPosts/></PrivateRoute>
            },
            {
                path: 'subscribe',
                element: <PrivateRoute><PaymentPage/></PrivateRoute>
            },
            {
                path: 'comments/:postId',
                element:  <PrivateRoute><CommentsTable/></PrivateRoute>
            },
            {
                path: 'allusers',
                element:  <AdminRoute><UsersTable/></AdminRoute>
            },
        ]
    }
]);


export default router