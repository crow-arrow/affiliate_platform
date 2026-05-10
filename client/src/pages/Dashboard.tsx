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
import { getStatCardClasses, Typography } from "@/theme";

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

import { StatusBadge } from "@/components/ui/status-badge";

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
      <div className="w-full space-y-6">
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
                <div className="flex gap-4 pb-2 border-b border-border justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 py-2 justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
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
      <div className="flex justify-center items-center h-full">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive text-center">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              {tripsError || error || "Unknown error"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser && !isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Card className="w-96 mx-auto mt-8">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">User not authenticated.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <Card className={`relative overflow-hidden ${getStatCardClasses("orders").card}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${getStatCardClasses("orders").title}`}>
              Total Orders
            </CardTitle>
            <BarChart3 className={`h-5 w-5 ${getStatCardClasses("orders").icon}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatCardClasses("orders").value}`}>
              <AnimatedNumber key={tripsCount} value={tripsCount || 0} />
            </div>
            <p className={`text-xs ${getStatCardClasses("orders").description} mt-1`}>
              Orders processed
            </p>
          </CardContent>
          <div
            className={`absolute -top-4 -right-4 w-20 h-20 ${getStatCardClasses("orders").accent} rounded-full opacity-20`}
          ></div>
        </Card>

        <Card className={`relative overflow-hidden ${getStatCardClasses("sales").card}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${getStatCardClasses("sales").title}`}>
              Total Sales
            </CardTitle>
            <DollarSign className={`h-5 w-5 ${getStatCardClasses("sales").icon}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatCardClasses("sales").value}`}>
              <AnimatedNumber
                key={totalRevenue}
                value={totalRevenue || 0}
                formatValue={(n) => formatNumberWithCommas(n)}
                suffix=" €"
                decimals={0}
              />
            </div>
            <p className={`text-xs ${getStatCardClasses("sales").description} mt-1`}>
              Revenue generated
            </p>
          </CardContent>
          <div
            className={`absolute -top-4 -right-4 w-20 h-20 ${getStatCardClasses("sales").accent} rounded-full opacity-20`}
          ></div>
        </Card>

        <Card className={`relative overflow-hidden ${getStatCardClasses("commission").card}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${getStatCardClasses("commission").title}`}>
              Total Commission
            </CardTitle>
            <ShoppingCart className={`h-5 w-5 ${getStatCardClasses("commission").icon}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatCardClasses("commission").value}`}>
              <AnimatedNumber
                key={commission}
                value={commission || 0}
                formatValue={(n) => formatNumberWithCommas(n)}
                suffix=" €"
                decimals={0}
              />
            </div>
            <p className={`text-xs ${getStatCardClasses("commission").description} mt-1`}>
              Commission earned
            </p>
          </CardContent>
          <div
            className={`absolute -top-4 -right-4 w-20 h-20 ${getStatCardClasses("commission").accent} rounded-full opacity-20`}
          ></div>
        </Card>

        <Card className={`relative overflow-hidden ${getStatCardClasses("clicks").card}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${getStatCardClasses("clicks").title}`}>
              Total Clicks
            </CardTitle>
            <TrendingUp className={`h-5 w-5 ${getStatCardClasses("clicks").icon}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatCardClasses("clicks").value}`}>
              <AnimatedNumber
                key={totalClicks}
                value={totalClicks}
                formatValue={(n) => formatNumberWithCommas(n)}
              />
            </div>
            <p className={`text-xs ${getStatCardClasses("clicks").description} mt-1`}>
              Clicks tracked
            </p>
          </CardContent>
          <div
            className={`absolute -top-4 -right-4 w-20 h-20 ${getStatCardClasses("clicks").accent} rounded-full opacity-20`}
          ></div>
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
                <TableHeader className="bg-secondary sticky top-0 z-10">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead className="text-center">Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lastThreeTrips?.map((trip) => {
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
                          <div className="flex items-center gap-2 justify-center">
                            <Euro className="h-4 w-4 text-muted-foreground" />
                            {formatCurrency(trip.totalPrice || "0")}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={trip.orderStatus || "PENDING"} />
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
              <Typography.bodySm className="text-muted-foreground">
                Hello and welcome to our affiliate program. I'm your affiliate manager, and I'm here
                for you if you have any questions or problems related to our affiliate program.
              </Typography.bodySm>
              <Typography.bodySm className="text-muted-foreground">
                I wish you all success in promoting our products, and a profitable partnership for
                both you and us.
              </Typography.bodySm>
            </div>
            <Separator />
            <div>
              <Typography.label className="mb-2 text-muted-foreground">
                Contact Email:{" "}
                <a
                  href="mailto:nadine@jinn-travel.com"
                  className="text-primary hover:underline transition-colors"
                >
                  nadine@jinn-travel.com
                </a>
              </Typography.label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
