import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { set } from "date-fns";

const URL_API_VALIDATE_TOKEN = "http://localhost:8080/api/token/validate";
const URL_API_REFRESH_TOKEN = "http://localhost:8080/api/token/refresh";

const RequireAuth = () => {
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null); // Ban đầu là null để kiểm tra trạng thái
    const access_token = Cookies.get("access_token");
    const location = useLocation();

    useEffect(() => {
        if (!access_token) {
            setIsTokenValid(false); // Nếu không có token, không hợp lệ
            return;
        }

        const validateToken = async () => {
            try {
                const response = await fetch(URL_API_VALIDATE_TOKEN, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: access_token,
                    },
                });

                if (response.ok) {
                    setIsTokenValid(true);
                } else {
                    setIsTokenValid(false);
                }
            } catch (error) {
                console.log("Error validating token", error);
                setIsTokenValid(false);
            }
        };

        validateToken(); // Gọi hàm xác thực token khi component mount
    }, [access_token]); // Chạy lại khi access_token thay đổi

    if (isTokenValid === null) {
        return <div>Loading...</div>;
    }

    // Nếu không hợp lệ, chuyển hướng đến trang đăng nhập
    if (!isTokenValid) {
        fetch(URL_API_REFRESH_TOKEN, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            response.json().then((data) => {
                if (response.ok) {
                    Cookies.set("access_token", data.data.access_token, {
                        expires: 1,
                    });
                } else {
                    return (
                        <Navigate
                            to="/auth/login"
                            state={{ from: location.pathname }}
                            replace
                        />
                    );
                }
            });
        });
    }

    // Nếu hợp lệ, render Outlet để hiển thị các trang con
    return <Outlet />;
};

export default RequireAuth;
