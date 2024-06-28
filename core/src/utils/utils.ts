const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  // Calculate time difference in seconds
  const diffSeconds = Math.floor(diff / 1000);

  // Convert seconds to minutes
  const diffMinutes = Math.floor(diffSeconds / 60);

  // Convert minutes to hours
  const diffHours = Math.floor(diffMinutes / 60);

  // Convert hours to days
  const diffDays = Math.floor(diffHours / 24);

  // Convert days to months
  const diffMonths = Math.floor(diffDays / 30);

  // Convert months to years
  const diffYears = Math.floor(diffMonths / 12);

  if (diffYears > 0) {
    return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
  } else if (diffMonths > 0) {
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  } else if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  }
};

export { formatTimeAgo };
