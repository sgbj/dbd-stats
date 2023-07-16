import { prisma } from "../lib/prisma";
import { DataTable } from "@/components/data-table/data-table";

export default async function Home() {
  const stats: any[] = await prisma.stat.findMany();
  const userStats: any[] = await prisma.userStats.findMany();

  return (
    <div className="p-4">
      <DataTable stats={stats} userStats={userStats} />
    </div>
  );
}
