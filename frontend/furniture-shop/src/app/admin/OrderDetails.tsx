"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";

const API_GET_ORDER = "http://localhost:8080/api/order";
const API_UPDATE_ORDER = "http://localhost:8080/api/order_detail/update";

interface OrderDetail {
    id: number;
    productStock: {
        id: number;
        product: {
            id: number;
            name: string;
        };
        productImage: {
            src: string;
            alt: string;
        };
        productSize: {
            sizeName: string;
        };
        productColor: {
            name: string;
        };
        price: number;
    };
    quantity: number;
    status: boolean;
}

interface Order {
    id: number;
    address: string;
    createDate: string;
    orderDetails: OrderDetail[];
}

interface OrderResponse {
    orders: Order[];
    totalElements: number;
    totalPages: number;
}

export default function OrderDetails() {
    const { id } = useParams();
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_GET_ORDER}/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: Cookies.get("access_token") ?? "",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const data = await response.json();
                setOrders(data.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load order details");
            }
        };

        if (id) {
            fetchOrders();
        }
    }, [id]);

    const handleStatusToggle = async (
        orderDetailId: number,
        currentStatus: boolean
    ) => {
        try {
            setLoading(true);
            const response = await fetch(API_UPDATE_ORDER, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: Cookies.get("access_token") ?? "",
                },
                body: JSON.stringify({
                    orderDetailId: orderDetailId,
                    status: !currentStatus,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update order status");
            }

            setOrders((prevOrders) =>
                prevOrders.map((order) => ({
                    ...order,
                    orderDetails: order.orderDetails.map((detail) => {
                        if (detail.id === orderDetailId) {
                            return { ...detail, status: !detail.status };
                        }
                        return detail;
                    }),
                }))
            );
            toast.success("Order status updated successfully");
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");
        } finally {
            setLoading(false);
        }
    };

    if (!orders) {
        return (
            <div className="size-full flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="size-full text-base flex flex-col items-center justify-center gap-2">
                <div className="">Customer has no orders...</div>
                <Link to="/admin/customers" className="font-medium">
                    <Button variant={"outline"}>View Customers</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 w-full mx-auto font-sans">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Order List</h1>
                <Button variant="outline" onClick={() => window.history.back()}>
                    Back
                </Button>
            </div>

            <div className="space-y-8">
                {orders
                    .sort(
                        (a, b) =>
                            new Date(b.createDate).getTime() -
                            new Date(a.createDate).getTime()
                    )
                    .map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl shadow-sm border p-6"
                        >
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">
                                    Order Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">
                                            Order ID
                                        </p>
                                        <p className="font-medium">
                                            {order.id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">
                                            Order Date
                                        </p>
                                        <p className="font-medium">
                                            {new Date(
                                                order.createDate
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-gray-600">
                                            Shipping Address
                                        </p>
                                        <p className="font-medium">
                                            {order.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold">
                                    Order Items
                                </h2>
                                {order.orderDetails
                                    .sort(
                                        (a, b) =>
                                            a.productStock.price -
                                            b.productStock.price
                                    )
                                    .map((detail) => (
                                        <Card key={detail.id} className="p-6">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-1/4">
                                                    <img
                                                        src={
                                                            detail.productStock
                                                                .productImage
                                                                .src
                                                        }
                                                        alt={
                                                            detail.productStock
                                                                .productImage
                                                                .alt
                                                        }
                                                        className="w-full aspect-[3/4] object-cover rounded-lg"
                                                    />
                                                </div>
                                                <div className="md:w-3/4 space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-xl font-semibold">
                                                                {
                                                                    detail
                                                                        .productStock
                                                                        .product
                                                                        .name
                                                                }
                                                            </h3>
                                                            <p className="text-gray-600">
                                                                Size:{" "}
                                                                {
                                                                    detail
                                                                        .productStock
                                                                        .productSize
                                                                        .sizeName
                                                                }
                                                            </p>
                                                            <p className="text-gray-600">
                                                                Color:{" "}
                                                                {
                                                                    detail
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
                                                                    detail
                                                                        .productStock
                                                                        .price *
                                                                    detail.quantity
                                                                ).toFixed(2)}
                                                            </p>
                                                            <p className="text-gray-600">
                                                                Quantity:{" "}
                                                                {
                                                                    detail.quantity
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Separator />
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                checked={
                                                                    detail.status
                                                                }
                                                                onCheckedChange={() => {
                                                                    console.log(
                                                                        detail.id,
                                                                        detail.status
                                                                    );
                                                                    handleStatusToggle(
                                                                        detail.id,
                                                                        detail.status
                                                                    );
                                                                }}
                                                                disabled={
                                                                    loading
                                                                }
                                                            />
                                                            <span
                                                                className={`text-sm font-medium ${
                                                                    detail.status
                                                                        ? "text-green-600"
                                                                        : "text-orange-500"
                                                                }`}
                                                            >
                                                                {detail.status
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

                            <Separator className="my-6" />

                            <div className="flex justify-end">
                                <div className="text-right">
                                    <p className="text-gray-600">
                                        Total Amount
                                    </p>
                                    <p className="text-2xl font-semibold">
                                        $
                                        {order.orderDetails
                                            .reduce(
                                                (sum, detail) =>
                                                    sum +
                                                    detail.productStock.price *
                                                        detail.quantity,
                                                0
                                            )
                                            .toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
