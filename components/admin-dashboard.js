"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { londonInput } from "@/lib/admin-validation.mjs";

const money = (value) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    value / 100,
  );
const date = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "Europe/London",
  }).format(new Date(value));
function draft(camp) {
  return {
    ...Object.fromEntries(
      [
        "title",
        "subtitle",
        "tag",
        "description",
        "arrival_information",
        "location",
      ].map((key) => [key, camp[key] || ""]),
    ),
    start_local: londonInput(camp.starts_at),
    end_local: londonInput(camp.ends_at),
    min_age: camp.min_age,
    max_age: camp.max_age,
    capacity: camp.capacity,
    price_gbp: (camp.price_pence / 100).toFixed(2),
    published: camp.published,
    booking_open: camp.booking_open,
  };
}
async function request(url, options = {}) {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
    ...options,
  });
  const body = await response
    .json()
    .catch(() => ({ error: "Unable to load admin data." }));
  if (!response.ok) throw new Error(body.error || "Unable to load admin data.");
  return body;
}
export default function AdminDashboard() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  if (!isLoaded)
    return <main className="admin-access">Loading your account…</main>;
  if (!isSignedIn)
    return (
      <main className="admin-access">
        Please sign in again to manage camps.
      </main>
    );
  return <AdminWorkspace key={userId} />;
}
function AdminWorkspace() {
  const [camps, setCamps] = useState(null),
    [selected, setSelected] = useState(null),
    [error, setError] = useState(""),
    [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    request("/api/admin/camps/", { signal: controller.signal })
      .then(({ camps }) => {
        setCamps(camps);
        setSelected((current) => current || camps[0]?.id || null);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, [reload]);
  return (
    <main className="admin-main">
      <div className="admin-heading">
        <p className="section-kicker">ELEVATE BASKETBALL / ADMIN</p>
        <h1>Your camps.</h1>
        <p>Update your events and see who is joining each camp.</p>
      </div>
      {error ? (
        <div role="alert" className="admin-alert">
          {error} <button onClick={() => setReload((x) => x + 1)}>Retry</button>
        </div>
      ) : !camps ? (
        <p role="status">Loading camps…</p>
      ) : camps.length === 0 ? (
        <div className="admin-panel">
          No camps have been added to Supabase yet.
        </div>
      ) : (
        <div className="admin-grid">
          <aside className="admin-sidebar">
            <h2>
              All camps <span>{camps.length}</span>
            </h2>
            {camps.map((camp) => (
              <button
                key={camp.id}
                aria-current={camp.id === selected ? "true" : undefined}
                onClick={() => {
                  if (camp.id !== selected) setSelected(camp.id);
                }}
              >
                <strong>{camp.title}</strong>
                <span>{date(camp.starts_at)}</span>
                <small>
                  {camp.published ? "Published" : "Hidden"} ·{" "}
                  {camp.booking_open ? "Bookings open" : "Bookings closed"}
                </small>
              </button>
            ))}
          </aside>
          <CampEditor
            key={selected}
            camp={camps.find((c) => c.id === selected)}
            onSaved={(camp) =>
              setCamps((all) => all.map((c) => (c.id === camp.id ? camp : c)))
            }
          />
        </div>
      )}
    </main>
  );
}
function CampEditor({ camp, onSaved }) {
  const [form, setForm] = useState(() => draft(camp)),
    [tab, setTab] = useState("details"),
    [bookings, setBookings] = useState(null),
    [rosterError, setRosterError] = useState(""),
    [error, setError] = useState(""),
    [status, setStatus] = useState(""),
    [saving, setSaving] = useState(false),
    [reload, setReload] = useState(0);
  const dirty = JSON.stringify(form) !== JSON.stringify(draft(camp));
  useEffect(() => {
    const controller = new AbortController();
    setBookings(null);
    setRosterError("");
    request(`/api/admin/camps/${camp.id}/bookings/`, {
      signal: controller.signal,
    })
      .then((data) => setBookings(data.bookings))
      .catch((e) => {
        if (e.name !== "AbortError") setRosterError(e.message);
      });
    return () => controller.abort();
  }, [camp.id, reload]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  // Prevent a camp selection from discarding an unfinished edit.
  useEffect(() => {
    if (!dirty && !saving) return;
    const warn = (e) => {
      if (
        e.target.closest(".admin-sidebar button") &&
        (saving || !window.confirm("Discard your unsaved camp changes?"))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("click", warn, true);
    return () => document.removeEventListener("click", warn, true);
  }, [dirty, saving]);
  function change(e) {
    const { name, type, value, checked } = e.target;
    setStatus("");
    setForm((old) => ({
      ...old,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number" && name !== "price_gbp"
            ? Number(value)
            : value,
      ...(name === "published" && !checked ? { booking_open: false } : {}),
    }));
  }
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const { camp: updated } = await request(`/api/admin/camps/${camp.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onSaved(updated);
      setForm(draft(updated));
      setStatus("Camp saved. Your changes are available on the website.");
      setReload((x) => x + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }
  const field = (name, label, type = "text", props = {}) => (
    <label className={props.wide ? "admin-wide" : ""}>
      {label}
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={change}
        {...Object.fromEntries(
          Object.entries(props).filter(([k]) => k !== "wide"),
        )}
      />
    </label>
  );
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <h2>{camp.title}</h2>
        <p>
          {bookings
            ? `${bookings.length} booked · ${Math.max(0, camp.capacity - bookings.length)} places remaining`
            : `Capacity: ${camp.capacity}`}
        </p>
      </div>
      <div
        className="admin-tabs"
        role="tablist"
        aria-label="Camp administration"
      >
        <button
          role="tab"
          id="details-tab"
          aria-selected={tab === "details"}
          aria-controls="details-panel"
          onClick={() => setTab("details")}
        >
          Camp details
        </button>
        <button
          role="tab"
          id="bookings-tab"
          aria-selected={tab === "bookings"}
          aria-controls="bookings-panel"
          onClick={() => setTab("bookings")}
        >
          Bookings {bookings && `(${bookings.length})`}
        </button>
      </div>
      {tab === "details" ? (
        <form
          onSubmit={save}
          role="tabpanel"
          id="details-panel"
          aria-labelledby="details-tab"
        >
          <fieldset disabled={saving} className="admin-fields">
            {field("title", "Camp name", "text", {
              required: true,
              minLength: 2,
              maxLength: 100,
              wide: true,
            })}
            {field("subtitle", "Short introduction", "text", {
              maxLength: 300,
              wide: true,
            })}
            {field("tag", "Card label", "text", { maxLength: 40 })}
            {field("location", "Venue", "text", {
              required: true,
              minLength: 2,
              maxLength: 200,
            })}
            <p className="admin-wide admin-note">
              Dates and times use UK time (Europe/London). Enter the first day’s
              start and the last day’s finish.
            </p>
            {field("start_local", "Starts", "datetime-local", {
              required: true,
            })}
            {field("end_local", "Ends", "datetime-local", { required: true })}
            {field("price_gbp", "Price for the whole camp (£)", "number", {
              required: true,
              min: 0,
              max: 999999.99,
              step: "0.01",
            })}
            {field("capacity", "Capacity", "number", {
              required: true,
              min: 1,
              max: 1000,
            })}
            {field("min_age", "Minimum age", "number", {
              required: true,
              min: 3,
              max: 17,
            })}
            {field("max_age", "Maximum age", "number", {
              required: true,
              min: 3,
              max: 18,
            })}
            <label className="admin-wide">
              Camp description
              <textarea
                name="description"
                value={form.description}
                onChange={change}
                rows={6}
                maxLength={10000}
              />
            </label>
            <label className="admin-wide">
              Arrival information / what to bring
              <textarea
                name="arrival_information"
                value={form.arrival_information}
                onChange={change}
                rows={4}
                maxLength={5000}
              />
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={change}
              />
              Show on the website
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                name="booking_open"
                checked={form.booking_open}
                disabled={!form.published}
                onChange={change}
              />
              Accept bookings
            </label>
            <p className="admin-wide admin-note">
              Existing bookings retain their original price. Changes to the camp
              name and start date also update the booking record. Parents are
              not automatically notified.
            </p>
            <div className="admin-actions admin-wide">
              <button className="admin-primary" type="submit" disabled={!dirty}>
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                disabled={!dirty}
                onClick={() => {
                  setForm(draft(camp));
                  setError("");
                  setStatus("");
                }}
              >
                Discard changes
              </button>
              {dirty && <span>Unsaved changes</span>}
            </div>
          </fieldset>
          {error && (
            <p role="alert" className="admin-alert">
              {error}
            </p>
          )}
          {status && (
            <p role="status" className="admin-success">
              {status}
            </p>
          )}
        </form>
      ) : (
        <div role="tabpanel" id="bookings-panel" aria-labelledby="bookings-tab">
          <div className="admin-roster-heading">
            <p>Participant and guardian details for this camp.</p>
            <button onClick={() => setReload((x) => x + 1)}>
              Refresh bookings
            </button>
          </div>
          {rosterError ? (
            <p role="alert" className="admin-alert">
              {rosterError}
            </p>
          ) : !bookings ? (
            <p role="status">Loading bookings…</p>
          ) : bookings.length === 0 ? (
            <p className="admin-empty">No bookings yet for this camp.</p>
          ) : (
            <div className="admin-table-wrap">
              <table>
                <caption className="sr-only">Bookings for {camp.title}</caption>
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Guardian</th>
                    <th>Contact email</th>
                    <th>Consent</th>
                    <th>Booked price</th>
                    <th>Booked on</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <strong>{booking.participant_name}</strong>
                        <small>Age {booking.participant_age}</small>
                      </td>
                      <td>{booking.guardian_name}</td>
                      <td>{booking.contact_email}</td>
                      <td>{booking.guardian_consent ? "Yes" : "No"}</td>
                      <td>{money(booking.price_pence)}</td>
                      <td>{date(booking.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="admin-note">
            Booked price is the agreed camp price; it does not confirm payment.
          </p>
        </div>
      )}
    </section>
  );
}
