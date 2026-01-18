"use client";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
    clicks: {
        label: "clicks",
        color: "var(--chart-1)",
    },
    forms: {
        label: "forms",
        color: "var(--chart-4)",
    },
} satisfies ChartConfig;

const chartData = [
    { month: "January", clicks: 32, forms: 12 },
    { month: "February", clicks: 11, forms: 3 },
    { month: "March", clicks: 442, forms: 40 },
    { month: "April", clicks: 543, forms: 52 },
    { month: "May", clicks: 548, forms: 51 },
    { month: "June", clicks: 123, forms: 52 },
    { month: "July", clicks: 231, forms: 90 },
    { month: "August", clicks: 593, forms: 212 },
    { month: "September", clicks: 239, forms: 11 },
    { month: "October", clicks: 1000, forms: 342 },
    { month: "November", clicks: 3493, forms: 1923 },
    { month: "December", clicks: 234, forms: 32 },
];

const AppBarChart = () => {
    return (
        <div className="">
            <h1 className="text-lg font-medium mb-6">forms & clicks</h1>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="clicks" fill="var(--color-onetime)" radius={4} />
                    <Bar dataKey="forms" fill="var(--color-abonement)" radius={4} />
                </BarChart>
            </ChartContainer>
        </div>
    );
};

export default AppBarChart;