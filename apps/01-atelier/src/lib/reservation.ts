export type ReservationInput = {
  name: string;
  email: string;
  date: string;
  party: number;
};

export type ReservationErrors = Partial<Record<keyof ReservationInput, string>>;

const SEATS = 12;
const NAME_MAX = 120;

/** Validates every field and reports all failures together, so the form can
 *  mark each bad input at once instead of making the guest resubmit to find
 *  the next error. Returns {} when the input is good. */
export function validateReservation(input: ReservationInput): ReservationErrors {
  const errors: ReservationErrors = {};

  const name = input.name.trim();
  if (name.length === 0) errors.name = "Please give us a name for the booking.";
  else if (name.length > NAME_MAX) errors.name = `Please keep the name under ${NAME_MAX} characters.`;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()))
    errors.email = "Please enter an email address we can confirm to.";

  const when = new Date(`${input.date}T00:00:00`);
  if (Number.isNaN(when.getTime())) {
    errors.date = "Please choose a date.";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (when < today) errors.date = "Please choose tonight or a later date.";
  }

  if (!Number.isInteger(input.party) || input.party < 1)
    errors.party = "Please enter how many are dining, as a whole number.";
  else if (input.party > SEATS)
    errors.party = `The counter seats ${SEATS}. Call us for a full buyout.`;

  return errors;
}
