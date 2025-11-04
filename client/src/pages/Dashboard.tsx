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
import { TripsDataTable } from "../components/data/trips-data-table";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
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
    COMPLETED: {
      variant: "default",
      className: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    },
    APPROVED: {
      variant: "default",
      className: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    },
    CONFIRMED: {
      variant: "default",
      className: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    },
    CANCEL: {
      variant: "destructive",
      className: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    },
    REJECTED: {
      variant: "destructive",
      className: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    },
    PENDING: {
      variant: "secondary",
      className: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
    },
    WAIT_FOR_APPROVAL: {
      variant: "secondary",
      className: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    },
    DEPOSIT_PAID: {
      variant: "secondary",
      className: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    },
  };

  return (
    statusMap[status] || {
      variant: "outline",
      className: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
    }
  );
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

  // Обновляем данные пользователя после получения туров
  useEffect(() => {
    if (tripsStatus === "succeeded") {
      dispatch(getMe());
    }
  }, [tripsStatus, dispatch]);

  if (isLoading) {
    return (
      <div className="w-full space-y-6 p-4">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Level Card + Recent Trips Table Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Level Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <div className="text-center">
                <Skeleton className="h-6 w-32 mx-auto" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Trips Table Skeleton */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-4 pb-2 border-b">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 py-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commission Chart + Affiliate Manager Card Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Commission Chart Skeleton */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>

          {/* Affiliate Manager Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Separator />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardContent>
          </Card>
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
        <ProgressBar />

        {/* Recent Trips Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Trips</CardTitle>
            <CardDescription>Your latest trip bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {lastThreeTrips?.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Calendar className="size-6" />
                  </EmptyMedia>
                  <EmptyTitle>No recent trips found</EmptyTitle>
                  <EmptyDescription>Your recent trip bookings will appear here</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table className="border border-border rounded-lg overflow-hidden">
                <TableHeader className="bg-muted sticky top-0 z-10">
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
                        <TableCell className="font-medium">{trip.id}</TableCell>
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
