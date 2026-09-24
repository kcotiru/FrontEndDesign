import { describe, expect, it } from "vitest";
import { validateReservation, type ReservationInput } from "./reservation";

const valid: ReservationInput = {
  name: "Marguerite Yourcenar",
  email: "m@example.com",
  date: "2099-06-01",
  party: 2,
};

describe("validateReservation", () => {
  it("accepts a well-formed reservation", () => {
    expect(validateReservation(valid)).toEqual({});
  });

  it("rejects an empty name", () => {
    expect(validateReservation({ ...valid, name: "   " }).name).toBeTruthy();
  });

  it("rejects a 400-character name rather than storing it", () => {
    const r = validateReservation({ ...valid, name: "x".repeat(400) });
    expect(r.name).toBeTruthy();
  });

  it("rejects a malformed email", () => {
    expect(validateReservation({ ...valid, email: "m@" }).email).toBeTruthy();
  });

  it("rejects a date in the past", () => {
    expect(validateReservation({ ...valid, date: "2000-01-01" }).date).toBeTruthy();
  });

  it("rejects an unparseable date", () => {
    expect(validateReservation({ ...valid, date: "not-a-date" }).date).toBeTruthy();
  });

  it("rejects a party of zero", () => {
    expect(validateReservation({ ...valid, party: 0 }).party).toBeTruthy();
  });

  it("rejects a negative party", () => {
    expect(validateReservation({ ...valid, party: -3 }).party).toBeTruthy();
  });

  it("rejects a party larger than the twelve-seat counter", () => {
    expect(validateReservation({ ...valid, party: 13 }).party).toBeTruthy();
  });

  it("rejects a fractional party", () => {
    expect(validateReservation({ ...valid, party: 2.5 }).party).toBeTruthy();
  });

  it("reports every invalid field at once, not just the first", () => {
    const r = validateReservation({ name: "", email: "no", date: "nope", party: 0 });
    expect(Object.keys(r).sort()).toEqual(["date", "email", "name", "party"]);
  });
});
