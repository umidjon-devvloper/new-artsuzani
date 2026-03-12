"use client";
import { statistika } from "@/actions/dashboard.actions";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

interface Stats {
  productlength: number;
  categorylength: number;
  orderslength: number;
}

const StatistikaPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await statistika();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-lg bg-white rounded-2xl">
        <CardContent className="p-6 flex flex-col items-center">
          <span className="text-4xl font-bold text-blue-600">
            {stats.productlength}
          </span>
          <p className="text-gray-600">Products</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-white rounded-2xl">
        <CardContent className="p-6 flex flex-col items-center">
          <span className="text-4xl font-bold text-green-600">
            {stats.categorylength}
          </span>
          <p className="text-gray-600">Categories</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg bg-white rounded-2xl">
        <CardContent className="p-6 flex flex-col items-center">
          <span className="text-4xl font-bold text-green-600">
            {stats.orderslength}
          </span>
          <p className="text-gray-600">Orders</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatistikaPage;
