export const getOrderStatusClasses = (status: string) => {
  switch (status) {
    case "cancelled":
      return "bg-destructive/10 text-destructive";
    case "rejected":
      return "bg-destructive/10 text-destructive";
    case "pending":
      return "bg-warning/10 text-warning";
    case "wait-for-approval":
      return "bg-info/10 text-info";
    default:
      return "bg-success/10 text-success";
  }
};
