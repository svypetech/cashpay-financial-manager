import StatCard from "../cards/StatsCard";
import TotalUsersCard from "../cards/TotalUsers";
import SystemHealthGauge from "../cards/SystemHealth";
import TransactionsTableDashboard from "../cards/TransactionsTableDashboard";
import UsersTableDashboard from "../cards/UsersTableDashboard";
import useFetchDashboardCards from "@/src/hooks/dashboard/useFetchDashboardCards";
import Error from "../ui/Error";
import useFetchSystemHealth from "@/src/hooks/dashboard/useFetchSystemHealth";
import SystemHealthSkeleton from "../skeletons/SystemHealthSkeleton";

export default function Overview() {
  const { dashboardCards, isLoading, isError } = useFetchDashboardCards();
  

  return (
    <div>
      {/* Stats Cards */}

      {isError ? (
        <Error text="Something went wrong" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-6">
          <StatCard
            icon="/icons/dashboard1.svg"
            label="Users"
            value={dashboardCards.userCount}
            isLoading={isLoading}
          />
          <StatCard
            icon="/icons/dashboard2.svg"
            label="Transactions"
            value={dashboardCards.transactionCount}
            isLoading={isLoading}
          />
          <StatCard
            icon="/icons/dashboard3.svg"
            label="P2P trades"
            value={dashboardCards.tradeCount}
            isLoading={isLoading}
          />
          <StatCard
            icon="/icons/dashboard4.svg"
            label="Card Orders"
            value={dashboardCards.cardCount}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* First Row - Transactions (3 cols) + System Health (1 col) */}
      
        <TransactionsTableDashboard />
      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 h-full">
        <TotalUsersCard />
        <UsersTableDashboard />
      </div>
    </div>
  );
}
