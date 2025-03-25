import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { assignCoupon as assignCouponThunk } from "../redux/features/coupon/couponSlice" 

export const Dashboard = () => {
  const [userId, setUserId] = useState("")
  const [coupon, setCoupon] = useState("")
  const dispatch = useDispatch()
  const { status, error } = useSelector((state) => state.coupon)

  const handleAssignCoupon = () => {
    if (!userId || !coupon) return
    dispatch(assignCouponThunk({ userId, coupon }))
  }

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
      <h2>Trip Assignment</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="block w-full rounded-3xl bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
      />
      <input
        type="text"
        placeholder="Coupon"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        className="block w-full rounded-3xl bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
      />
      <button 
        onClick={handleAssignCoupon} // Используем переименованную функцию
        disabled={status === "loading"}
        className="flex w-full justify-center rounded-3xl bg-accent px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-accentDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
      >
        {status === "loading" ? "Adding..." : "Add Coupon"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {status === "succeeded" && <p className="text-sm text-green-500">Trip assigned successfully!</p>}
    </div>
  )
}