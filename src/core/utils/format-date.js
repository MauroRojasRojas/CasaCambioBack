import { DateTime } from "luxon";

export function formatHotelDate(date) {
    return DateTime
      .fromJSDate(new Date(date), { zone: 'utc' })
      .setZone('America/Lima')
      .setLocale('es')
      .toFormat("cccc dd 'de' LLLL 'de' yyyy");
      /* .toFormat("cccc dd 'de' LLLL 'de' yyyy · h:mm a"); */
  }