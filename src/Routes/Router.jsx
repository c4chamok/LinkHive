import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout></MainLayout>,
        // children: [
        //     {
        //         path:'/',
        //         element: <Home></Home>
        //     },
            // {
            //     path: '/login',
            //     element: <Login/>
            // },
            // {
            //     path: '/register',
            //     element: <Register/>
            // },
        // ]
    }
]);


export default router