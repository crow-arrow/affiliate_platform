import { useMemo, useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import Chart from "react-apexcharts"

export const CommissionChart = () => {
    const { trips } = useSelector((state) => state.user)

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const dropdownRef = useRef(null)

    const monthlyCommission = Array(12).fill(0)
    const monthlyCompletedCommission = Array(12).fill(0)

    const filteredTrips = trips?.filter(trip => new Date(trip.booking_date).getFullYear() === selectedYear)
        
    const yearlyEarnings = filteredTrips?.reduce((sum, trip) => {
        if (trip.isCompleted) {
            return sum + (trip.commission || 0)
        }
        return sum
    }, 0)
    const yearlyCommission = filteredTrips?.reduce((sum, trip) => {
        if (!trip.isCanceled) {
            return sum + (trip.commission || 0)
        }
        return sum
    }, 0)

    filteredTrips.forEach(trip => {
        const monthIndex = new Date(trip.booking_date).getMonth()
        const commission = trip.commission || 0
        if (!trip.isCanceled) {
            monthlyCommission[monthIndex] += commission
        }

        if (trip.isCompleted) {
            monthlyCompletedCommission[monthIndex] += commission
        }
    })

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const options = useMemo(() => ({
        colors: ["#A9DFD8", "#FEB95A"],
        chart: {
            type: "bar",
            height: 320,
            fontFamily: "Inter, sans-serif",
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "70%",
                borderRadiusApplication: "end",
                borderRadius: 8,
                borderRadiusWhenStacked: "last",
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            style: {
                fontFamily: "Inter, sans-serif",
            },
        },
        states: {
            hover: {
                filter: {
                    type: "darken",
                    value: 1,
                },
        },
        },
        stroke: {
            show: true,
            width: 0,
            colors: ["transparent"],
        },
        grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -14
            },
        },
        dataLabels: {
        enabled: false,
        },
        legend: {
            show: false,
        },
        xaxis: {
            floating: false,
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                }
            },
                axisBorder: {
                    show: false,
            },
                axisTicks: {
                    show: false,
            },
        },
            yaxis: {
            show: false,
        },
        fill: {
            opacity: 1,
        },
    }), [])

    const series = useMemo(() => [
        {
            name: "Completed Commission",
            data: monthLabels.map((label, i) => ({ x: label, y: monthlyCompletedCommission[i] }))
        },
        {
            name: "Total Commission",
            data: monthLabels.map((label, i) => ({ x: label, y: monthlyCommission[i] }))
        },
    ], [filteredTrips])

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev)
    }

    const handleYearChange = (year) => {
        setSelectedYear(parseInt(year))
        setDropdownOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return() => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    },[])

    return (
        <div className="w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
            <div className="flex justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center me-3">
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                    <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"/>
                    <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z"/>
                    </svg>
                </div>
                <div>
                    <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">3.4k</h5>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Leads generated per week</p>
                </div>
                </div>
                <div>
                <span className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">
                    <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24" d="M5 13V1m0 0L1 5m4-4 4 4"/>
                    </svg>
                    42.5%
                </span>
                </div>
            </div>

            <div className="grid grid-cols-2">
                <dl className="flex items-center">
                    <dt className="text-gray-500 dark:text-gray-400 text-sm font-normal me-1">Earnings:</dt>
                    <dd className="text-gray-900 text-sm dark:text-white font-semibold">{yearlyEarnings?.toFixed(2)}</dd>
                </dl>
                <dl className="flex items-center justify-end">
                    <dt className="text-gray-500 dark:text-gray-400 text-sm font-normal me-1">Total earnings:</dt>
                    <dd className="text-gray-900 text-sm dark:text-white font-semibold">{yearlyCommission?.toFixed(2)}</dd>
                </dl>
            </div>

            <Chart options={options} series={series} type="bar" width="650px" height={200}
                className="overflow-scroll"
            />
            <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
            <div ref={dropdownRef} className="relative flex justify-between items-center pt-5">
                {/* <!-- Button --> */}
                <button
                    id="dropdownDefaultButton"
                    onClick={toggleDropdown}
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                    type="button"
                >
                    Year {selectedYear}
                    <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </button>
                    {/* <!-- Dropdown menu --> */}
                {dropdownOpen && <div className="absolute bottom-10 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleYearChange(2024)}>2024</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleYearChange(2025)}>2025</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleYearChange(2026)}>2026</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleYearChange(2027)}>2027</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleYearChange(2028)}>2028</a>
                    </li>
                    </ul>
                </div>}
                <a
                    href="#"
                    className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
                >
                    Leads Report
                <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                </a>
            </div>
            </div>
        </div>
    )
}