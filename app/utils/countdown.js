const TARGET_DATE = 'January 01, 2026 00:00:00';

function calculateTimeRemaining(targetDateString) {
  const now = new Date();
  const target = new Date(targetDateString); 
  if (now >= target) {
    return { weeks: 0, days: 0, isFinished: true };
  }

  const differenceInMs = target.getTime() - now.getTime();
  const totalDays = differenceInMs / 86400000;
  const weeks = Math.floor(totalDays / 7);
  const days = Math.floor(totalDays % 7);
  return { weeks, days, isFinished: false };
}

function generateCountdownString(targetDateString) {
    const { weeks, days, isFinished } = calculateTimeRemaining(targetDateString);
    if (isFinished) {
        return `The event has arrived!`;
    }
    const parts = [];
    if (weeks > 0) parts.push(`${weeks} ${weeks === 1 ? 'week' : 'weeks'}`);
    if (days > 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    let countdownText;
    if (parts.length === 0) {
        countdownText = "The event is starting very soon (less than 1 day remaining).";
    } else {
        countdownText = parts.join(' & ') + ' left for the JEE January 2026 attempt !';
    }

    // const targetDateFormatted = new Date(targetDateString).toLocaleDateString('en-US', {
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    //     weekday: 'long'
    // });

    return ` ${countdownText}`;
}

export const time = generateCountdownString(TARGET_DATE);
