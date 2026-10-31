"use client";

import { useEffect, useId, useRef, useState } from "react";
import { searchPlaces, type Place } from "@/lib/places";
import { update, type Profile } from "@/lib/store";

/** Birth details form. Saves to this device only, or hands the details to `onSubmit` (onboarding). */
export function ProfileForm({
  initial,
  submitLabel = "Save",
  onSaved,
  onSubmit,
  pinned = false,
}: {
  initial?: Profile | null;
  submitLabel?: string;
  onSaved?: () => void;
  onSubmit?: (p: Profile) => void;
  /** Pin the button to the bottom of a full-height sheet. */
  pinned?: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [birthDate, setBirthDate] = useState(initial?.birthDate ?? "");
  const [birthTime, setBirthTime] = useState(initial?.birthTime ?? "");
  const [timeUnknown, setTimeUnknown] = useState(initial ? initial.birthTime === null : false);
  const [place, setPlace] = useState<Profile["place"] | null>(initial?.place ?? null);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("What should we call you? Add a name to carry on.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || birthDate < "1800-01-01" || new Date(birthDate) > new Date()) return setError("That birth date doesn't look quite right. Have another look?");
    if (!timeUnknown && !/^\d{2}:\d{2}$/.test(birthTime)) return setError("Add your birth time, or tick the box if you're not sure.");
    if (!place) return setError("Pick your birth place from the list as you type.");
    const profile = { name: name.trim(), birthDate, birthTime: timeUnknown ? null : birthTime, place };
    if (onSubmit) return onSubmit(profile);
    update((d) => ({ ...d, profile }));
    onSaved?.();
  }

  return (
    <form onSubmit={submit} className={`flex flex-col gap-3.5 ${pinned ? "flex-1" : ""}`} noValidate>
      <div>
        <label htmlFor="name" className="label">
          Your name
        </label>
        <input id="name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" placeholder="What should we call you?" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="min-w-0">
          <label htmlFor="birthDate" className="label">
            Birth date
          </label>
          <input id="birthDate" type="date" className="field px-3" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} min="1800-01-01" />
        </div>
        <div className="min-w-0">
          <label htmlFor="birthTime" className="label">
            Birth time
          </label>
          <input id="birthTime" type="time" className="field px-3" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} disabled={timeUnknown} />
        </div>
      </div>
      <label htmlFor="unknown" className="flex min-h-11 items-center gap-2.5 text-[15px] leading-snug">
        <input id="unknown" type="checkbox" className="size-[22px] shrink-0 accent-[var(--rust)]" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} />
        <span>I&apos;m not sure of my time. A rough guess helps, and you can update it later.</span>
      </label>
      <PlacePicker value={place} onChange={setPlace} />
      {error && (
        <p className="rounded-[14px] border-2 border-outline bg-warn-soft px-4 py-3 text-[15px]" role="alert">
          {error}
        </p>
      )}
      <button className={`btn btn-wide ${pinned ? "mt-auto" : "mt-2"}`}>{submitLabel}</button>
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
        Birth place
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
        placeholder="City, country"
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
        <ul id={listId} role="listbox" className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-[14px] border-2 border-outline bg-surface p-1 shadow-[4px_4px_0_var(--lilac)]">
          {options.map((o, i) => (
            <li
              key={o.label + i}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={`flex min-h-11 cursor-pointer items-center rounded-[10px] px-3 py-2 text-[15px] ${i === active ? "bg-surface-2 font-bold" : ""}`}
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
          ? `Found it. Time zone: ${value.timeZone}.`
          : loading
            ? "Looking through the map…"
            : "Start typing and pick your town from the list."}
      </p>
    </div>
  );
}
