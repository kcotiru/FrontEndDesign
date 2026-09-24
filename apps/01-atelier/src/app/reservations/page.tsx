import type { Metadata } from "next";
import ReservationForm from "@/components/reservation-form";
import { restaurant } from "@/content/restaurant";

export const metadata: Metadata = {
  title: "Reservations",
  description: "Request one of twelve seats at Atelier, Tuesday to Saturday.",
};

export default function ReservationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-gutter py-section">
      <h1 className="text-3xl">Reservations</h1>
      <p className="mt-4 max-w-prose text-muted">
        {restaurant.hours[0]?.days}, one sitting at{" "}
        {restaurant.hours[0]?.opens}. Requests are confirmed by email.
      </p>
      <ReservationForm />
    </div>
  );
}
