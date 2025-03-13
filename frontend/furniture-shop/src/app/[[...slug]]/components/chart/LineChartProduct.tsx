"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
} from "@/components/ui/chart";
const chartData = [
    { date: "2024-04-01", present: 222, previous_month: 150 },
    { date: "2024-04-02", present: 97, previous_month: 180 },
    { date: "2024-04-03", present: 167, previous_month: 120 },
    { date: "2024-04-04", present: 242, previous_month: 260 },
    { date: "2024-04-05", present: 373, previous_month: 290 },
    { date: "2024-04-06", present: 301, previous_month: 340 },
    { date: "2024-04-07", present: 245, previous_month: 180 },
    { date: "2024-04-08", present: 409, previous_month: 320 },
    { date: "2024-04-09", present: 59, previous_month: 110 },
    { date: "2024-04-10", present: 261, previous_month: 190 },
    { date: "2024-04-11", present: 327, previous_month: 350 },
    { date: "2024-04-12", present: 292, previous_month: 210 },
    { date: "2024-04-13", present: 342, previous_month: 380 },
    { date: "2024-04-14", present: 137, previous_month: 220 },
    { date: "2024-04-15", present: 120, previous_month: 170 },
    { date: "2024-04-16", present: 138, previous_month: 190 },
    { date: "2024-04-17", present: 446, previous_month: 360 },
    { date: "2024-04-18", present: 364, previous_month: 410 },
    { date: "2024-04-19", present: 243, previous_month: 180 },
    { date: "2024-04-20", present: 89, previous_month: 150 },
    { date: "2024-04-21", present: 137, previous_month: 200 },
    { date: "2024-04-22", present: 224, previous_month: 170 },
    { date: "2024-04-23", present: 138, previous_month: 230 },
    { date: "2024-04-24", present: 387, previous_month: 290 },
    { date: "2024-04-25", present: 215, previous_month: 250 },
    { date: "2024-04-26", present: 75, previous_month: 130 },
    { date: "2024-04-27", present: 383, previous_month: 420 },
    { date: "2024-04-28", present: 122, previous_month: 180 },
    { date: "2024-04-29", present: 315, previous_month: 240 },
    { date: "2024-04-30", present: 454, previous_month: 380 },
    { date: "2024-05-01", present: 165, previous_month: 220 },
];

const chartConfig = {
    views: {
        label: "Saled",
    },
    present: {
        label: "Present Month",
        color: "hsl(var(--chart-1))",
    },
    previous_month: {
        label: "Previous Month",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function LineChartProduct() {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("present");

    const total = React.useMemo(
        () => ({
            present: chartData.reduce((acc, curr) => acc + curr.present, 0),
            previous_month: chartData.reduce(
                (acc, curr) => acc + curr.previous_month,
                0
            ),
        }),
        []
    );

    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Line Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing total visitors for the last 3 months
                    </CardDescription>
                </div>
                <div className="flex">
                    {["present", "previous_month"].map((key) => {
                        const chart = key as keyof typeof chartConfig;
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {total[
                                        key as keyof typeof total
                                    ].toLocaleString()}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        });
                                    }}
                                />
                            }
                        />
                        <Line
                            dataKey={activeChart}
                            type="monotone"
                            stroke={`var(--color-${activeChart})`}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
