"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Dribbble,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "./header-footer";
import { BookingDialog } from "./camps";
import { authConfigured } from "./providers";
import { databaseConfigured, createSupabaseClient } from "@/lib/supabase";
import { formatDate, formatPrice } from "@/lib/camps";

export default function EventDetails({ camp }) {
  const live = Boolean(camp.starts_at);
  const time = (value) =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/London",
    }).format(new Date(value));
  const facts = [
    [
      CalendarDays,
      "Date",
      live
        ? `${formatDate(camp.starts_at)}${camp.ends_at && formatDate(camp.ends_at) !== formatDate(camp.starts_at) ? ` – ${formatDate(camp.ends_at)}` : ""}`
        : "To be announced",
    ],
    [
      Clock3,
      "Time",
      live
        ? `${time(camp.starts_at)}${camp.ends_at ? ` – ${time(camp.ends_at)}` : ""} (UK time)`
        : "To be confirmed",
    ],
    [MapPin, "Location", camp.location || "To be confirmed"],
    [
      Users,
      "Age group",
      live ? `${camp.min_age}–${camp.max_age} years` : "To be confirmed",
    ],
  ];
  return (
    <>
      <SiteHeader />
      <main className="event-page section-wrap">
        <Link href="/#camps" className="event-back">
          <ArrowLeft size={18} />
          All basketball camps
        </Link>
        <section className={`event-banner ${camp.tone || "green-card"}`}>
          <div>
            <p className="section-kicker">{camp.tag || "BASKETBALL CAMP"}</p>
            <h1>{camp.title}</h1>
            <p>{camp.subtitle}</p>
          </div>
          <Dribbble aria-hidden="true" size={180} strokeWidth={0.8} />
        </section>
        <div className="event-layout">
          <div>
            <section className="event-section">
              <h2>About this camp</h2>
              <p>
                {camp.description ||
                  camp.subtitle ||
                  "Further details of this basketball camp will be announced here."}
              </p>
              <p className="mt-4">
                Physical literacy is at the heart of every Elevate camp. We use
                basketball to help young people develop movement skills, build
                confidence and discover the enjoyment that motivates them to
                stay active.
              </p>
            </section>
            <section className="event-section">
              <h2>The event at a glance</h2>
              <dl className="event-facts">
                {facts.map(([Icon, label, value]) => (
                  <div key={label}>
                    <Icon size={23} />
                    <div>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>
            <section className="event-section">
              <h2>Before you join us</h2>
              <p>
                {camp.arrival_information ||
                  "Arrival details, the activity programme and what to bring will be confirmed here before booking opens."}
              </p>
            </section>
          </div>
          <aside className="event-reservation">
            <span className="pill">
              {live && camp.booking_open ? "BASKETBALL CAMP" : "COMING SOON"}
            </span>
            <h2>Your place on court</h2>
            <p className="event-price">
              {live ? formatPrice(camp.price_pence) : "Price to be confirmed"}
            </p>
            <p>
              {live
                ? "Per participant for the whole camp. Reserve online and pay in person on the day of camp."
                : "Dates, ages, location and pricing will be added when this event is ready."}
            </p>
            {live && authConfigured && databaseConfigured ? (
              <BookingAction camp={camp} />
            ) : (
              <button className="button w-full" disabled>
                Booking opens soon
              </button>
            )}
            <Link href="/#camps" className="event-other">
              Explore other camps
            </Link>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
function BookingAction({ camp }) {
  const { getToken, isSignedIn, isLoaded, userId } = useAuth();
  const db = useMemo(
    () => createSupabaseClient(() => getToken?.() ?? null),
    [getToken],
  );
  const [open, setOpen] = useState(false);
  const available =
    camp.booking_open && Date.parse(camp.starts_at) > Date.now();
  if (!isLoaded) return <p role="status">Loading booking options…</p>;
  if (!available)
    return (
      <button className="button w-full" disabled>
        Booking closed
      </button>
    );
  return (
    <>
      {isSignedIn ? (
        <button className="button w-full" onClick={() => setOpen(true)}>
          Book a place
        </button>
      ) : (
        <SignInButton mode="modal">
          <button className="button w-full">Log in to book</button>
        </SignInButton>
      )}
      {open && isSignedIn && (
        <BookingDialog
          key={`${userId}:${camp.id}`}
          camp={camp}
          db={db}
          onClose={() => setOpen(false)}
          onComplete={() => window.location.assign("/#camps")}
        />
      )}
    </>
  );
}
export function LiveEvent({ id }) {
  const [camp, setCamp] = useState(null),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setCamp(null);
    setError("");
    if (!databaseConfigured || !id || !/^[0-9a-f-]{36}$/i.test(id)) {
      setError(
        "This event is unavailable. Please choose a camp from the home page.",
      );
      return;
    }
    createSupabaseClient()
      .from("camps")
      .select("*")
      .eq("id", id)
      .eq("published", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (active) {
          if (error || !data)
            setError(
              "We couldn’t load this event. Please try again or return to all camps.",
            );
          else setCamp(data);
        }
      })
      .catch(() => {
        if (active) setError("We couldn’t load this event. Please try again.");
      });
    return () => {
      active = false;
    };
  }, [id, attempt]);
  useEffect(() => {
    if (camp) document.title = `${camp.title} | Elevate Basketball`;
  }, [camp]);
  if (camp) return <EventDetails camp={camp} />;
  return (
    <>
      <SiteHeader />
      <main className="section-wrap">
        <h1 className="event-state-title">
          {error ? "Event unavailable" : "Loading event…"}
        </h1>
        <p role={error ? "alert" : "status"}>
          {error || "Getting the latest camp details."}
        </p>
        {error && (
          <button
            className="button mt-5"
            onClick={() => setAttempt((n) => n + 1)}
          >
            Try again
          </button>
        )}
        <Link className="event-back mt-5" href="/#camps">
          <ArrowLeft size={18} />
          All basketball camps
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
