import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTrips } from "../redux/features/users/userSlice"
import { ProgressBar } from "../components/levelProgressBar";
import { CommissionChart } from "../components/commissionChart";

import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StackedBarChartRoundedIcon from '@mui/icons-material/StackedBarChartRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import { CircularProgress } from '@mui/material'

export const Dashboard = () => {
  
  console.log("Dashboard render")

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchTrips()).then(() => {
      setLoading(false)
    })
  }, [dispatch])

  const currentUser = useSelector((state) => state.auth.user)
  const tripsCount = currentUser?.booked_trips_count
  const earnings = currentUser?.earnings
  const commission = currentUser?.total_commission

  const { trips } = useSelector((state) => state.user)
  
  
  const formatNumberWithK = (number) => {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K'
    }
    return number.toFixed(1)
  }

  const totalRevenue = Array.isArray(trips)
  ? trips.reduce((sum, order) => {
    const price = parseFloat(order?.total_price)
    return sum + (isNaN(price) ? 0 : price)
  }, 0)
  : 0

  const formatedTotalRevenue = formatNumberWithK(totalRevenue)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-3 flex-wrap gap-4 2xl:w-[1140px]">
        <div className="flex flex-col col-span-4 lg:col-span-2 flex-1 flex-grow gap-6 p-4 rounded-2xl bg-white dark:bg-secondary">
          <h1>Overview</h1>
          <div className="grid grid-cols-4 max-[600px]:grid-cols-2 gap-3 xl:gap-6 w-full flex-grow">
            <div className="flex flex-col w-full bg-primaryLite dark:bg-primary p-2 xl:p-4 rounded-xl text-gray-800 dark:text-gray-100">
              <StackedBarChartRoundedIcon className="text-accentBlue"/>
              <b className="lg:text-xl xl:text-2xl">{tripsCount}</b>
              <span className="text-sm">Total Order</span>
            </div>
            <div className="flex flex-col w-full bg-primaryLite dark:bg-primary p-2 xl:p-4 rounded-xl text-gray-800 dark:text-gray-100">
              <CurrencyExchangeRoundedIcon className="text-accentPink"/>
              <b className="lg:text-xl xl:text-2xl">{formatedTotalRevenue}€</b>
              <span className="text-sm">Total Sales</span>
            </div>
            <div className="flex flex-col w-full bg-primaryLite dark:bg-primary p-2 xl:p-4 rounded-xl text-gray-800 dark:text-gray-100">
              <ShoppingCartOutlinedIcon className="text-accentAqua"/>
              <b className="lg:text-xl xl:text-2xl">{earnings} / {commission}€</b>
              <span className="text-sm">Earnings</span>
            </div>
            <div className="flex flex-col w-full bg-primaryLite dark:bg-primary p-2 xl:p-4 rounded-xl text-gray-800 dark:text-gray-100">
              <AccountTreeRoundedIcon className="text-accentOrange"/>
              <b className="lg:text-xl xl:text-2xl">{tripsCount}</b>
              <span className="text-sm">Total Order</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-md:order-2 col-span-2 lg:col-span-1 gap-6 w-full h-full px-4 py-6 rounded-2xl bg-white dark:bg-secondary">
          Content
        </div>
        <div 
          className="flex relative flex-col max-[600px]:col-span-4 max-[600px]:-order-1 col-span-2 lg:col-span-1 w-full h-full p-4 xl:p-8 rounded-2xl bg-white dark:bg-secondary"
        >
          <ProgressBar />
        </div>
        <div className="flex flex-col max-md:row-start-3 col-span-4 lg:col-span-2 gap-6 w-full max-md:h-52 rounded-2xl bg-white dark:bg-secondary">
          <CommissionChart />
        </div>
      </div>
    </div>
  )
}