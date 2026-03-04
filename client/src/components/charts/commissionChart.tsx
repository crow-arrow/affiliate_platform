import { useMemo, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import VerifiedIcon from "@mui/icons-material/Verified";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { NavLink } from "react-router-dom";

export const CommissionChart = () => {
  const { trips } = useSelector((state) => state.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dropdownRef = useRef(null);

  const monthlyCommission = Array(12).fill(0);
  const monthlyCompletedCommission = Array(12).fill(0);

  const filteredTrips = useMemo(() => {
    return (
      trips?.filter((trip) => new Date(trip.booking_date).getFullYear() === selectedYear) ?? []
    );
  }, [trips, selectedYear]);

  const filteredLastYearTrips = useMemo(() => {
    return (
      trips?.filter((trip) => new Date(trip.booking_date).getFullYear() === selectedYear - 1) ?? []
    );
  }, [trips, selectedYear]);

  const completedTripsThisYear = useMemo(() => {
    return filteredTrips?.filter((trip) => trip.isCompleted).length || 0;
  }, [filteredTrips]);

  const completedTripsLastYear = useMemo(() => {
    return filteredLastYearTrips?.filter((trip) => trip.isCompleted).length || 0;
  }, [filteredLastYearTrips]);

  const differenceCompletedTrips = useMemo(() => {
    return completedTripsThisYear - completedTripsLastYear;
  }, [completedTripsThisYear, completedTripsLastYear]);

  const yearlyEarnings = useMemo(() => {
    return (
      filteredTrips?.reduce((sum, trip) => {
        if (trip.isCompleted) {
          return sum + (trip.commission || 0);
        }
        return sum;
      }, 0) || 0
    );
  }, [filteredTrips]);

  const yearlyCommission = useMemo(() => {
    return (
      filteredTrips?.reduce((sum, trip) => {
        if (!trip.isCanceled) {
          return sum + (trip.commission || 0);
        }
        return sum;
      }, 0) || 0
    );
  }, [filteredTrips]);

  filteredTrips.forEach((trip) => {
    const monthIndex = new Date(trip.booking_date).getMonth();
    const commission = trip.commission || 0;
    if (!trip.isCanceled) {
      monthlyCommission[monthIndex] += commission;
    }

    if (trip.isCompleted) {
      monthlyCompletedCommission[monthIndex] += commission;
    }
  });

  const options = useMemo(
    () => ({
      colors: ["#A9DFD8", "#FEB95A"],
      chart: {
        type: "bar",
        stacked: true,
        height: 320,
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "linear",
          speed: 300,
          animateGradually: {
            enabled: false,
            delay: 0,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 300,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
          borderRadiusApplication: "end",
          borderRadius: 5,
          borderRadiusWhenStacked: "last",
          distributed: false,
          rangeBarGroupRows: false,
          dataLabels: {
            hideOverflowingLabels: false,
          },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        style: {
          fontFamily: "Inter, sans-serif",
        },
        custom: function ({ series, dataPointIndex, w }) {
          const label = w.globals.labels[dataPointIndex];
          const earned = series[0][dataPointIndex] + " €";
          const total = series[1][dataPointIndex] + " €";
          return `
                        <div>
                        <div class="block w-full bg-muted px-4 py-2">
                            <strong>${label}</strong><br/>
                        </div>
                        <div class="bg-background dark:bg-primary/70 backdrop-blur-sm text-foreground dark:text-foreground p-4">
                            <span style="color: #A9DFD8;">●</span> Earned: ${earned}<br/>
                            <span style="color: #FEB95A;">●</span> Total: ${total}
                        </div>
                    </div>
                `;
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
          top: -14,
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
            cssClass: "text-xs font-normal fill-muted-foreground dark:fill-muted-foreground",
          },
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
        labels: {
          formatter: function (value) {
            return value + " €";
          },
        },
      },
      fill: {
        opacity: 1,
      },
    }),
    []
  );

  const series = useMemo(() => {
    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return [
      {
        name: "Earned",
        data: monthLabels.map((label, i) => ({
          x: label,
          y: Math.floor(monthlyCompletedCommission[i]),
        })),
      },
      {
        name: "Total Commission",
        data: monthLabels.map((label, i) => ({
          x: label,
          y: Math.floor(monthlyCommission[i]),
        })),
      },
    ];
  }, [monthlyCompletedCommission, monthlyCommission]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleYearChange = (year) => {
    setSelectedYear(parseInt(year));
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full rounded-lg shadow-sm  p-4 md:p-6">
      <div className="flex justify-between pb-4 mb-4 border-b border-border dark:border-border">
        <div className="flex flex-1 items-center">
          <div className="w-12 h-12 rounded-lg bg-muted text-success flex items-center justify-center me-3">
            <VerifiedIcon fontSize="medium" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex justify-between">
              <h5 className="leading-none text-2xl font-bold text-foreground dark:text-foreground py-1">
                {completedTripsThisYear}
              </h5>
              <div className="cursor-default group/button relative">
                {differenceCompletedTrips >= 0 ? (
                  <span className="bg-green-100 text-green-800 text-md font-medium inline-flex items-center gap-2 px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300 text-nowrap">
                    <TrendingUpRoundedIcon />+ {differenceCompletedTrips}
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-md font-medium inline-flex items-center gap-2 px-2.5 py-1 rounded-md dark:bg-red-900 dark:text-red-300">
                    <TrendingDownIcon />
                    {differenceCompletedTrips}
                  </span>
                )}
                <div className="open-button-tooltip pointer-events-none group-hover/button:tooltip-show -right-2 top-8 translate-x-0">
                  Shows the change in completed trips compared to the previous year
                </div>
              </div>
            </div>
            <span className="text-sm max-[450px]:text-xs font-normal text-muted-foreground dark:text-muted-foreground">
              Completed trips this year
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 text-wrap">
        <dl className="flex max-[500px]:flex-col items-center">
          <div className="relative group cursor-context-menu">
            <InfoOutlinedIcon fontSize="small" className="mr-2" />
            <div className="info-tooltip pointer-events-none group-hover:tooltip-show">
              This is the commission earned from completed trips. These amounts are confirmed and
              ready for payout.
            </div>
          </div>
          <dt className="text-muted-foreground dark:text-muted-foreground text-sm font-normal me-1">Earnings:</dt>
          <dd className="text-foreground text-sm dark:text-foreground font-semibold">
            {yearlyEarnings?.toFixed(0)} €
          </dd>
        </dl>
        <dl className="flex max-[500px]:flex-col items-center justify-end">
          <div className="relative group cursor-context-menu">
            <InfoOutlinedIcon fontSize="small" className="mr-2" />
            <div className="info-tooltip pointer-events-none group-hover:tooltip-show">
              This is the total commission from all trips, including upcoming ones. This amount is
              not final and may change if any trips are canceled or modified.
            </div>
          </div>
          <dt className="text-muted-foreground dark:text-muted-foreground text-sm font-normal me-1">
            Total earnings:
          </dt>
          <dd className="text-foreground text-sm dark:text-foreground font-semibold">
            {yearlyCommission?.toFixed(0)} €
          </dd>
        </dl>
      </div>

      <Chart
        options={options}
        series={series}
        type="bar"
        width="650px"
        height={200}
        className="overflow-scroll"
      />
      <div className="grid grid-cols-1 items-center border-border border-t dark:border-border justify-between">
        <div ref={dropdownRef} className="relative flex justify-between items-center pt-5">
          <button
            id="dropdownDefaultButton"
            onClick={toggleDropdown}
            className="text-sm font-medium text-muted-foreground dark:text-muted-foreground hover:text-foreground text-center inline-flex items-center dark:hover:text-foreground"
            type="button"
          >
            Year {selectedYear}
            <svg
              className="w-2.5 m-2.5 ms-1.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute bottom-10 z-10 divide-y divide-border rounded-xl w-44 shadow-custom dark:shadow-custom-white dark:bg-primary/30 backdrop-blur-sm overflow-hidden">
              <ul
                className="text-sm text-foreground dark:text-foreground"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 bg-opacity-0 bg-muted dark:bg-secondary/0 text-muted-foreground dark:text-muted-foreground
                                    hover:text-foreground hover:bg-muted transition-all duration-300"
                    onClick={() => handleYearChange(2024)}
                  >
                    2024
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 bg-opacity-0 bg-muted dark:bg-secondary/0 text-muted-foreground dark:text-muted-foreground
                                    hover:text-foreground hover:bg-muted transition-all duration-300"
                    onClick={() => handleYearChange(2025)}
                  >
                    2025
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 bg-opacity-0 bg-muted dark:bg-secondary/0 text-muted-foreground dark:text-muted-foreground
                                    hover:text-foreground hover:bg-muted transition-all duration-300"
                    onClick={() => handleYearChange(2026)}
                  >
                    2026
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 bg-opacity-0 bg-muted dark:bg-secondary/0 text-muted-foreground dark:text-muted-foreground
                                    hover:text-foreground hover:bg-muted transition-all duration-300"
                    onClick={() => handleYearChange(2027)}
                  >
                    2027
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 bg-opacity-0 bg-muted dark:bg-secondary/0 text-muted-foreground dark:text-muted-foreground
                                    hover:text-foreground hover:bg-muted transition-all duration-300"
                    onClick={() => handleYearChange(2028)}
                  >
                    2028
                  </a>
                </li>
              </ul>
            </div>
          )}
          <NavLink
            to="/trips"
            className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800 px-3 py-2"
          >
            Leads Report
            <KeyboardArrowRightIcon
              className="rtl:rotate-180"
              sx={{
                "& path": {
                  transitionDuration: "50ms",
                },
              }}
            />
          </NavLink>
        </div>
      </div>
    </div>
  );
};
