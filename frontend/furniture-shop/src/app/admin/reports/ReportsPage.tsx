"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LineChart, BarChart } from "lucide-react";
import { OverviewChart } from "@/components/reports/overview-chart";
import Cookies from "js-cookie";
import { data } from "react-router-dom";

const URL_API = "http://localhost:8080/api/";

export default function ReportsPage() {
    const [selectedTab, setSelectedTab] = React.useState(
        location.href.substring(
            location.href.indexOf("?tab=") + 5,
            location.href.length
        )
    );
    const [totalPriceCurrentMonth, setTotalPriceCurrentMonth] = React.useState({
        now: Number,
        previous: Number,
    });
    const [countSale, setCountSale] = React.useState({
        now: Number,
        previous: Number,
    });
    const [totalSaleActive, setTotalSaleActive] = React.useState({
        now: Number,
        previous: Number,
    });
    const [avgPrice, setAvgPrive] = React.useState({
        now: Number,
        previous: Number,
    });
    const [listPrices, setListPrices] = React.useState();
    React.useEffect(() => {
        // Fetch total price current month
        fetch(`${URL_API}order_detail/total_price`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: Cookies.get("access_token") ?? "",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setTotalPriceCurrentMonth({
                    now: data.data.now,
                    previous: data.data.previous,
                });
            })
            .catch((error) => console.error("Error:", error));

        // Fetch count sale current month
        fetch(`${URL_API}order_detail/count_sale`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: Cookies.get("access_token") ?? "",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCountSale({
                    now: data.data.now,
                    previous: data.data.previous,
                });
            });

        // Fetch total sale active
        fetch(`${URL_API}order_detail/count_sale_active`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: Cookies.get("access_token") ?? "",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setTotalSaleActive({
                    now: data.data.now,
                    previous: data.data.previous,
                });
            });

        // Fetch average price
        fetch(`${URL_API}order_detail/avg_price`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: Cookies.get("access_token") ?? "",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setAvgPrive({
                    now: data.data.now,
                    previous: data.data.previous,
                });
            });

        // Fetch list prices
        fetch(`${URL_API}order_detail/prices_in_12_months`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: Cookies.get("access_token") ?? "",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setListPrices(data.data);
                console.log(data.data);
            });
    }, []);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
            </div>
            <Tabs
                defaultValue={
                    location.href.indexOf("?tab=") === -1
                        ? "sales"
                        : selectedTab
                }
                className="space-y-4"
            >
                <TabsList>
                    <TabsTrigger
                        value="sales"
                        className="flex items-center gap-2"
                    >
                        <LineChart className="h-4 w-4" />
                        Sales Report
                    </TabsTrigger>
                    {/* <TabsTrigger
                        value="users"
                        className="flex items-center gap-2"
                    >
                        <BarChart className="h-4 w-4" />
                        User Report
                    </TabsTrigger>
                    <TabsTrigger
                        value="products"
                        className="flex items-center gap-2"
                    >
                        <BarChart className="h-4 w-4" />
                        Product Report
                    </TabsTrigger> */}
                </TabsList>
                <TabsContent value="sales" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Revenue
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Number(
                                        totalPriceCurrentMonth.now
                                    )?.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {Math.round(
                                        ((totalPriceCurrentMonth.now -
                                            totalPriceCurrentMonth.previous) /
                                            totalPriceCurrentMonth.previous) *
                                            100
                                    )}
                                    % from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Sales
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    +{countSale.now}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {Math.round(
                                        ((countSale.now - countSale.previous) /
                                            countSale.previous) *
                                            100
                                    )}
                                    % from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    +{totalSaleActive.now}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {((totalSaleActive.now -
                                        totalSaleActive.previous) /
                                        totalSaleActive.previous) *
                                        100}
                                    % from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Average Order Value
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Number(avgPrice.now).toLocaleString(
                                        "en-US",
                                        {
                                            style: "currency",
                                            currency: "USD",
                                        }
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {Number(
                                        Math.round(
                                            avgPrice.now - avgPrice.previous
                                        )
                                    ).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    }) + " "}
                                    from last month
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <OverviewChart dataList={listPrices} />
                </TabsContent>
                <TabsContent value="users" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">2,389</div>
                                <p className="text-xs text-muted-foreground">
                                    +180 new users this month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,203</div>
                                <p className="text-xs text-muted-foreground">
                                    +10% from last week
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Premium Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">389</div>
                                <p className="text-xs text-muted-foreground">
                                    16.3% of total users
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Avg. Session Duration
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">24m</div>
                                <p className="text-xs text-muted-foreground">
                                    +2m since last month
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <OverviewChart data={listPrices} />
                </TabsContent>
                <TabsContent value="products" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Products
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,234</div>
                                <p className="text-xs text-muted-foreground">
                                    +12 new this month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Top Selling
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    Modern Sofa
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    342 units sold
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Low Stock
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">23</div>
                                <p className="text-xs text-muted-foreground">
                                    Products need restock
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Avg. Product Rating
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">4.5</div>
                                <p className="text-xs text-muted-foreground">
                                    Based on 2.3k reviews
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <OverviewChart />
                </TabsContent>
            </Tabs>
        </div>
    );
}
