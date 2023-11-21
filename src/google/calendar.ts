import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const calendar = google.calendar({
  version: "v3",
  auth: process.env.GOOGLE_API_KEY,
});

async function main() {
  const res = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
  });
  console.log(res);
}

main().catch(console.error);
