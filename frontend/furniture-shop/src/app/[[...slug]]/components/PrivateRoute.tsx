import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUserClaims } from "./NavUser";

const PrivateRoute = () => {
    const userClaims = getUserClaims();

    return userClaims?.role.name == "Admin" ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
