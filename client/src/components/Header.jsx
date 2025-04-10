import { useSelector } from 'react-redux'
import { checkIsAuth } from '../redux/features/auth/authSlice'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AutoModeIcon from '@mui/icons-material/AutoMode';


export const Header = () => {

    const isAuth = useSelector(checkIsAuth)

    return (
        <div>
            {isAuth && <div className="inline-flex w-full h-20 justify-between">
                <header className="flex w-full justify-between items-center px-8">
                    <div className="mr-4 flex-grow">
                        <label className="relative block">
                            <span className="sr-only">Search</span>
                            <span className="absolute z-10 inset-y-0 right-0 flex items-center px-4">
                                {/* <a href="#" onClick={''}></a> */}
                                <SearchOutlinedIcon />
                            </span>
                            <input 
                                className="
                                    placeholder:italic 
                                    placeholder:text-slate-400 
                                    block bg-secondary backdrop-blur-sm
                                    w-full shadow-inset-2 outline-none rounded-xl 
                                    py-2 pl-4 pr-3 
                                    focus:outline-none focus:border-accent 
                                    focus:ring-accent focus:ring-1 sm:text-sm" 
                                placeholder="Search for anything..." type="text" name="search"
                            />
                        </label>
                    </div>
                    <div className='flex lg:w-72 justify-end items-center'>
                        <div className="flex items-center justify-between gap-x-4">
                            <span className="inset-y-0 left-0 flex items-center pr-8 mr-4 border-r-2 border-r-gray-400">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.5 9.34142C8.5 8.23327 7.02611 7.93954 6.63508 8.97641C5.6892 11.4845 5 13.7283 5 14.9413C5 18.8073 8.13401 21.9413 12 21.9413C15.866 21.9413 19 18.8073 19 14.9413C19 13.638 18.2045 11.1451 17.1498 8.41279C15.7836 4.87332 15.1005 3.10358 14.2573 3.00826C13.9874 2.97776 13.6931 3.0326 13.4523 3.15822C12.7 3.55079 12.7 5.481 12.7 9.34142C12.7 10.5012 11.7598 11.4414 10.6 11.4414C9.4402 11.4414 8.5 10.5012 8.5 9.34142Z" stroke="#000" strokeOpacity="0.50"/>
                                    <path d="M5 15C5 18.866 8.13401 22 12 22C15.866 22 19 18.866 19 15" stroke="#ef4444" strokeLinecap="round"/>
                                </svg>
                            </span>
                            <button>
                                <DarkModeIcon />
                                <LightModeIcon />
                                <AutoModeIcon />
                            </button>
                        </div>
                    </div>
                </header>
            </div>
            }
        </div>
    )
}