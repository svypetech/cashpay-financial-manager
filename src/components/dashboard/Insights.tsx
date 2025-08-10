import MostTradedCryptocurrencies from "../cards/MostTradedCryptoCurrencies";
import TransactionFrequency from "../cards/TransactionFrequency";
import NewUsers from "../cards/NewUsersTable";
import UserInsights from "../cards/UserInsights";
import UserInsightsSkeleton from "../skeletons/UserInsightsSkeleton";
import Error from "../ui/Error";
import useFetchUserInsights from "@/src/hooks/dashboard/useFetchUserInsights";
import useFetchMostTradedCoins from "@/src/hooks/dashboard/useFetchMostTradedCoins";
import useFetchTransactionFrequency from "@/src/hooks/dashboard/useFetchTransactionFrequency";
import TransactionFrequencySkeleton from "../skeletons/TransactionFrequencySkeleton";

export default function UserInsightsPage() {
  const { userInsights, isLoading, isError } = useFetchUserInsights();
  const {
    mostTradedCoins,
    isLoading: isLoadingCoins,
    isError: isCoinsError,
  } = useFetchMostTradedCoins();
  const {
    transactionFrequencyData,
    isLoading: isLoadingTxFrequency,
    isError: isTxFrequencyError,
  } = useFetchTransactionFrequency();
  return (
    <main className="">
      {/* Top Row - Cryptocurrencies and Transaction Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <MostTradedCryptocurrencies
            coins={mostTradedCoins}
            isLoading={isLoadingCoins}
            isError={isCoinsError}
          />
        </div>
        <div className="lg:col-span-2">
          {isLoadingTxFrequency ? (
            <TransactionFrequencySkeleton />
          ) : isTxFrequencyError ? (
            <Error text="Failed to load transaction frequency data" />
          ) : transactionFrequencyData ? (
            <TransactionFrequency data={transactionFrequencyData} />
          ) : (
            <Error text="No transaction frequency data available" />
          )}
        </div>
      </div>

      {/* Bottom Row - New Users and User Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewUsers />

        <div>
          {isLoading ? (
            <UserInsightsSkeleton />
          ) : isError ? (
            <Error text="Something went wrong" />
          ) : (
            <UserInsights userInsights={userInsights} />
          )}
        </div>
      </div>
    </main>
  );
}
