import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const scopes = ["https://www.googleapis.com/auth/calendar"];
const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY,
  scopes
);

const calendar = google.calendar({
  version: "v3",
});

export async function getEventList() {
  const res = await calendar.events.list({
    auth,
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    timeMin: new Date().toISOString(),
  });

  return res.data;
}
