"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowUpRight,
  Dribbble,
  X,
  CheckCircle,
} from "lucide-react";
import { authConfigured } from "./providers";
import { createSupabaseClient, databaseConfigured } from "@/lib/supabase";
import {
  placeholderCamps,
  formatDate,
  formatPrice,
  campHref,
} from "@/lib/camps";

export default function Camps() {
  return databaseConfigured ? <PublicCamps /> : <CampGrid camps={placeholderCamps} />;
}

function CampGrid({ camps }) {
  const placeholders = camps.every((camp) => !camp.starts_at);
  return (
    <>
      {placeholders && (
        <div className="preview-note">
          <span className="status-dot" />
          Our camp line-up is taking shape. Dates and booking details coming
          soon.
        </div>
      )}
      <div
        className="camp-grid"
        style={{ marginTop: placeholders ? undefined : 30 }}
      >
        {camps.map((camp, i) => {
          const live = Boolean(camp.starts_at);
          const available =
            live &&
            camp.booking_open &&
            Date.parse(camp.starts_at) > Date.now();
          return (
            <article className="camp-card" key={camp.id}>
              <div
                className={`camp-art ${["peach-card", "green-card", "yellow-card"][i % 3]}`}
              >
                <span>{camp.tag || "BASKETBALL CAMP"}</span>
                <Dribbble className="camp-ball" size={146} strokeWidth={0.8} />
                <span className="camp-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="camp-body">
                <span className="pill">
                  {available ? "BOOKING OPEN" : "COMING SOON"}
                </span>
                <h3>
                  <Link className="camp-detail-link" href={campHref(camp)}>
                    {camp.title}
                  </Link>
                </h3>
                <p>{camp.subtitle}</p>
                <ul>
                  <li>
                    <CalendarDays />
                    {live
                      ? formatDate(camp.starts_at)
                      : "Dates to be announced"}
                  </li>
                  <li>
                    <MapPin />
                    {camp.location || "Location to be confirmed"}
                  </li>
                  <li>
                    <Users />
                    {live
                      ? `Ages ${camp.min_age}–${camp.max_age}`
                      : "Age groups to be confirmed"}
                  </li>
                </ul>
                <div className="camp-bottom">
                  <span>
                    {live
                      ? `${formatPrice(camp.price_pence)} per participant`
                      : "Details coming soon"}
                  </span>
                  <Link className="camp-details-button" href={campHref(camp)}>
                    View event details <ArrowUpRight size={17} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

// Published camps are public data. Never wait for Clerk or request a session
// token here; Supabase's anon SELECT policy permits only published records.
function PublicCamps() {
  const db = useMemo(() => createSupabaseClient(), []);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 15000);
    setLoading(true);
    setError("");
    async function load() {
      try {
        const result = await db.from("camps").select("*")
          .eq("published", true)
          .gt("starts_at", new Date().toISOString())
          .order("starts_at")
          .abortSignal(controller.signal);
        if (result.error) throw result.error;
        if (active) setCamps(result.data || []);
      } catch {
        if (active) setError("We couldn’t load the camps. Please try again.");
      } finally {
        clearTimeout(timeout);
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [db, attempt]);

  return <>
    {loading ? <p className="py-10" role="status">Loading camps…</p>
      : error ? <div className="py-8" role="alert"><p>{error}</p>
        <button className="button mt-4" onClick={() => setAttempt(n => n + 1)}>Try again</button></div>
      : camps.length ? <CampGrid camps={camps} />
      : <p className="py-10">No upcoming camps are available yet. Please check back soon.</p>}
    {authConfigured && <MyBookings />}
  </>;
}

// An account error affects this section only, never the public camp listing.
function MyBookings() {
  const { getToken, isSignedIn, isLoaded, userId } = useAuth();
  const db = useMemo(() => createSupabaseClient(() => getToken?.() ?? null), [getToken]);
  const [result, setResult] = useState({ userId: null, bookings: [], loading: true, error: "" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return;
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 15000);
    setResult({ userId, bookings: [], loading: true, error: "" });
    async function load() {
      try {
        const { data, error } = await db.from("bookings")
          .select("id,participant_name,camp_title,starts_at,price_pence,created_at")
          .order("created_at", { ascending: false }).abortSignal(controller.signal);
        if (error) throw error;
        if (active) setResult({ userId, bookings: data || [], loading: false, error: "" });
      } catch {
        if (active) setResult({ userId, bookings: [], loading: false,
          error: "We couldn’t load your bookings. You can still browse the camps above." });
      } finally { clearTimeout(timeout); }
    }
    load();
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [db, isLoaded, isSignedIn, userId, attempt]);

  if (!isLoaded || !isSignedIn) return null;
  const current = result.userId === userId;
  return <section className="mt-10" aria-label="My bookings">
    <h3 className="text-xl font-bold mb-4">My bookings</h3>
    {!current || result.loading ? <p role="status">Loading your bookings…</p>
      : result.error ? <div role="alert"><p>{result.error}</p>
        <button className="button mt-4" onClick={() => setAttempt(n => n + 1)}>Try again</button></div>
      : result.bookings.length ? <ul className="grid gap-3">{result.bookings.map(b =>
        <li className="rounded-md border border-[#d4dbce] p-5 flex flex-wrap justify-between gap-3" key={b.id}>
          <div><strong>{b.camp_title}</strong><p className="mt-1">{b.participant_name} · {formatDate(b.starts_at)}</p></div>
          <span>Place reserved · {formatPrice(b.price_pence)}</span>
        </li>)}</ul> : <p>You haven’t booked a camp yet.</p>}
  </section>;
}

export function BookingDialog({ camp, db, onClose, onComplete = onClose }) {
  const ref = useRef(null);
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  
  async function submit(event) {
    event.preventDefault();
    if (busyRef.current) return;
    const fields = new FormData(event.currentTarget);
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      const { data, error: failure } = await db.rpc("book_camp", {
        p_camp_id: camp.id,
        p_participant_name: fields.get("participant").trim(),
        p_age: Number(fields.get("age")),
        p_guardian_name: fields.get("guardian").trim(),
        p_contact_email: fields.get("email").trim(),
        p_guardian_consent: fields.get("consent") === "on",
      });
      if (failure) throw failure;
      setConfirmation(data);
    } catch (failure) {
      const messages = {
        CAMP_FULL: "This camp has just filled up. Please choose another camp.",
        CAMP_CLOSED: "Booking is now closed for this camp.",
        AGE_NOT_ELIGIBLE:
          "Please check the participant’s age against this camp’s age range.",
        INVALID_DETAILS: "Please check your details and guardian confirmation.",
        AUTH_REQUIRED: "Please log in again before booking.",
      };
      setError(
        messages[failure.message] ||
          "We couldn’t confirm your booking. Please retry; if it was saved, the same booking will be returned.",
      );
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={ref}
      className="booking-dialog"
      aria-labelledby="booking-title"
      onCancel={(e) => {
        if (busy) {
          e.preventDefault();
        } else onClose();
      }}
    >
      <button
        className="dialog-close"
        onClick={onClose}
        disabled={busy}
        aria-label="Close booking"
      >
        <X />
      </button>
      {confirmation ? (
        <div role="status">
          <CheckCircle size={40} className="mb-5" />
          <h2 id="booking-title">You’re on the team.</h2>
          <p className="mt-5">
            A place is reserved for {confirmation.participant_name} at{" "}
            {camp.title}.
          </p>
          <p className="mt-3">
            {formatDate(camp.starts_at)} · {camp.location}
          </p>
          <p className="mt-3 text-sm">Booking reference: {confirmation.id}</p>
          <p className="mt-3">
            Camp price: {formatPrice(confirmation.price_pence)}. No payment has
            been taken.
          </p>
          <button className="button mt-6" onClick={onComplete}>
            View my bookings
          </button>
        </div>
      ) : (
        <>
          <span className="section-kicker">YOUR NEXT ADVENTURE</span>
          <h2 id="booking-title">{camp.title}</h2>
          <p className="mt-4 mb-5">
            {formatDate(camp.starts_at)} · {camp.location}
            <br />
            Ages {camp.min_age}–{camp.max_age} · {formatPrice(camp.price_pence)}
          </p>
          <form onSubmit={submit}>
            <label>
              Participant’s full name
              <input
                name="participant"
                required
                minLength={2}
                maxLength={100}
                autoComplete="off"
              />
            </label>
            <label>
              Age on the camp date
              <input
                name="age"
                type="number"
                required
                min={camp.min_age}
                max={camp.max_age}
                step="1"
              />
            </label>
            <label>
              Parent or guardian’s name
              <input
                name="guardian"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
              />
            </label>
            <label>
              Contact email
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
              />
            </label>
            <label className="consent">
              <input name="consent" type="checkbox" required />I am the
              participant’s parent or guardian and confirm these booking details
              are correct.
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <p className="text-sm mb-4">
              This reserves a place. No payment is taken online.
            </p>
            <button className="button w-full" disabled={busy}>
              {busy ? "Reserving your place…" : "Reserve a place"}
              <ArrowUpRight size={18} />
            </button>
          </form>
        </>
      )}
    </dialog>
  );
}
