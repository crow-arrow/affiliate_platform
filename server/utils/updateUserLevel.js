export const updateUserLevel = (user, trips) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const lastYear = currentYear - 1;

  const month = now.getMonth(); // from 0 tо 11
  const day = now.getDate();

  const currentYearDepartedTrips = trips.filter((trip) => {
    const year = new Date(trip.travelDate).getFullYear();
    const travelDate = new Date(trip.travelDate);
    return travelDate <= now && year === currentYear;
  });
  const currentYearTravellers = currentYearDepartedTrips.reduce(
    (sum, t) => sum + (t.travellerAmount || 0),
    0
  );

  const lastYearDepartedTrips = trips.filter((trip) => {
    const year = new Date(trip.travelDate).getFullYear();
    return year === lastYear;
  });
  const lastYearTravellers = lastYearDepartedTrips.reduce(
    (sum, t) => sum + (t.travellerAmount || 0),
    0
  );

  let newLevel = user.level;
  const initialLevel = user.level;

  const lastChangedDate = Array.isArray(user.levelHistory)
    ? [...user.levelHistory].sort(
        (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
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
