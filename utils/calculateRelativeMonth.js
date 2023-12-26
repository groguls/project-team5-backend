function calculateRelativeMonth(monthOffset) {
  const currentDate = new Date();
  const currentMonth = getMonth(currentDate);
  const currentYear = getYear(currentDate);
  let targetDate =
    monthOffset > 0
      ? addMonths(currentDate, monthOffset - currentMonth)
      : subMonths(currentDate, Math.abs(monthOffset));

  let targetMonth = getMonth(targetDate);
  let targetYear = getYear(targetDate);
  if (targetMonth < 0) {
    targetMonth += 12;
    targetYear--;
  } else if (targetMonth > 11) {
    targetMonth -= 12;
    targetYear++;
  }

  return { month: targetMonth + 1, year: targetYear };
}
