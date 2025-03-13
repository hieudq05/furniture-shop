"use client";

import * as React from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart";

interface MonthlyRevenue {
    total: number;
    month: string;
    year: number;
}

const chartConfig = {
    views: {
        label: "Total",
    },
} satisfies ChartConfig;

export function OverviewChart({ dataList }: { dataList: MonthlyRevenue[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Monthly revenue overview</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <ChartContainer config={chartConfig}>
                        <LineChart data={dataList}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey={(data) => {
                                    return new Date(
                                        data.year,
                                        data.month - 1
                                    ).toLocaleString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    });
                                }}
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                            />
                            <YAxis
                                dataKey={"total"}
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[170px]"
                                        nameKey="views"
                                    />
                                }
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#0bc517"
                                strokeWidth={2}
                                activeDot={{
                                    r: 8,
                                }}
                            />
                        </LineChart>
                    </ChartContainer>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
