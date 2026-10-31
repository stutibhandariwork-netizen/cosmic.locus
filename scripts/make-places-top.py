"""Builds public/places-top.json: the biggest places from public/places.json (which is sorted
by population), so the birth-place search can answer common queries before the full list arrives.
Keeps the 2,000 largest places in India (with Indian-script spellings) and the 1,000 largest
elsewhere (Latin names only), to stay small. Run: python3 -I scripts/make-places-top.py"""
import json, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
rows = json.loads((root / "public/places.json").read_text())
INDIC = re.compile(r"[\u0900-\u0DFF]")  # Devanagari to Malayalam, including Odia
def indic_alts(alts):
    return "|".join(a for a in alts.split("|") if a and INDIC.search(a))
india = [r[:1] + [indic_alts(r[1])] + r[2:] for r in rows if r[3] == "India"][:2000]
world = [r[:1] + [""] + r[2:] for r in rows if r[3] != "India"][:1000]
order = {r[0] + r[2] + r[3]: i for i, r in enumerate(rows)}
top = sorted(india + world, key=lambda r: order[r[0] + r[2] + r[3]])
(root / "public/places-top.json").write_text(json.dumps(top, ensure_ascii=False, separators=(",", ":")))
print(len(top), "places")
