"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/utils";

interface CommissionChartCopyProps {
  className?: string;
}

export function CommissionChartCopy({ className }: CommissionChartCopyProps) {
  const { trips } = useAppSelector((state) => state.user);
  const [timeRange, setTimeRange] = React.useState("365d");

  // Обрабатываем данные из Redux
  const chartData = React.useMemo(() => {
    const dataMap = new Map<string, { earnings: number; commission: number }>();

    if (!trips || trips.length === 0) {
      return [];
    }

    trips.forEach((trip) => {
      if (!trip.bookingDate) {
        return;
      }

      const bookingDate = new Date(trip.bookingDate);

      if (isNaN(bookingDate.getTime())) {
        return; // Пропускаем невалидные даты
      }

      const date = bookingDate.toISOString().split("T")[0];
      const commission = trip.commission || 0;

      if (!dataMap.has(date)) {
        dataMap.set(date, { earnings: 0, commission: 0 });
      }

      const entry = dataMap.get(date)!;

      if (!trip.isCanceled) {
        entry.commission += commission;
      }

      if (trip.isCompleted) {
        entry.earnings += commission;
      }
    });

    return Array.from(dataMap.entries())
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        if (isNaN(dateA) || isNaN(dateB)) {
          return 0;
        }
        return dateA - dateB;
      });
  }, [trips]);

  const chartConfig = {
    earnings: {
      label: "Earnings",
      color: "var(--chart-2)",
    },
    commission: {
      label: "Commission",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date();
    const startDate = new Date(referenceDate);
    const daysToSubtract = timeRange === "90d" ? 90 : timeRange === "30d" ? 30 : 365;

    startDate.setDate(referenceDate.getDate() - daysToSubtract);

    return chartData.filter((item) => {
      const itemDate = new Date(item.date).getTime();
      return itemDate >= startDate.getTime();
    });
  }, [chartData, timeRange]);

  return (
    <Card className={cn("pt-0", className)}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-border py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Commission Over Time</CardTitle>
          <CardDescription>Showing commission and earnings by day</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="365d" className="rounded-lg">
              Last 1 year
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-earnings)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-earnings)" stopOpacity={0.1} />
              </linearGradient>

              <linearGradient id="fillCommission" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-commission)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-commission)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--table-border)" />
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5}
              orientation={"right"}
              allowDataOverflow={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="earnings"
              type="monotone"
              fill="url(#fillEarnings)"
              stroke="var(--chart-2)"
              strokeWidth={2}
            />

            <Area
              dataKey="commission"
              type="monotone"
              fill="url(#fillCommission)"
              stroke="var(--chart-3)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
