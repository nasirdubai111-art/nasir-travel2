import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

export function addMinutesToTimeString(timeStr: string, minutesToAdd: number): string {
  const [hours, mins] = timeStr.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutesToAdd;
  const newHours = Math.floor((totalMinutes / 60) % 24);
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`;
}

export function calculateTopicTimes(startTime: string, topics: { durationMinutes: number }[]) {
  let currentTime = startTime;
  return topics.map((topic) => {
    const topicStart = currentTime;
    const topicEnd = addMinutesToTimeString(currentTime, topic.durationMinutes);
    currentTime = topicEnd;
    return {
      startTime: topicStart,
      endTime: topicEnd,
    };
  });
}
