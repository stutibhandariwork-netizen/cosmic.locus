"use client";

import { useEffect, useId, useRef, useState } from "react";
import { searchPlaces, type Place } from "@/lib/places";
import { update, type Profile } from "@/lib/store";

/** Birth details form. Saves to this device only. */
export function ProfileForm({ initial, submitLabel = "Calculate my chart", onSaved }: { initial?: Profile | null; submitLabel?: string; onSaved?: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [birthDate, setBirthDate] = useState(initial?.birthDate ?? "");
  const [birthTime, setBirthTime] = useState(initial?.birthTime ?? "");
  const [timeUnknown, setTimeUnknown] = useState(initial ? initial.birthTime === null : false);
  const [place, setPlace] = useState<Profile["place"] | null>(initial?.place ?? null);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter a name.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || birthDate < "1800-01-01" || new Date(birthDate) > new Date()) return setError("Please check the date of birth.");
    if (!timeUnknown && !/^\d{2}:\d{2}$/.test(birthTime)) return setError("Enter your birth time, or tick “I don’t know my exact time”.");
    if (!place) return setError("Choose your birthplace from the list.");
    update((d) => ({ ...d, profile: { name: name.trim(), birthDate, birthTime: timeUnknown ? null : birthTime, place } }));
    onSaved?.();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div>
        <label htmlFor="name" className="label">
          Name
        </label>
        <input id="name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="birthDate" className="label">
            Date of birth
          </label>
          <input id="birthDate" type="date" className="field" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} min="1800-01-01" required />
        </div>
        <div>
          <label htmlFor="birthTime" className="label">
            Birth time
          </label>
          <input id="birthTime" type="time" className="field disabled:opacity-40" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} disabled={timeUnknown} />
        </div>
        <label className="col-span-2 flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-0.5 size-5 accent-[var(--primary)]" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} />
          <span>
            I don&apos;t know my exact time
            <span className="block text-xs text-muted">We&apos;ll read your chart from the Moon sign. Your rising sign (lagna) needs the exact time.</span>
          </span>
        </label>
      </div>
      <PlacePicker value={place} onChange={setPlace} />
      {error && (
        <p className="rounded-xl bg-warn-soft px-4 py-3 text-sm text-warn" role="alert">
          {error}
        </p>
      )}
      <button className="btn">{submitLabel}</button>
      <p className="text-center text-xs text-muted">Your details are saved only in this browser. Nothing is sent to a server.</p>
    </form>
  );
}

function PlacePicker({ value, onChange }: { value: Profile["place"] | null; onChange: (p: Profile["place"] | null) => void }) {
  const listId = useId();
  const [query, setQuery] = useState(value?.label ?? "");
  const [options, setOptions] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (value && query === value.label) return;
    clearTimeout(timer.current);
    if (query.trim().length < 2) {
      setOptions([]);
      return;
    }
    let cancelled = false;
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const found = await searchPlaces(query);
        if (!cancelled) {
          setOptions(found);
          setActive(0);
          setOpen(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer.current);
    };
  }, [query, value]);

  const choose = (p: Place) => {
    onChange({ label: p.label, latitude: p.latitude, longitude: p.longitude, timeZone: p.timeZone });
    setQuery(p.label);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor={`${listId}-input`} className="label">
        Birthplace
      </label>
      <input
        id={`${listId}-input`}
        className="field"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined}
        autoComplete="off"
        placeholder="Start typing a town or city"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(null);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (open && options[active]) choose(options[active]);
            return;
          }
          if (!open || !options.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, options.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && options.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-line bg-surface p-1 shadow-lg">
          {options.map((o, i) => (
            <li
              key={o.label + i}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={`cursor-pointer rounded-lg px-3 py-2.5 text-sm ${i === active ? "bg-surface-2" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(o)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
      <p className="hint">
        {value
          ? `Time zone: ${value.timeZone}, with historical changes applied.`
          : loading
            ? "Loading places…"
            : "Hindi and Odia spellings work too, e.g. कटक or କଟକ."}
      </p>
    </div>
  );
}
