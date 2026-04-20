import type { TokyoSessionInfo } from "./types";

/** JPX cash session (approximate; holidays not excluded). */
export function getTokyoSessionInfo(now = new Date()): TokyoSessionInfo {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const minutes = hour * 60 + minute;

  const weekend = weekday === "Sat" || weekday === "Sun";
  let status: TokyoSessionInfo["status"] = "closed";
  let detailEn = "Closed";

  if (weekend) {
    detailEn = "Closed (weekend)";
  } else if (minutes >= 9 * 60 && minutes < 11 * 60 + 30) {
    status = "open";
    detailEn = "Morning session";
  } else if (minutes >= 11 * 60 + 30 && minutes < 12 * 60 + 30) {
    status = "break";
    detailEn = "Lunch break";
  } else if (minutes >= 12 * 60 + 30 && minutes < 15 * 60) {
    status = "open";
    detailEn = "Afternoon session";
  } else {
    status = "closed";
    detailEn = "Closed (outside cash hours)";
  }

  const timeInTokyo = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  return { status, detailEn, timeInTokyo };
}
