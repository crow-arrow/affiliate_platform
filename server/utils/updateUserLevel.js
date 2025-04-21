export const updateUserLevel = (user, trips) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const lastYear = currentYear - 1;

  const month = now.getMonth(); // from 0 tо 11
  const day = now.getDate();

  const currentYearDepartedTrips = trips.filter((trip) => {
    const year = new Date(trip.travel_date).getFullYear();
    const travelDate = new Date(trip.travel_date);
    return travelDate <= now && year === currentYear;
  });
  const currentYearTravellers = currentYearDepartedTrips.reduce(
    (sum, t) => sum + (t.traveller_amount || 0),
    0
  );

  const lastYearDepartedTrips = trips.filter((trip) => {
    const year = new Date(trip.travel_date).getFullYear();
    return year === lastYear;
  });
  const lastYearTravellers = lastYearDepartedTrips.reduce(
    (sum, t) => sum + (t.traveller_amount || 0),
    0
  );

  let newLevel = user.level;
  const initialLevel = user.level;

  const lastChangedDate = Array.isArray(user.levelHistory)
    ? [...user.levelHistory].sort(
        (a, b) => new Date(b.changed_at) - new Date(a.changed_at)
      )[0]?.changed_at
    : null;

  const levelYear = lastChangedDate
    ? new Date(lastChangedDate).getFullYear()
    : currentYear;
  console.log(levelYear);

  if (month === 0 && day === 1 && levelYear < currentYear) {
    if (lastYearTravellers >= 25) {
      newLevel = "Gold";
    } else if (lastYearTravellers >= 10) {
      newLevel = "Silver";
    } else if (lastYearTravellers < 10) {
      if (user.level === "Gold") {
        newLevel = "Silver";
      } else {
        newLevel = "Bronze";
      }
    }
  }

  if (currentYearTravellers >= 25 && initialLevel !== "Gold") {
    newLevel = "Gold";
  } else if (currentYearTravellers >= 10 && initialLevel === "Bronze") {
    newLevel = "Silver";
  }

  return {
    newLevel,
    currentYearTravellers,
    lastYearTravellers,
    currentYearDepartedTrips,
    lastYearDepartedTrips,
  };
};
