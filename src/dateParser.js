/**
 * Parse a user-provided date string into { since, until } ISO timestamps
 * covering the full day in the local timezone.
 *
 * Supported formats:
 *   "yap" / undefined  → today
 *   "yesterday"        → yesterday
 *   "16032026"         → DDMMYYYY
 *   "16-03-2026"       → DD-MM-YYYY
 *   "16/03/2026"       → DD/MM/YYYY
 */
export function parseDate(input) {
  let targetDate;

  if (!input || input.toLowerCase() === "yap") {
    // Today
    targetDate = new Date();
  } else if (input.toLowerCase() === "yesterday") {
    targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - 1);
  } else if (/^\d{8}$/.test(input)) {
    // DDMMYYYY
    const day = parseInt(input.slice(0, 2), 10);
    const month = parseInt(input.slice(2, 4), 10) - 1;
    const year = parseInt(input.slice(4, 8), 10);
    targetDate = new Date(year, month, day);
  } else if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(input)) {
    // DD-MM-YYYY or DD/MM/YYYY
    const parts = input.split(/[-/]/);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    targetDate = new Date(year, month, day);
  } else {
    throw new Error(
      `Invalid date format: "${input}"\n` +
        `Supported: yap, yesterday, DDMMYYYY, DD-MM-YYYY, DD/MM/YYYY`,
    );
  }

  // Validate the parsed date
  if (isNaN(targetDate.getTime())) {
    throw new Error(`Could not parse date: "${input}"`);
  }

  // Start of day (local timezone)
  const since = new Date(targetDate);
  since.setHours(0, 0, 0, 0);

  // End of day (local timezone)
  const until = new Date(targetDate);
  until.setHours(23, 59, 59, 999);

  return {
    since: since.toISOString(),
    until: until.toISOString(),
    displayDate: targetDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}
