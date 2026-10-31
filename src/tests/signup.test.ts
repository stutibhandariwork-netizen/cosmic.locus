import { describe, expect, it } from "vitest";
import { eventBody, isEmail, isPhone, normalisePhone } from "@/lib/signup";
import { DEFAULT_PREFS } from "@/lib/store";

const contact = { email: " Asha@Example.com ", phone: "+919876543210", consentAt: "2026-11-01T00:00:00Z" };
const profile = { name: "Asha Rao", birthDate: "2000-01-21", birthTime: "12:46", place: { label: "Cuttack", latitude: 20.46, longitude: 85.88, timeZone: "Asia/Kolkata" } };

describe("sign-up details", () => {
  it("checks emails and phone numbers", () => {
    expect(isEmail("asha@example.com")).toBe(true);
    expect(isEmail("asha@example")).toBe(false);
    expect(isEmail("not an email")).toBe(false);
    expect(normalisePhone(" +91 98765-43210 ")).toBe("+919876543210");
    expect(normalisePhone("")).toBeNull();
    expect(isPhone(null)).toBe(true);
    expect(isPhone("+919876543210")).toBe(true);
    expect(isPhone("12345")).toBe(false);
  });

  it("sends only email, phone, first name, chart style and time zone, never birth details", () => {
    const body = eventBody("signup", contact, profile, { ...DEFAULT_PREFS, system: "western" });
    expect(body).toMatchObject({ event: "signup", email: "asha@example.com", phone: "+919876543210", name: "Asha", system: "western" });
    const text = JSON.stringify(body);
    for (const secret of ["2000-01-21", "12:46", "Cuttack", "20.46", "Rao"]) expect(text).not.toContain(secret);
  });

  it("sends just the email for visits and deletions", () => {
    expect(eventBody("visit", contact)).toEqual({ event: "visit", email: "asha@example.com" });
    expect(eventBody("delete", contact)).toEqual({ event: "delete", email: "asha@example.com" });
  });
});
