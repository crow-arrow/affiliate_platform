import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrips, fetchUsers } from "../redux/features/users/userSlice";
import { fetchClicks } from "../redux/features/clicks/clicksSlice";
import { ProgressBar } from "../components/levelProgressBar";
import { CommissionChart } from "../components/commissionChart";
import { AnimatedNumber } from "../components/utils/AnimatedNumber";

import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StackedBarChartRoundedIcon from "@mui/icons-material/StackedBarChartRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import { CircularProgress } from "@mui/material";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dispatch(fetchTrips()),
      dispatch(fetchClicks()),
      dispatch(fetchUsers()),
    ]).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const currentUser = useSelector((state) => state.auth.user);
  const tripsCount = currentUser?.booked_trips_count;
  const commission = currentUser?.total_commission;
  const userName = currentUser.first_name;
  const userLevel = currentUser.level;

  const { trips } = useSelector((state) => state.user);

  const { clicks } = useSelector((state) => state.clicks);
  const clicksNumber = clicks.length;

  const lastThreeTrips = trips
    ?.slice()
    .sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date))
    .slice(0, 3)
    .reverse();

  const formatNumberWithCommas = (number) => {
    return new Intl.NumberFormat("en-US").format(number);
  };

  const totalRevenue = Array.isArray(trips)
    ? trips.reduce((sum, order) => {
        const price = parseFloat(order?.total_price);
        return sum + (isNaN(price) ? 0 : price);
      }, 0)
    : 0;

  // const formatedTotalRevenue = formatNumberWithK(totalRevenue)
  // const formatedTotalCommission = formatNumberWithK(commission)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-3 flex-wrap gap-4 2xl:w-[1140px]">
        <div className="flex flex-col col-span-4 lg:col-span-2 flex-1 flex-grow gap-6 p-4 rounded-2xl bg-white dark:bg-secondary">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 max-[600px]:grid-cols-2 gap-3 xl:gap-6 w-full flex-grow">
              <div className="flex flex-col w-full bg-primaryLite dark:bg-primary p-2 xl:p-4 rounded-xl text-gray-800 dark:text-gray-100">
                <StackedBarChartRoundedIcon className="text-accentBlue" />
                <b className="lg:text-xl xl:text-2xl">
                  <AnimatedNumber value={tripsCount || 0} />
                </b>
                <span className="text-sm">Total Order</span>
              </div>
              <div className="flex flex-col w-full bg-primaryLite dark:bg-primary p-2 xl:p-4 rounded-xl text-gray-800 dark:text-gray-100">
                <CurrencyExchangeRoundedIcon className="text-accentPink" />
                <b className="lg:text-xl xl:text-2xl">
                  <AnimatedNumber
                    value={totalRevenue || 0}
                    formatValue={(n) => formatNumberWithCommas(n)}
                    suffix=" €"
                    decimals={0}
                  />
                </b>
                <span className="text-sm">Total Sales</span>
              </div>
              <div className="flex flex-col w-full bg-primaryLite dark:bg-primary p-2 xl:p-4 rounded-xl text-gray-800 dark:text-gray-100">
                <ShoppingCartOutlinedIcon className="text-accentAqua" />
                <b className="lg:text-xl xl:text-2xl">
                  <AnimatedNumber
                    value={commission || 0}
                    formatValue={(n) => formatNumberWithCommas(n)}
                    suffix=" €"
                    decimals={0}
                  />
                </b>
                <span className="text-sm">Total commission</span>
              </div>
              <div className="flex flex-col w-full bg-primaryLite dark:bg-primary p-2 xl:p-4 rounded-xl text-gray-800 dark:text-gray-100">
                <AccountTreeRoundedIcon className="text-accentOrange" />
                <b className="lg:text-xl xl:text-2xl">
                  <AnimatedNumber
                    value={clicksNumber}
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
                  {lastThreeTrips?.map((trip) => (
                    <tr
                      key={trip.id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="px-4 py-2">{trip.id}</td>
                      <td className="px-4 py-2">
                        {new Date(trip.booking_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {parseFloat(trip.total_price).toFixed(2)}€
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`
                            rounded-lg px-4 py-0.5 capitalize text-center justify-start
                            ${
                              trip.order_status === "cancel"
                                ? "bg-accentPink/30 text-accentPink"
                                : trip.order_status === "rejected"
                                ? "bg-gray-300/30 text-gray-300"
                                : trip.order_status === "pending"
                                ? "bg-accentOrange/30 text-accentOrange"
                                : trip.order_status === "wait-for-approval"
                                ? "bg-accentBlue/30 text-accentBlue"
                                : "bg-accentAqua text-accentGreen"
                            }
                          `}
                        >
                          {trip.order_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-[600px]:col-span-4 max-[600px]:-order-1 max-md:order-2 col-span-2 lg:col-span-1 gap-1 w-full h-full p-4 rounded-2xl bg-white dark:bg-secondary">
          <h2 className="text-md text-gray-400">Affiliate Manager</h2>
          <p className="font-bold text-md">Nadine Wilke</p>
          <div className="rounded p-4 bg-primaryLite dark:bg-primary">
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
        <div className="flex justify-between relative flex-col max-[600px]:col-span-4 max-[600px]:-order-2 col-span-2 lg:col-span-1 w-full h-full p-4 xl:p-8 rounded-2xl bg-white dark:bg-secondary">
          <dl className="flex justify-between">
            <dt className="font-bold text-xl">{userLevel}</dt>
            <dd className="text-sm">
              {userName} - ID: {currentUser.id}
            </dd>
          </dl>
          <ProgressBar />
          <span className="text-sm px-4 py-2 my-2 rounded-xl border border-gray-400">
            Next level:{" "}
            {userLevel === "Gold" || userLevel === "Silver"
              ? "Gold"
              : userLevel === "Bronze" && "Silver"}
          </span>
        </div>
        <div className="flex flex-col max-md:row-start-3 col-span-4 lg:col-span-2 gap-6 w-full  rounded-2xl bg-white dark:bg-secondary">
          <CommissionChart />
        </div>
      </div>
    </div>
  );
};
