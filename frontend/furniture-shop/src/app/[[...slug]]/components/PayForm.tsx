import { Button } from "@/components/ui/button";
import { ProfileProps } from "../page/Profile";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { ProductInCart } from "../page/DetailsProduct";
import { toast } from "sonner";

const API_GET_PROFILE_URL = "http://localhost:8080/api/customer/me";
const API_CREATE_ORDER_URL = "http://localhost:8080/api/order/me";

export function PaymentForm() {
    const [myInfo, setMyInfo] = useState<ProfileProps>({} as ProfileProps);
    const [loading, setLoading] = useState(false);

    const fetchProfile = async () => {
        const token = Cookies.get("access_token");
        if (!token) {
            console.error("Token không tồn tại, vui lòng đăng nhập lại.");
            return;
        }

        try {
            const response = await fetch(API_GET_PROFILE_URL, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
                credentials: "include",
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Lỗi ${response.status}: ${errorMessage}`);
            }

            const data = await response.json();
            setMyInfo(data.data);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin hồ sơ:", error.message);
        }
    };

    const fetchCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = Cookies.get("access_token");
        const orderList = JSON.parse(
            localStorage.getItem("cart") || "[]"
        ) as ProductInCart[];
        try {
            const response = await fetch(API_CREATE_ORDER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ?? "",
                },
                body: JSON.stringify({
                    customerId: myInfo.id,
                    orderDetails: orderList.map((order) => ({
                        productStockId: order.productSelected.id,
                        quantity: order.quantity,
                    })),
                }),
            });
            if (!response.ok) {
                toast.error("Error when create order");
                return;
            }
            const data = await response.json();
            toast.success("Create order successfully");
            localStorage.removeItem("cart");
            window.location.href = `/orders`;
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <form
            className="h-fit w-full p-8 font-sans"
            onSubmit={fetchCreateOrder}
        >
            <div className="">
                <div className="text-4xl font-medium">Contact information</div>
                <div className="text-sm font-medium text-gray-500 mt-10">
                    <span className="text-destructive font-medium">* </span>
                    Your information will be used to contact you about your
                    order. If you want to change your shipping information,
                    please change your information in your account.
                    <Link to="/profile" className="ms-2 underline text-black">
                        Change your profile
                    </Link>
                </div>
                <div className="mt-6 flex flex-col gap-4 text-sm">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="userMail" className="font-medium">
                            Email address
                        </label>
                        <input
                            type="text"
                            required
                            className="rounded-lg px-3 h-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700"
                            id="userMail"
                            readOnly
                            value={myInfo.email}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="userNumber" className="font-medium">
                            Phone number
                        </label>
                        <input
                            type="text"
                            required
                            className="rounded-lg px-3 h-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700"
                            id="userNumber"
                            readOnly
                            value={myInfo.phone}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <div className="text-4xl font-medium">Shipping address</div>
                <div className="flex flex-col gap-4 mt-6 text-sm">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="userAddress" className="font-medium">
                            Address
                        </label>
                        <input
                            type="text"
                            required
                            className="rounded-lg px-3 h-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700"
                            id="userAddress"
                            readOnly
                            value={myInfo.address}
                        />
                    </div>
                </div>
            </div>
            <hr className="mt-10" />
            <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                    You won't be charged until the next step.
                </div>
                <Button
                    type="submit"
                    className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700"
                >
                    Continue
                </Button>
            </div>
        </form>
    );
}
