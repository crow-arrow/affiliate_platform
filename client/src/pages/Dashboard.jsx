import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTrips } from "../redux/features/users/userSlice"
import { CropAvatarTest } from '../components/Test'

import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StackedBarChartRoundedIcon from '@mui/icons-material/StackedBarChartRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';

export const Dashboard = () => {
  
  console.log("Dashboard render")

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUpdateKey((prev) => prev + 1);
  };

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const tripsCount = user?.booked_trips_count
  const commission = user?.earned_commission

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

    useEffect(() => {
      dispatch(fetchTrips())
    }, [dispatch])

  return (
    <div key={updateKey} className="w-full space-y-6">
      <div className="flex flex-wrap w-full gap-4">
        <div className="flex flex-col lg:min-w-[608px] md:min-w-[360px] flex-1 flex-grow gap-6 px-4 py-6 rounded-2xl bg-secondary">
          <h1>Overview</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full flex-grow">
            <div className="flex flex-col w-full bg-primary p-4 rounded-xl text-gray-100">
              <StackedBarChartRoundedIcon className="text-accentBlue"/>
              <b className="text-2xl">{tripsCount}</b>
              <span className="text-sm">Total Order</span>
            </div>
            <div className="flex flex-col w-full bg-primary p-4 rounded-xl text-gray-100">
              <CurrencyExchangeRoundedIcon className="text-accentPink"/>
              <b className="text-2xl">{formatedTotalRevenue}</b>
              <span className="text-sm">Total Sales</span>
            </div>
            <div className="flex flex-col w-full bg-primary p-4 rounded-xl text-gray-100">
              <ShoppingCartOutlinedIcon className="text-accentAqua"/>
              <b className="text-2xl">{commission}€</b>
              <span className="text-sm">Earnings</span>
            </div>
            <div className="flex flex-col w-full bg-primary p-4 rounded-xl text-gray-100">
              <AccountTreeRoundedIcon className="text-accentOrange"/>
              <b className="text-2xl">{tripsCount}</b>
              <span className="text-sm">Total Order</span>
            </div>
          </div>
        </div>
        <button
                onClick={() => setIsModalOpen(true)}
                className="p-4 rounded-lg bg-accentAqua text-black"
              >Avatar Uploader
        </button>
        {isModalOpen && (
          <CropAvatarTest isOpen={isModalOpen} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  )
}