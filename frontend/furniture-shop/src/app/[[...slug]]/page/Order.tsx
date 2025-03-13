"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CornerDownRight } from "lucide-react";
import { Product } from "../../admin/ListProduct";
import { ProductStock } from "./DetailsProduct";

const URL_GET_ORDER_API = "http://localhost:8080/api/order/me";

interface OrderItem {
    id: number;
    address: string;
    createDate: string;
    orderDetails: OrderDetails[];
}

interface OrderDetails {
    id: number;
    product: Product;
    productStock: ProductStock;
    quantity: number;
    status: boolean;
}

async function getMyOrders(currentPage: number, token: string) {
    try {
        const response = await fetch(
            URL_GET_ORDER_API + "?page=" + currentPage,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                credentials: "include",
            }
        );
        if (!response.ok) {
            console.error("Failed to get orders");
            return;
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Failed to get orders", error);
    }
}

function Order() {
    const [orders, setOrders] = useState<OrderItem[]>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [totalOrder, setTotalOrder] = useState();
    const token = Cookies.get("access_token");
    const [diffProductInOrder, setDiffProductInOrder] =
        useState<Set<Product>>();

    useEffect(() => {
        async function fetchOrders() {
            const orders = await getMyOrders(currentPage, token ?? "");
            setOrders(orders?.orders);
            setTotalOrder(orders?.totalElements);
            setTotalPage(orders?.totalPages);
            setDiffProductInOrder(
                new Set<Product>(
                    orders?.orders
                        .map((order: any) => order.orderDetails)
                        .flat()
                        .map(
                            (orderDetail: any) =>
                                orderDetail.productStock.product
                        )
                )
            );
        }
        fetchOrders();
    }, [currentPage, token]);

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-9xl font-semibold mb-6">My Orders</h1>
            <div className="mb-6 text-base">
                You have ordered {totalOrder} item(s).
            </div>
            <div className="space-y-7 font-sans">
                {orders?.map((order) => (
                    <div
                        key={order.id}
                        className="bg-gray-50 p-6 rounded-2xl border border-gray-300"
                    >
                        <div className="flex gap-3">
                            <CornerDownRight className="text-gray-500" />
                            <div className="">
                                <p className="text-base font-medium">
                                    Order Date:{" "}
                                    {(() => {
                                        const orderDate = new Date(
                                            order.createDate
                                        );
                                        const today = new Date();
                                        const yesterday = new Date();
                                        yesterday.setDate(today.getDate() - 1);

                                        const daysDiff = Math.floor(
                                            today.getDate() -
                                                orderDate.getDate()
                                        );

                                        if (
                                            orderDate.toDateString() ===
                                            today.toDateString()
                                        ) {
                                            return (
                                                "Today at " +
                                                orderDate.toLocaleTimeString()
                                            );
                                        } else if (
                                            orderDate.toDateString() ===
                                            yesterday.toDateString()
                                        ) {
                                            return (
                                                "Yesterday at " +
                                                orderDate.toLocaleTimeString()
                                            );
                                        } else if (
                                            daysDiff >= 2 &&
                                            daysDiff <= 7
                                        ) {
                                            return `${daysDiff} days ago at ${orderDate.toLocaleTimeString()}`;
                                        } else {
                                            console.log(daysDiff);
                                            return orderDate.toLocaleString();
                                        }
                                    })()}
                                </p>
                                <p className="text-sm text-gray-500 font-medium mb-4">
                                    Shipping Address: {order.address}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {order.orderDetails
                                ?.sort((a, b) => {
                                    return a.id - b.id;
                                })
                                .map((orderDetail) => (
                                    <Card
                                        key={orderDetail.id}
                                        className="p-6 shadow-sm"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="md:w-1/4">
                                                <img
                                                    src={
                                                        orderDetail.productStock
                                                            .productImage.src
                                                    }
                                                    alt={
                                                        orderDetail.productStock
                                                            .productImage.alt
                                                    }
                                                    className="w-full aspect-[3/4]  object-cover rounded-lg"
                                                />
                                            </div>
                                            <div className="md:w-3/4 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h2 className="text-xl font-semibold">
                                                            {Array.from(
                                                                diffProductInOrder ||
                                                                    []
                                                            ).find(
                                                                (product) =>
                                                                    Number(
                                                                        product.id
                                                                    ) ===
                                                                    Number(
                                                                        orderDetail
                                                                            .productStock
                                                                            .product
                                                                            .id
                                                                    )
                                                            )?.name ||
                                                                orderDetail
                                                                    .productStock
                                                                    .product
                                                                    .name}
                                                        </h2>
                                                        <p className="text-gray-600">
                                                            Size:{" "}
                                                            {
                                                                orderDetail
                                                                    .productStock
                                                                    .productSize
                                                                    .sizeName
                                                            }
                                                        </p>
                                                        <p className="text-gray-600">
                                                            Color:{" "}
                                                            {
                                                                orderDetail
                                                                    .productStock
                                                                    .productColor
                                                                    .name
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold">
                                                            $
                                                            {(
                                                                orderDetail
                                                                    .productStock
                                                                    .price *
                                                                orderDetail.quantity
                                                            ).toFixed(2)}
                                                        </p>
                                                        <p className="text-gray-600">
                                                            Quantity:{" "}
                                                            {
                                                                orderDetail.quantity
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={
                                                                "inline-block w-2 h-2 rounded-full " +
                                                                (orderDetail.status
                                                                    ? "bg-green-500"
                                                                    : "bg-orange-500")
                                                            }
                                                        ></span>
                                                        <span className="text-gray-700">
                                                            {orderDetail.status
                                                                ? "Delivered"
                                                                : "Shipping"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Order;
