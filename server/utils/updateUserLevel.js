export const updateUserLevel = (user, trips) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const lastYear = currentYear - 1;

  const month = now.getMonth(); // from 0 tо 11
  const day = now.getDate();

  // Фильтруем туры текущего года, которые уже состоялись и не отменены
  const currentYearDepartedTrips = trips.filter((trip) => {
    if (!trip.travelDate) return false;
    const year = new Date(trip.travelDate).getFullYear();
    const travelDate = new Date(trip.travelDate);
    const isCancelled =
      trip.orderStatus === "REJECTED" || trip.orderStatus === "CANCELLED";

    return travelDate <= now && year === currentYear && !isCancelled;
  });

  const currentYearTravellers = currentYearDepartedTrips.reduce(
    (sum, t) => sum + (Number(t.travellerAmount) || 0),
    0,
  );

  // Фильтруем туры прошлого года, которые не отменены
  const lastYearDepartedTrips = trips.filter((trip) => {
    if (!trip.travelDate) return false;
    const year = new Date(trip.travelDate).getFullYear();
    const isCancelled =
      trip.orderStatus === "REJECTED" || trip.orderStatus === "CANCELLED";

    return year === lastYear && !isCancelled;
  });
  const lastYearTravellers = lastYearDepartedTrips.reduce(
    (sum, t) => sum + (Number(t.travellerAmount) || 0),
    0,
  );

  let newLevel = user.level;
  const initialLevel = user.level;

  const lastChangedDate = Array.isArray(user.levelHistory)
    ? [...user.levelHistory].sort(
        (a, b) => new Date(b.changedAt) - new Date(a.changedAt),
      )[0]?.changedAt
    : null;

  const levelYear = lastChangedDate
    ? new Date(lastChangedDate).getFullYear()
    : currentYear;

  if (month === 0 && day === 1 && levelYear < currentYear) {
    if (lastYearTravellers >= 25) {
      newLevel = "GOLD";
    } else if (lastYearTravellers >= 10) {
      newLevel = "SILVER";
    } else if (lastYearTravellers < 10) {
      if (user.level === "GOLD" || user.level === "Gold") {
        newLevel = "SILVER";
      } else {
        newLevel = "BRONZE";
      }
    }
  }

  if (
    currentYearTravellers >= 25 &&
    initialLevel !== "GOLD" &&
    initialLevel !== "Gold"
  ) {
    newLevel = "GOLD";
  } else if (
    currentYearTravellers >= 10 &&
    (initialLevel === "BRONZE" || initialLevel === "Bronze")
  ) {
    newLevel = "SILVER";
  }

  return {
    newLevel,
    currentYearTravellers,
    lastYearTravellers,
    currentYearDepartedTrips,
    lastYearDepartedTrips,
  };
};
