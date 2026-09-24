import type { Metadata } from "next";
import ReservationForm from "@/components/reservation-form";
import { restaurant, formatDays } from "@/content/restaurant";

const days = restaurant.hours[0]?.days ?? [];

export const metadata: Metadata = {
  title: "Reservations",
  description: `Request one of twelve seats at Atelier, ${formatDays(days)}.`,
};

export default function ReservationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-gutter py-section">
      <h1 className="text-3xl">Reservations</h1>
      <p className="mt-4 max-w-prose text-muted">
        {formatDays(days)}, one sitting at{" "}
        {restaurant.hours[0]?.opens}. Requests are confirmed by email.
      </p>
      <ReservationForm />
    </div>
  );
}
