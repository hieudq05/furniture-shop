import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export default function LoggedInRoute() {
    const accessToken = Cookies.get("access_token");
    return accessToken ? (
        <Navigate to="/" state={{ from: location.pathname }} replace />
    ) : (
        <Outlet />
    );
}
