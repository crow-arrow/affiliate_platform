import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMe } from "@/redux/features/auth/authSlice";
import { fetchTrips } from "../redux/features/users/userSlice";
import { fetchClicks } from "../redux/features/clicks/clicksSlice";
import {
  selectUserLastThreeTrips,
  selectUserTotalRevenue,
  selectUserTripsCount,
  selectTripsStatus,
  selectTripsError,
} from "@/redux/features/users/userSelectors";
import {
  selectClicksStatus,
  selectClicksError,
  selectClicksCount,
} from "@/redux/features/clicks/clicksSelectors";
import { formatCurrency, formatDate } from "@/components/utils/formatters";
import { ProgressBar } from "../components/levelProgressBar";
import { CommissionChartCopy } from "../components/charts/commissionChart-copy";
import { AnimatedNumber } from "../components/utils/AnimatedNumber";
import { TripsDataTable } from "../components/trips-data-table";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Mail,
  User,
  Calendar,
  Euro,
} from "lucide-react";

// Function to get status badge styling
function getStatusBadge(status: string) {
  const statusMap: Record<
    string,
    { variant: "default" | "secondary" | "destructive" | "outline"; className: string }
  > = {
    COMPLETED: { variant: "default", className: "bg-green-100 text-green-800" },
    APPROVED: { variant: "default", className: "bg-green-100 text-green-800" },
    CONFIRMED: { variant: "default", className: "bg-green-100 text-green-800" },
    CANCEL: { variant: "destructive", className: "bg-red-100 text-red-800" },
    REJECTED: { variant: "destructive", className: "bg-red-100 text-red-800" },
    PENDING: { variant: "secondary", className: "bg-orange-100 text-orange-800" },
    WAIT_FOR_APPROVAL: { variant: "secondary", className: "bg-blue-100 text-blue-800" },
    DEPOSIT_PAID: { variant: "secondary", className: "bg-blue-100 text-blue-800" },
  };

  return statusMap[status] || { variant: "outline", className: "bg-gray-100 text-gray-800" };
}

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.auth.user);
  const lastThreeTrips = useAppSelector(selectUserLastThreeTrips);
  const totalRevenue = useAppSelector(selectUserTotalRevenue);
  const tripsCount = useAppSelector(selectUserTripsCount);
  const tripsStatus = useAppSelector(selectTripsStatus);
  const tripsError = useAppSelector(selectTripsError);
  const commission = currentUser?.total_commission;
  const userName = currentUser?.first_name;
  const userLevel = currentUser?.level;

  const status = useAppSelector(selectClicksStatus);
  const error = useAppSelector(selectClicksError);
  const totalClicks = useAppSelector(selectClicksCount);

  const formatNumberWithCommas = (number: number) => {
    return new Intl.NumberFormat("en-US").format(number);
  };

  const isLoading = tripsStatus === "loading" || status === "loading";
  const isFailed = tripsStatus === "failed" || status === "failed";

  useEffect(() => {
    if (!currentUser?.id) return;

    dispatch(getMe());
    dispatch(fetchTrips());
    // dispatch(fetchClicks(currentUser?.id));
  }, [currentUser?.id, dispatch]);

  const getNextLevel = (level?: string): string => {
    switch (level) {
      case "BRONZE":
        return "SILVER";
      case "SILVER":
        return "GOLD";
      case "GOLD":
        return "PLATINUM";
      default:
        return "-";
    }
  };

  const getLevelName = (level?: string): string => {
    // Если это строка в верхнем регистре (из базы данных)
    if (typeof level === "string") {
      switch (level.toUpperCase()) {
        case "BRONZE":
          return "BRONZE";
        case "SILVER":
          return "SILVER";
        case "GOLD":
          return "GOLD";
        case "PLATINUM":
          return "PLATINUM";
        default:
          return "BRONZE";
      }
    }

    return "BRONZE";
  };

  const getLevelCardStyle = (level?: string) => {
    switch (level) {
      case "BRONZE":
        return {
          className:
            "relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900 border-orange-200 dark:border-orange-800",
          iconColor: "text-orange-600 dark:text-orange-400",
          titleColor: "text-orange-700 dark:text-orange-300",
          descriptionColor: "text-orange-700 dark:text-orange-300",
          accentColor: "bg-orange-200 dark:bg-orange-800",
        };
      case "SILVER":
        return {
          className:
            "relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-slate-500 border-gray-200 dark:border-slate-700",
          iconColor: "text-gray-600 dark:text-gray-400",
          titleColor: "text-gray-700 dark:text-gray-300",
          descriptionColor: "text-gray-600 dark:text-gray-400",
          accentColor: "bg-gray-200 dark:bg-gray-800",
        };
      case "GOLD":
        return {
          className:
            "relative overflow-hidden bg-gradient-to-br from-[#f4e6d7] to-[#cbaf87] dark:from-[#8b6f47] dark:to-[#6b5b3a] border-[#cbaf87] dark:border-[#8b6f47]",
          iconColor: "text-[#8b6f47] dark:text-[#f4e6d7]",
          titleColor: "text-[#6b5b3a] dark:text-[#f4e6d7]",
          descriptionColor: "text-[#8b6f47] dark:text-[#f4e6d7]",
          accentColor: "bg-[#cbaf87] dark:bg-[#8b6f47]",
        };
      case "PLATINUM":
        return {
          className:
            "relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-700 dark:to-gray-600 border-slate-200 dark:border-slate-400",
          iconColor: "text-slate-600 dark:text-slate-400",
          titleColor: "text-slate-700 dark:text-slate-300",
          descriptionColor: "text-slate-600 dark:text-slate-400",
          accentColor: "bg-slate-200 dark:bg-slate-800",
        };
      default:
        return {
          className:
            "relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950 dark:to-slate-900 border-gray-200 dark:border-gray-800",
          iconColor: "text-gray-600 dark:text-gray-400",
          titleColor: "text-gray-700 dark:text-gray-300",
          descriptionColor: "text-gray-600 dark:text-gray-400",
          accentColor: "bg-gray-200 dark:bg-gray-800",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{tripsError || error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser && !isLoading) {
    return (
      <Card className="w-96 mx-auto mt-8">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">User not authenticated.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Orders
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              <AnimatedNumber key={tripsCount} value={tripsCount || 0} />
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Orders processed</p>
          </CardContent>
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20"></div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Total Sales
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              <AnimatedNumber
                key={totalRevenue}
                value={totalRevenue || 0}
                formatValue={(n) => formatNumberWithCommas(n)}
                suffix=" €"
                decimals={0}
              />
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Revenue generated</p>
          </CardContent>
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full opacity-20"></div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Total Commission
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              <AnimatedNumber
                key={commission}
                value={commission || 0}
                formatValue={(n) => formatNumberWithCommas(n)}
                suffix=" €"
                decimals={0}
              />
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Commission earned</p>
          </CardContent>
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20"></div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Total Clicks
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              <AnimatedNumber
                key={totalClicks}
                value={totalClicks}
                formatValue={(n) => formatNumberWithCommas(n)}
              />
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Clicks tracked</p>
          </CardContent>
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-200 dark:bg-orange-800 rounded-full opacity-20"></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Level Card */}
        <Card className={getLevelCardStyle(getLevelName(userLevel)).className}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle
                className={`flex items-center gap-2 ${getLevelCardStyle(getLevelName(userLevel)).titleColor}`}
              >
                <Badge
                  variant="outline"
                  className={`px-3 py-1 gap-2 text-lg font-bold ${getLevelCardStyle(getLevelName(userLevel)).descriptionColor}`}
                >
                  {getLevelName(userLevel)}
                </Badge>
              </CardTitle>
              <CardDescription
                className={`p-2 ${getLevelCardStyle(getLevelName(userLevel)).descriptionColor}`}
              >
                <User
                  className={`h-5 w-5 ${getLevelCardStyle(getLevelName(userLevel)).iconColor}`}
                />
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar />
            <div className="text-center">
              <Badge variant="outline" className="px-3 py-1">
                Next level: {getNextLevel(getLevelName(userLevel))}
              </Badge>
            </div>
          </CardContent>
          <div
            className={`absolute -top-4 -right-4 w-24 h-24 ${getLevelCardStyle(getLevelName(userLevel)).accentColor} rounded-full opacity-20`}
          ></div>
        </Card>

        {/* Recent Trips Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Trips</CardTitle>
            <CardDescription>Your latest trip bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {lastThreeTrips?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No recent trips found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lastThreeTrips?.map((trip) => {
                    const statusStyle = getStatusBadge(trip.orderStatus || "PENDING");
                    return (
                      <TableRow key={trip.id}>
                        <TableCell className="font-medium">#{trip.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {trip.bookingDate ? formatDate(trip.bookingDate) : "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Euro className="h-4 w-4 text-muted-foreground" />
                            {formatCurrency(trip.totalPrice || "0")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusStyle.variant} className={statusStyle.className}>
                            {trip.orderStatus
                              ? trip.orderStatus
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (c: string) => c.toUpperCase())
                              : "Unknown"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commission Chart */}
        <CommissionChartCopy className="lg:col-span-2" />

        {/* Affiliate Manager Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Affiliate Manager
            </CardTitle>
            <CardDescription>Nadine Wilke</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Hello and welcome to our affiliate program. I'm your affiliate manager, and I'm here
                for you if you have any questions or problems related to our affiliate program.
              </p>
              <p className="text-sm text-muted-foreground">
                I wish you all success in promoting our products, and a profitable partnership for
                both you and us.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Contact Email:</h3>
              <a
                href="mailto:nadine@jinn-travel.com"
                className="text-primary hover:underline transition-colors"
              >
                nadine@jinn-travel.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
