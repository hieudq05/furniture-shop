import { Outlet, useLocation } from "react-router-dom";
import NavUser from "../components/NavUser";
import styles from "@/app/style/Home.module.css";
import FooterUser from "@/components/FooterUser";


export default function Layout() {
    const location = useLocation();

    return (
        <div className={styles.home}>
            {location.pathname === "/auth/login" ||
            location.pathname === "/auth/register" ||
            location.pathname.includes("admin") ? null : (
                <NavUser cartItems={null} />
            )}
            <Outlet />
            {location.pathname === "/auth/login" ||
            location.pathname === "/auth/register" ||
            location.pathname.includes("admin") ? null : (
                <FooterUser />
            )}
        </div>
    );
}
