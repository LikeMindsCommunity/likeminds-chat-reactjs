export function formatEpochTime(epoch: number) {
  const date = new Date(epoch * 1000);

  return {
    formattedDateTime: date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    yesterday: new Date(date.setDate(date.getDate() - 1)).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    ),
    monthYear: date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };
}
