import { Navigate, useLocation } from 'react-router';
import useAppContext from '../Contexts/useAppContext';
import LoadingPage from '../Pages/LoadingPage/LoadingPage';


const PrivateRoute = ({children}) => {

    const { user, loading } = useAppContext()
    const location = useLocation();


    if(loading){
        return <LoadingPage></LoadingPage>
    }

    if(user){
        return children
    }

    return (
        <Navigate to={'/login'} state={{ from: location }}></Navigate>
    );
};

export default PrivateRoute;