import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { getMe, registerUser } from '../redux/features/auth/authSlice';
import { CropAvatar } from "../components/Avatar";
import avatarLogo from '../assets/avatar.png'
import {API_URL} from "../config"

import PartyModeOutlinedIcon from '@mui/icons-material/PartyModeOutlined';

export const Settings = () => {

  const dispatch = useDispatch()
  const [avatar, setAvatar] = useState(avatarLogo);
  const currentUser = useSelector((state) => state.auth.user)

  useEffect(() => {
    setAvatar(currentUser.avatarUrl ? `${API_URL}${currentUser.avatarUrl}` : avatarLogo);
  }, [currentUser]);

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

  return (
    <div key={updateKey} className='flex flex-col gap-5'>
      <div className='flex flex-col bg-secondary backdrop-blur-sm rounded-2xl p-4 items-start justify-between'>
        <h1 className='text-3xl w-conten pb-4'>Your Profile</h1>
        <div className='flex flex-col items-center justify-around w-60 h-40 bg-primary text-2xl rounded-xl shadow-custom'>
          <div className='relative'>
            <img className='w-20 h-20 rounded-full shadow-inset-custom' src={avatar} alt="Avatar" />
            <button 
              onClick={() => setIsModalOpen(true)} 
              className='absolute -bottom-3 left-1/2 -translate-x-1/2'
            >
              <PartyModeOutlinedIcon 
                onClose={handleCloseModal} 
                className='bg-accentBlue shadow-custom'
                style={{
                  color: 'black', 
                  border: '1.5px dashed black',
                  borderRadius: '50%', 
                  fontSize: '2rem',
                  padding: '4px',
                }}
              />
            </button>
          </div>
          <span className=
            {`py-2 px-8 rounded-2xl bg-accent
              ${userLevel === 'Bronze' ? 'bg-bronze-500 text-gray-800' : 
                userLevel === 'Silver' ? 'bg-gray-200 text-gray-800' : 
                userLevel === 'Gold' ? 'bg-accent text-gray-800' : 'bg-none'}`} 
          >
            <b>{userLevel}</b>
          </span>
        </div>
      </div>
      <div className='flex flex-col w-full bg-secondary backdrop-blur-sm rounded-2xl p-4 items-start justify-between'>
        <h2 className='text-2xl py-4'>Personal Information</h2>
        <form 
            onSubmit={handleSubmit}
            method="POST" 
            className="grid grid-cols-2 w-full max-md:grid-cols-1 gap-y-5 gap-x-20"
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
                  className="block w-full rounded-3xl shadow-inset-2 bg-gray-400 px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
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
                  className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
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
                  className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
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
                  className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
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
                  className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
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
                  className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
                />
              </div>
            </div>
            <div className='col-span-2 flex justify-end'>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-1/5 rounded-3xl bg-primary mt-8 px-3 py-1.5 shadow-custom text-sm font-semibold text-center text-white hover:shadow-inset-white-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-90 transition-all"
              >
                Save
              </button>
          </div>
        </form>
      </div>

        <CropAvatar isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
