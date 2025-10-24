export const getOrderStatusClasses = (status: string) => {
  switch (status) {
    case "cancel":
      return "bg-accentPink/30 text-accentPink";
    case "rejected":
      return "bg-gray-300/30 text-gray-300";
    case "pending":
      return "bg-accentOrange/30 text-accentOrange";
    case "wait-for-approval":
      return "bg-accentBlue/30 text-accentBlue";
    default:
      return "bg-accentAqua text-accentGreen";
  }
};
