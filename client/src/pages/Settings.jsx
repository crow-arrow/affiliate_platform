import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { getMe, registerUser } from '../redux/features/auth/authSlice';
import { CropAvatar } from "../components/Avatar";
import avatarLogo from '../assets/avatar.png'
import {API_URL} from "../config"

import PartyModeOutlinedIcon from '@mui/icons-material/PartyModeOutlined';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';

export const Settings = () => {

  console.log('Settings rendered')

  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.user)
  const avatar = currentUser.avatarUrl ? `${API_URL}${currentUser.avatarUrl}` : avatarLogo

  const { status } = useSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    try {
      await dispatch(registerUser({
        email,
        username: email,
        phone,
        first_name,
        last_name,
        password,
      }))
      await dispatch(getMe())
      setEmail('')
      setPhone('')
      setFirstName('')
      setLastName('')
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message)
      toast.error("Registration failed. Please try again.")
    }
  }

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(() => {
        toast.success('Link copied to clipboard!')
    }).catch((err) => {
        toast.error('Failed to copy the link: ' + err)
    })
}

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUpdateKey((prev) => prev + 1);
  };

  const userEmail = currentUser.email
  const userPhone = currentUser.phone
  const userFirstName = currentUser.first_name
  const userLastName = currentUser.last_name
  const userLevel = currentUser.level
  const userAffiliateId = currentUser.affiliate_id
  const refLink = `https://jinn-travel.com/?affiliateId=${userAffiliateId}`;

  return (
    <div key={updateKey} className='flex flex-col gap-4'>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 border-box">
        <div className='flex flex-col justify-between rounded-2xl px-4 py-6 bg-secondary backdrop-blur-sm'>
          <div className="col-span-full mb-6">
            <h1 className="text-2xl w-content">Profile</h1>
          </div>
          <span className='text-accentOrange'>Your refferal link:</span>
          <div className="flex flex-col items-start justify-between rounded-xl">
            <label className="relative w-full">
              <span className="absolute z-10 inset-y-0 left-0 flex items-center px-4">
                {/* <a href="#" onClick={''}></a> */}
                <InsertLinkRoundedIcon className="text-accentOrange" />
              </span>
              <button
                onClick={() => handleCopy(refLink)}
                className="absolute z-10 inset-y-0 right-0 flex items-center px-4"
              >
                <ContentCopyRoundedIcon className="hover:text-accentOrange transition-colors" />
              </button>
              <input
                value={refLink}
                type="text"
                name="refferal link"
                readOnly
                className="
                  text-slate-200
                  block bg-primary outline-none
                  w-full shadow-inset-2 rounded-xl
                  py-2 pl-12 pr-12 sm:text-sm"
              />
            </label>
          </div>
        </div>
        <div className='flex flex-col justify-between rounded-2xl lg:w-72 px-4 py-6 bg-secondary backdrop-blur-sm'>
          <div className="flex flex-col items-center justify-around w-full px-4 h-40 text-2xl rounded-xl">
            <div className="relative">
              <img
                className="w-20 h-20 rounded-full shadow-inset-custom"
                src={avatar}
                alt="Avatar"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2"
              >
                <PartyModeOutlinedIcon
                  onClose={handleCloseModal}
                  className="bg-accentOrange shadow-custom"
                  style={{
                    color: "gray",
                    border: "1.5px dashed gray",
                    borderRadius: "50%",
                    fontSize: "2rem",
                    padding: "4px",
                  }}
                />
              </button>
            </div>
            <span
              className={`py-2 px-8 rounded-2xl bg-accent
                        ${
                          userLevel === "Bronze"
                            ? "bg-bronze-500 text-gray-800"
                            : userLevel === "Silver"
                            ? "bg-gray-200 text-gray-800"
                            : userLevel === "Gold"
                            ? "bg-accent text-gray-800"
                            : "bg-none"
                        }`}
            >
              <b>{userLevel}</b>
            </span>
          </div>
        </div>
      </div>
      <div className='flex flex-col w-full bg-secondary backdrop-blur-sm rounded-2xl px-4 py-6 gap-y-4 items-start justify-between'>
        <h2 className='text-2xl'>Personal Information</h2>
        <form 
            onSubmit={handleSubmit}
            method="POST" 
            className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-20 w-full"
          >
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={userEmail}
                  // onChange={(e) => setEmail(e.target.value)}
                  readOnly
                  autoComplete="email"
                  className="block w-full rounded-3xl shadow-inset-2 bg-gray-400 px-3 py-1.5 text-base text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm/6 font-medium">
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="phone"
                  placeholder={userPhone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="phone"
                  className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="first-name" className="block text-sm/6 font-medium">
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  placeholder={userFirstName}
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                  className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="last-name" className="block text-sm/6 font-medium">
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  placeholder={userLastName}
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                  className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirm-password" className="block text-sm/6 font-medium">
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400  sm:text-sm"
                />
              </div>
            </div>
            <div className='md:col-span-2 flex justify-end'>
              <button
                type="submit"
                disabled={status === "loading"}
                className="
                  w-full md:w-1/4 rounded-xl bg-gradient-blur backdrop-blur-sm text-gray-300 
                  mt-6 px-4 py-1.5 shadow-custom text-lg font-semibold text-center hover:text-accentAqua
                  hover:shadow-inset-white-2 active:scale-90 transition-all"
              >
                Save
              </button>
          </div>
        </form>
      </div>
        {isModalOpen && (
          <CropAvatar isOpen={isModalOpen} onClose={handleCloseModal} />
        )}
    </div>
  )
}
