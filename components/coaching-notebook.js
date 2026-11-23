"use client";
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

const sessionTemplate = `Group / year group:
Venue and equipment:
Physical literacy aim:
What will success look like?

0–5 min · Ball familiarisation
A basketball for each child: explore holding, rolling and moving the ball.

5–13 min · Dribbling
Activity and ways to make it easier or harder:

13–23 min · Lesson focus
Focus (ball familiarisation, dribbling, passing, shooting, layups or games):
Coaching cues:

23–40 min · Small games linked to the focus
Game 1:
Game 2:
Adaptations so everyone can take part:

40–45 min · Reflection
What did the children notice, enjoy or improve?

After the session
What worked?
What will I change next time?`;
const journalTemplate = `What happened?

What went well?

What did I notice about confidence, movement and enjoyment?

What could I do differently?

My next step:
`;
const label = kind => kind === 'session' ? 'Session plan' : 'Journal';
const today = () => new Intl.DateTimeFormat('en-CA', {timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
const fields = entry => ({kind: entry.kind, title: entry.title, entry_date: entry.entry_date, content: entry.content});
async function request(url, options = {}) {
  const response = await fetch(url, {cache: 'no-store', credentials: 'same-origin', ...options});
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Unable to load your notebook. Please try again.');
  return body;
}
export default function CoachingNotebook() {
  const {isLoaded, isSignedIn, userId} = useAuth();
  if (!isLoaded) return <main className="admin-access" role="status">Loading your account…</main>;
  if (!isSignedIn) return <main className="admin-access">Please sign in again to open your notebook.</main>;
  return <Notebook key={userId} />;
}
function Notebook() {
  const [entries, setEntries] = useState(null);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [baseline, setBaseline] = useState('');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);
  const busyRef = useRef(false);
  const dirty = draft !== null && JSON.stringify(draft) !== baseline;
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    request('/api/admin/notebook/', {signal: controller.signal})
      .then(({entries}) => setEntries(entries))
      .catch(e => {if (e.name !== 'AbortError') setError(e.message);});
    return () => controller.abort();
  }, [reload]);
  useEffect(() => {
    if (!dirty && !busy) return;
    const leave = e => {e.preventDefault(); e.returnValue = '';};
    const navigate = e => {
      const link = e.target.closest?.('a[href]');
      if (!link || link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (busy || !window.confirm('Leave without saving your notebook changes?')) {e.preventDefault(); e.stopPropagation();}
    };
    window.addEventListener('beforeunload', leave);
    document.addEventListener('click', navigate, true);
    return () => {window.removeEventListener('beforeunload', leave); document.removeEventListener('click', navigate, true);};
  }, [dirty, busy]);
  function canSwitch() {return !busyRef.current && (!dirty || window.confirm('Discard your unsaved notebook changes?'));}
  function open(entry) {
    if (!canSwitch()) return;
    const next = fields(entry);
    setSelected(entry); setDraft(next); setBaseline(JSON.stringify(next)); setError(''); setNotice('');
  }
  function create(kind) {
    if (!canSwitch()) return;
    setSelected(null); setDraft({kind, title: '', entry_date: today(), content: kind === 'session' ? sessionTemplate : journalTemplate});
    setBaseline(''); setError(''); setNotice('');
  }
  function refresh() {
    if (!canSwitch()) return;
    setDraft(null); setSelected(null); setEntries(null); setNotice(''); setReload(n => n + 1);
  }
  async function save(event) {
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setError(''); setNotice('');
    try {
      const {entry} = await request(selected ? `/api/admin/notebook/${selected.id}/` : '/api/admin/notebook/', {
        method: selected ? 'PATCH' : 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(selected ? {...draft, version: selected.version} : draft),
      });
      setEntries(current => [entry, ...(current || []).filter(item => item.id !== entry.id)]);
      setSelected(entry); setDraft(fields(entry)); setBaseline(JSON.stringify(fields(entry))); setNotice('Saved to your private notebook.');
    } catch (e) {setError(e.message + (!selected ? ' If the connection dropped, copy your notes and reload before retrying to check whether the entry was saved.' : ''));}
    finally {busyRef.current = false; setBusy(false);}
  }
  async function remove() {
    if (busyRef.current || !selected || !window.confirm(`Permanently delete “${selected.title}”? This also discards any unsaved changes.`)) return;
    busyRef.current = true; setBusy(true); setError(''); setNotice('');
    try {
      await request(`/api/admin/notebook/${selected.id}/`, {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({version: selected.version})});
      setEntries(current => current.filter(item => item.id !== selected.id)); setSelected(null); setDraft(null); setBaseline(''); setNotice('Entry deleted.');
    } catch (e) {setError(e.message);}
    finally {busyRef.current = false; setBusy(false);}
  }
  const visible = (entries || []).filter(entry => (filter === 'all' || entry.kind === filter) && `${entry.title} ${entry.content}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => b.entry_date.localeCompare(a.entry_date) || b.created_at.localeCompare(a.created_at));
  return <main className="admin-main">
    <div className="admin-heading"><p className="section-kicker">ELEVATE BASKETBALL / PRIVATE NOTEBOOK</p><h1>Space to reflect. Room to plan.</h1><p>Your coaching journal and session plans, available only through your administrator account.</p></div>
    <div className="admin-actions notebook-toolbar"><button className="admin-primary" disabled={busy || !entries} onClick={() => create('journal')}>New journal entry</button><button disabled={busy || !entries} onClick={() => create('session')}>New session plan</button><button disabled={busy} onClick={refresh}>Reload notebook</button></div>
    {error && <div className="admin-alert" role="alert">{error}</div>}
    {notice && <p className="admin-success" role="status">{notice}</p>}
    {!entries ? <p role="status">{error ? 'Your notebook could not be loaded. Check the notebook migration has been applied, then reload.' : 'Loading your notebook…'}</p> : <div className="admin-grid">
      <aside className="admin-sidebar notebook-sidebar" aria-label="Notebook entries">
        <h2>Your entries ({entries.length})</h2>
        <label>Search notes<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Title or words in your notes" /></label>
        <label>Show<select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All entries</option><option value="journal">Journal</option><option value="session">Session plans</option></select></label>
        {visible.length ? visible.map(entry => <button key={entry.id} disabled={busy} aria-current={selected?.id === entry.id} onClick={() => open(entry)}><small>{label(entry.kind)} · {new Intl.DateTimeFormat('en-GB', {dateStyle: 'medium', timeZone: 'UTC'}).format(new Date(`${entry.entry_date}T12:00:00Z`))}</small><strong>{entry.title}</strong></button>) : <p>{entries.length ? 'No matching entries.' : 'Start with a journal entry or plan your next session.'}</p>}
      </aside>
      <section className="admin-panel" aria-label="Entry editor">
        {!draft ? <div className="admin-empty"><h2>Your next session starts here.</h2><p>Choose an entry or create a new one. Session plans include an editable 45-minute basketball template.</p></div> : <form onSubmit={save}>
          <div className="admin-panel-heading"><h2>{selected ? 'Edit' : 'New'} {label(draft.kind).toLowerCase()}</h2><p>Use Save entry to keep your changes.</p></div>
          <fieldset className="admin-fields" disabled={busy}>
            <label className="admin-wide">Title<input required maxLength={160} value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} placeholder={draft.kind === 'session' ? 'e.g. KS2 · Passing and moving' : 'e.g. Reflections from Monday’s club'} /></label>
            <label>{draft.kind === 'session' ? 'Session date' : 'Journal date'}<input type="date" required value={draft.entry_date} onChange={e => setDraft({...draft, entry_date: e.target.value})} /></label>
            <label className="admin-wide">{draft.kind === 'session' ? 'Session plan and reflection' : 'Your reflections'}<textarea rows={24} maxLength={20000} value={draft.content} onChange={e => setDraft({...draft, content: e.target.value})} /></label>
            <p className="admin-note admin-wide">{draft.content.length.toLocaleString()} / 20,000 characters</p>
          </fieldset>
          <div className="admin-actions notebook-toolbar"><button className="admin-primary" type="submit" disabled={busy || !dirty}>{busy ? 'Please wait…' : 'Save entry'}</button>{selected && <button type="button" disabled={busy} onClick={remove}>Delete entry</button>}<span role="status">{dirty ? 'Unsaved changes' : 'All changes saved'}</span></div>
        </form>}
      </section>
    </div>}
  </main>;
}
