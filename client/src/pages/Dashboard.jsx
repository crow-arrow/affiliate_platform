import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTrips } from "../redux/features/users/userSlice"

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

  const { user } = useSelector((state) => state.auth)
  const tripsCount = user?.booked_trips_count
  const earnings = user?.earnings
  const commission = user?.total_commission
  const numberOfTravellers = user?.current_year_travellers

  const { trips } = useSelector((state) => state.user)
  const currentUser = useSelector((state) => state.auth.user)
  const userName = currentUser.first_name
  const userLevel = currentUser.level
  
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
        <div className="flex flex-col col-span-4 lg:col-span-2 flex-1 flex-grow gap-6 px-4 py-6 xl:p-8 rounded-2xl bg-white dark:bg-secondary">
          <h1>Overview</h1>
          <div className="grid grid-cols-4 gap-3 xl:gap-6 w-full flex-grow">
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
          className="flex relative flex-col col-span-2 lg:col-span-1 w-full h-full p-4 xl:p-8 rounded-2xl bg-white dark:bg-secondary"
        >
          <div className="flex flex-col justify-center items-start">
            <span className="text-sm">{userName} - ID: {user.id}</span>
            <h2 className="font-bold text-xl">{userLevel}</h2>
            <div className="flex items-end justify-arround">
              <span className="max-lg:text-sm">0</span>
              <div className="relative w-full aspect-[310/190]">
                <svg
                  viewBox="0 0 310 190"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path d="M14.1453 172.3C11.0946 172.3 8.61076 169.826 8.72513 166.778C9.38014 149.318 13.1369 132.099 19.8341 115.931C27.2367 98.0595 38.0867 81.8213 51.7648 68.1432C65.4428 54.4651 81.6811 43.6151 99.5523 36.2126C117.424 28.8101 136.578 25 155.922 25C175.265 25 194.42 28.8101 212.291 36.2126C230.162 43.6151 246.4 54.4651 260.078 68.1432C273.756 81.8213 284.607 98.0595 292.009 115.931C298.706 132.099 302.463 149.318 303.118 166.778C303.232 169.826 300.749 172.3 297.698 172.3V172.3C294.647 172.3 292.186 169.826 292.062 166.778C291.413 150.77 287.945 134.987 281.802 120.158C274.955 103.628 264.919 88.6072 252.267 75.955C239.614 63.3028 224.594 53.2665 208.063 46.4191C191.532 39.5718 173.815 36.0475 155.922 36.0475C138.029 36.0475 120.311 39.5718 103.78 46.4191C87.2491 53.2665 72.2287 63.3027 59.5765 75.955C46.9243 88.6072 36.888 103.628 30.0407 120.158C23.8986 134.987 20.4304 150.77 19.781 166.778C19.6574 169.826 17.196 172.3 14.1453 172.3V172.3Z" 
                    className="fill-primary shadow-inset-2"
                  />
                  <path d="M14.3215 173.2C10.1794 173.2 6.80198 169.84 7.009 165.703C7.86656 148.566 11.6592 131.684 18.2396 115.797C25.7778 97.5986 36.8267 81.0627 50.7555 67.1339C64.6843 53.2052 81.2202 42.1562 99.419 34.618C115.306 28.0376 132.188 24.245 149.325 23.3874C153.462 23.1804 156.822 26.5578 156.822 30.7V30.7C156.822 34.8421 153.461 38.1782 149.325 38.4082C134.159 39.2517 119.226 42.6498 105.159 48.4762C88.7803 55.2606 73.898 65.2046 61.3621 77.7405C48.8262 90.2764 38.8822 105.159 32.0978 121.538C26.2713 135.604 22.8732 150.538 22.0298 165.704C21.7998 169.839 18.4637 173.2 14.3215 173.2V173.2Z" 

                    className={`
                      ${userLevel === "Bronze" ? 'fill-bronze-text'
                        : userLevel === "Silver" ? 'fill-gray-400'
                        : userLevel === 'Gold' ? 'fill-accent' : 'fill-accentAqua'}`}
                  />
                  <circle cx="155.622" cy="29.8" r="13.8" 
                    className={`
                      ${userLevel === "Bronze" ? 'fill-bronze-text'
                        : userLevel === "Silver" ? 'fill-gray-400'
                        : userLevel === 'Gold' ? 'fill-accent' : 'fill-accentAqua'}`}
                  />
                </svg>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-3">
                  <p className="text-center text-3xl md:text-4xl">{numberOfTravellers || 0}</p>
                  <p className="text-center text-sm whitespace-nowrap">Travellers reffered</p>
                </div>
              </div>
              <span className="max-lg:text-sm">10</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-md:row-start-3 col-span-4 lg:col-span-2 gap-6 w-full max-md:h-52 px-4 py-6 rounded-2xl bg-white dark:bg-secondary">
          Content long
        </div>
      </div>
    </div>
  )
}