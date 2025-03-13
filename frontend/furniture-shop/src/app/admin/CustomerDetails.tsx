"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Customer } from "./ListCustomer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Cookies from "js-cookie";

const API_GET_CUSTOMER = "http://localhost:8080/api/customer";
const API_UPDATE_CUSTOMER = "http://localhost:8080/api/customer/update";

export default function CustomerDetails() {
    const { id } = useParams();
    const [customer, setCustomer] = useState<Customer>();
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await fetch(`${API_GET_CUSTOMER}/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: Cookies.get("access_token") ?? "",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch customer");
                }
                const data = await response.json();
                setCustomer(data.data);
                setIsActive(data.data.isActive);
            } catch (error) {
                console.error("Error fetching customer:", error);
                toast.error("Failed to load customer details");
            }
        };

        if (id) {
            fetchCustomer();
        }
    }, [id]);

    const handleActiveToggle = async () => {
        try {
            const response = await fetch(API_UPDATE_CUSTOMER, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: Cookies.get("access_token") ?? "",
                },
                body: JSON.stringify({
                    id: customer?.id,
                    isActive: !isActive,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update customer status");
            }

            setIsActive(!isActive);
            toast.success("Customer status updated successfully");
        } catch (error) {
            console.error("Error updating customer status:", error);
            toast.error("Failed to update customer status");
        }
    };

    if (!customer) {
        return (
            <div className=" size-full flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-8 w-full mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Customer Details</h1>
                <Button variant="outline" onClick={() => window.history.back()}>
                    Back
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6 font-sans">
                <div className="flex items-center gap-6 mb-8">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={customer.image} />
                        <AvatarFallback className="text-2xl">
                            {customer.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">
                            {customer.fullName}
                        </h2>
                        <p className="text-gray-500">{customer.email}</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 mb-8 sm:text-start text-center">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Phone Number
                        </h3>
                        <p className="text-xl font-medium">{customer.phone}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Address
                        </h3>
                        <p className="text-xl font-medium">
                            {customer.address}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Created At
                        </h3>
                        <p className="text-xl font-medium">
                            {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">
                            Account Status
                        </h3>
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <Switch
                                checked={isActive}
                                onCheckedChange={handleActiveToggle}
                            />
                            <span
                                className={`text-sm font-medium ${
                                    isActive ? "text-green-600" : "text-red-600"
                                }`}
                            >
                                {isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
