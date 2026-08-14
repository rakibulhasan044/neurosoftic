/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, PackageOpen, CheckCircle, XCircle } from "lucide-react";

export function DashboardCharts({ statusCounts }: { statusCounts: any }) {
  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [data, setData] = useState({
    trendData: [],
    categorySales: [],
    brandSales: [],
    productSales: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/dashboard/charts?period=${period}&year=${year}`, {
          headers: token ? { } : {}
        });
        
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch chart data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChartData();
  }, [period, year]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="space-y-6 mt-8">
      {/* Sales Trend Chart and Pipeline */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Sales Overview</CardTitle>
            <CardDescription>View your sales performance over time</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={(val) => val && setPeriod(val)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            {period !== "yearly" && (
              <Select value={year} onValueChange={(val) => val && setYear(val)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(y => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">Loading chart data...</div>
            ) : data.trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => `৳${value}`}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`৳${value}`, 'Sales']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #eaeaea' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data available for this period.</div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle>Order Status Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Pending Payment</p>
              </div>
              <div className="ml-auto font-medium text-blue-600">{statusCounts['PENDING_PAYMENT'] || 0}</div>
            </div>

            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <PackageOpen className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Processing & Packed</p>
              </div>
              <div className="ml-auto font-medium text-yellow-600">
                {(statusCounts['PROCESSING'] || 0) + (statusCounts['PACKED'] || 0)}
              </div>
            </div>

            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Delivered</p>
              </div>
              <div className="ml-auto font-medium text-green-600">{statusCounts['DELIVERED'] || 0}</div>
            </div>

            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Cancelled</p>
              </div>
              <div className="ml-auto font-medium text-red-600">{statusCounts['CANCELLED'] || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Category and Brand Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Categories by Sales</CardTitle>
            <CardDescription>Highest revenue generating product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">Loading chart data...</div>
              ) : data.categorySales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.categorySales} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#888" opacity={0.2} />
                    <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(value) => `৳${value}`} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} />
                    <Tooltip 
                      formatter={(value: any) => [`৳${value}`, 'Sales']}
                      cursor={{fill: 'transparent'}}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">No data available.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Brands by Sales</CardTitle>
            <CardDescription>Highest revenue generating brands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">Loading chart data...</div>
              ) : data.brandSales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.brandSales} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#888" opacity={0.2} />
                    <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(value) => `৳${value}`} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} />
                    <Tooltip 
                      formatter={(value: any) => [`৳${value}`, 'Sales']}
                      cursor={{fill: 'transparent'}}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">No data available.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Products by Sales</CardTitle>
            <CardDescription>Highest revenue generating products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">Loading chart data...</div>
              ) : (data.productSales && data.productSales.length > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.productSales} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#888" opacity={0.2} />
                    <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(value) => `৳${value}`} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} />
                    <Tooltip 
                      formatter={(value: any) => [`৳${value}`, 'Sales']}
                      cursor={{fill: 'transparent'}}
                    />
                    <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">No data available.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
