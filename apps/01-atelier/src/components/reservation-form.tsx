"use client";

import { useRef, useState } from "react";
import { validateReservation, type ReservationErrors } from "@/lib/reservation";

const FIELD_ORDER = ["name", "email", "date", "party"] as const;

export default function ReservationForm() {
  const [errors, setErrors] = useState<ReservationErrors>({});
  const [sent, setSent] = useState(false);
  const fieldRefs = useRef<Partial<Record<(typeof FIELD_ORDER)[number], HTMLInputElement | null>>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const found = validateReservation({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      date: String(fd.get("date") ?? ""),
      party: Number(fd.get("party")),
    });
    setErrors(found);
    setSent(Object.keys(found).length === 0);

    const firstInvalid = FIELD_ORDER.find((id) => found[id]);
    if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
  }

  const field = (id: keyof ReservationErrors) =>
    errors[id]
      ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` }
      : {};

  return (
    <form onSubmit={onSubmit} noValidate className="mt-12 max-w-md">
      {FIELD_ORDER.map((id) => (
        <p key={id} className="mb-6">
          <label htmlFor={id} className="block text-sm text-muted capitalize">
            {id === "party" ? "Guests" : id}
          </label>
          <input
            id={id}
            name={id}
            ref={(el) => {
              fieldRefs.current[id] = el;
            }}
            type={id === "email" ? "email" : id === "date" ? "date" : id === "party" ? "number" : "text"}
            {...(id === "party" ? { min: 1, max: 12, defaultValue: 2 } : {})}
            {...field(id)}
            className="focus-ring mt-2 min-h-tap w-full border-b border-line bg-transparent py-2"
          />
          {errors[id] && (
            <span id={`${id}-error`} className="mt-2 block text-sm text-accent">
              {errors[id]}
            </span>
          )}
        </p>
      ))}

      <button type="submit" className="focus-ring min-h-tap border-b border-accent text-accent">
        Request a seat
      </button>

      <p role="status" aria-live="polite" className="mt-6 text-sm text-muted">
        {sent ? "Thank you — we will confirm by email within the day." : ""}
      </p>
    </form>
  );
}
