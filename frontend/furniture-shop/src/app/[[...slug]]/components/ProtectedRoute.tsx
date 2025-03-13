import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    requiredRole?: string;
    userRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    isAuthenticated,
    requiredRole,
    userRole,
}) => {
    if (!isAuthenticated) {
        fetch("http://localhost:8080/api/token/refresh", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refreshToken: Cookies.get("refreshToken"),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    Cookies.set("access_token", data.data.access_token, {
                        expires: 1,
                    });
                } else {
                    return (
                        <Navigate
                            to="/login"
                            state={{ from: location.pathname }}
                            replace
                        />
                    );
                }
            });
    }

    if (requiredRole && userRole !== requiredRole) {
        return (
            <Navigate to="/login" state={{ from: location.pathname }} replace />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
