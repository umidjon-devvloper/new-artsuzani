import React from "react";
import StatistikaPage from "../_components/dashboard-statictika";
import { auth } from "@clerk/nextjs/server";
import { getRole } from "@/actions/user.actions";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const { userId } = await auth();
  const user = await getRole(userId!);
  if (!user?.isAdmin) return redirect("/");
  return (
    <div>
      <StatistikaPage />
    </div>
  );
};

export default Dashboard;
