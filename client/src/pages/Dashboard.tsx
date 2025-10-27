import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMe } from "@/redux/features/auth/authSlice";
import { fetchTrips, fetchUsers } from "../redux/features/users/userSlice";
import { fetchClicks } from "../redux/features/clicks/clicksSlice";
import {
  selectUserTrips,
  selectUserLastThreeTrips,
  selectUserTotalRevenue,
  selectUserTripsCount,
  selectTripsStatus,
  selectTripsError,
  selectUserById,
} from "@/redux/features/users/userSelectors";
import {
  selectAllClicks,
  selectClicksStatus,
  selectClicksError,
  selectClicksCount,
  selectClicksByType,
  selectClicksByDevice,
  selectClicksAfterDate,
  selectUniqueIpCount,
} from "@/redux/features/clicks/clicksSelectors";
import { formatCurrency, formatDate } from "@/components/utils/formatters";
import { getOrderStatusClasses } from "@/components/utils/tripStatus";
import { ProgressBar } from "../components/levelProgressBar";
import { CommissionChart } from "../components/commissionChart";
import { CommissionChartCopy } from "../components/commissionChart-copy";
import { AnimatedNumber } from "../components/utils/AnimatedNumber";

import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StackedBarChartRoundedIcon from "@mui/icons-material/StackedBarChartRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import { CircularProgress } from "@mui/material";

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.auth.user);
  const lastThreeTrips = useAppSelector(selectUserLastThreeTrips);
  const totalRevenue = useAppSelector(selectUserTotalRevenue);
  const tripsCount = useAppSelector(selectUserTripsCount);
  const tripsStatus = useAppSelector(selectTripsStatus);
  const tripsError = useAppSelector(selectTripsError);
  const commission = currentUser?.total_commission;
  const userName = currentUser?.first_name;
  const userLevel = currentUser?.level;

  const status = useAppSelector(selectClicksStatus);
  const error = useAppSelector(selectClicksError);
  const totalClicks = useAppSelector(selectClicksCount);

  const formatNumberWithCommas = (number: number) => {
    return new Intl.NumberFormat("en-US").format(number);
  };

  const isLoading = tripsStatus === "loading" || status === "loading";
  const isFailed = tripsStatus === "failed" || status === "failed";

  useEffect(() => {
    if (!currentUser?.id) return;

    dispatch(getMe());
    dispatch(fetchTrips());
    // dispatch(fetchClicks(currentUser?.id));
  }, [currentUser?.id]);

  const getNextLevel = (level?: string): string => {
    switch (level) {
      case "Bronze":
        return "Silver";
      case "Silver":
      case "Gold":
        return "Gold";
      default:
        return "-";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error: {tripsError || error}</p>
      </div>
    );
  }

  if (!currentUser && !isLoading) {
    return <p className="text-center mt-4">User not authenticated.</p>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-3 flex-wrap gap-4 2xl:w-[1140px]">
        <div className="flex flex-col col-span-4 lg:col-span-2 flex-1 flex-grow gap-6 p-4 rounded-2xl ">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 max-[600px]:grid-cols-2 gap-3 xl:gap-6 w-full flex-grow">
              <div className="flex flex-col w-full p-2 xl:p-4 rounded-xl text-gray-800 dark:text-gray-100 bg-zinc-200 dark:bg-zinc-900">
                <StackedBarChartRoundedIcon className="text-accentBlue" />
                <b className="lg:text-xl xl:text-2xl">
                  <AnimatedNumber key={tripsCount} value={tripsCount || 0} />
                </b>
                <span className="text-sm">Total Order</span>
              </div>
              <div className="flex flex-col w-full  p-2 xl:p-4 rounded-xl text-gray-800 dark:text-gray-100 bg-zinc-200 dark:bg-zinc-900">
                <CurrencyExchangeRoundedIcon className="text-accentPink" />
                <b className="lg:text-xl xl:text-2xl">
                  <AnimatedNumber
                    key={totalRevenue}
                    value={totalRevenue || 0}
                    formatValue={(n) => formatNumberWithCommas(n)}
                    suffix=" €"
                    decimals={0}
                  />
                </b>
                <span className="text-sm">Total Sales</span>
              </div>
              <div className="flex flex-col w-full  p-2 xl:p-4 rounded-xl text-gray-800 dark:text-gray-100 bg-zinc-200 dark:bg-zinc-900">
                <ShoppingCartOutlinedIcon className="text-accentAqua" />
                <b className="lg:text-xl xl:text-2xl">
                  <AnimatedNumber
                    key={commission}
                    value={commission || 0}
                    formatValue={(n) => formatNumberWithCommas(n)}
                    suffix=" €"
                    decimals={0}
                  />
                </b>
                <span className="text-sm">Total commission</span>
              </div>
              <div className="flex flex-col w-full  p-2 xl:p-4 rounded-xl text-gray-800 dark:text-gray-100 bg-zinc-200 dark:bg-zinc-900">
                <AccountTreeRoundedIcon className="text-accentOrange" />
                <b className="lg:text-xl xl:text-2xl">
                  <AnimatedNumber
                    key={totalClicks}
                    value={totalClicks}
                    formatValue={(n) => formatNumberWithCommas(n)}
                  />
                </b>
                <span className="text-sm">Total Clicks</span>
              </div>
            </div>
            <div className="overflow-scroll text-nowrap">
              <table className="w-full text-xs text-left text-gray-700 dark:text-gray-200 mt-2">
                <thead className="text-xs text-gray-600 dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-4 py-2">
                      ID
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Booking Date
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Amount
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lastThreeTrips?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-4 text-gray-500"
                      >
                        No recent trips found.
                      </td>
                    </tr>
                  ) : (
                    lastThreeTrips?.map((trip) => (
                      <tr
                        key={trip.id}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="px-4 py-2">{trip.id}</td>
                        <td className="px-4 py-2">
                          {formatDate(trip.booking_date)}
                        </td>
                        <td className="px-4 py-2">
                          {formatCurrency(trip.total_price)}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`rounded-lg px-4 py-0.5 capitalize ${getOrderStatusClasses(
                              trip.order_status
                            )}`}
                          >
                            {trip.order_status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-[600px]:col-span-4 max-[600px]:-order-1 max-md:order-2 col-span-2 lg:col-span-1 gap-1 w-full h-full p-4 rounded-2xl dark:text-white bg-zinc-200 dark:bg-zinc-900">
          <h2 className="text-md text-gray-400">Affiliate Manager</h2>
          <p className="font-bold text-md">Nadine Wilke</p>
          <div className="rounded p-4 ">
            <p className="text-sm">
              Hello and welcome to our affiliate program.<br></br>
              I&apos;m your affiliate manager, and I&apos;m here for you if you
              have any questions or problems related to our affiliate program.
            </p>
            <p className="text-sm">
              I wish you all success in promoting our products, and a profitable
              partnership for both you and us.
            </p>
          </div>
          <div>
            <h3 className="text-md font-semibold text-gray-400">
              Contact Email:
            </h3>
            <a
              href="mailto:nadine@jinn-travel.com"
              className="hover:text-accent transition-colors"
            >
              nadine@jinn-travel.com
            </a>
          </div>
        </div>
        <div className="flex justify-between relative flex-col max-[600px]:col-span-4 max-[600px]:-order-2 col-span-2 lg:col-span-1 w-full h-full p-4 xl:p-8 rounded-2xl bg-zinc-200 dark:bg-zinc-900">
          <dl className="flex justify-between">
            <dt className="font-bold text-xl">{userLevel}</dt>
            <dd className="text-sm">
              {userName} - ID: {currentUser?.id}
            </dd>
          </dl>
          <ProgressBar />
          <span className="text-sm px-4 py-2 my-2 rounded-xl border border-gray-400">
            Next level: {getNextLevel(userLevel?.toString())}
          </span>
        </div>
        <div className="flex flex-col max-md:row-start-3 col-span-4 lg:col-span-2 gap-6 w-full bg-zinc-200 dark:bg-zinc-900 rounded-2xl ">
          <CommissionChartCopy />
        </div>
      </div>
    </div>
  );
};
