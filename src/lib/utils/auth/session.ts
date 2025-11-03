export function getEndOfSessionTime(): Date {
  const now = new Date();
  const currentHour = now.getHours();
  const endOfSession = new Date(now);

  if (currentHour < 8) {
    endOfSession.setHours(8, 0, 0, 0);
  } else if (currentHour < 14) {
    endOfSession.setHours(14, 0, 0, 0);
  } else if (currentHour < 20) {
    endOfSession.setHours(20, 0, 0, 0);
  } else {
    endOfSession.setDate(endOfSession.getDate() + 1);
    endOfSession.setHours(8, 0, 0, 0);
  }

  return endOfSession;
}
