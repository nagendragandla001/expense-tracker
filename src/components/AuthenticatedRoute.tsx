import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../lib/userContext';

const AuthenticatedRoute = ({ element }: any): JSX.Element => {
    const { isAuthenticated } = useAppContext();
    return (
        isAuthenticated ? <Outlet /> : <Navigate to="/" />
    )
}

export default AuthenticatedRoute;