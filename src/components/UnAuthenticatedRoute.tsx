import {
    Navigate, Outlet
} from "react-router-dom";
import { useAppContext } from "../lib/userContext";

export default function UnauthenticatedRoute({ children, ...rest }: any) {
    const { isAuthenticated } = useAppContext();

    return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}