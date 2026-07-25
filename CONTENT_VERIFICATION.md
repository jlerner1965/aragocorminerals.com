# Content Verification — Punch List

Internal tracking document. **Not linked from any page** and not part of the
public site. It records every unverified fact that was pulled from the site
during the `[CONFIRM:]` placeholder cleanup, so the real value can be restored
once it exists and is documented.

- Scope: all `[CONFIRM:]` editorial placeholders that previously rendered as
  visible text on the public pages.
- Related commits: `0d916e5` (Science composition module), `565dd02` (sitewide
  cleanup across index / about / contact).
- Last updated: 2026-07-25.

**Disposition key**
- **Removed** — the stat/card/section/chapter was deleted because it depended
  entirely on the unknown fact; surrounding content was rebalanced so the page
  asserts only what is true.
- **Rewritten** — the placeholder was replaced with a true, conservative fallback
  that commits to nothing unverified. The underlying fact is still withheld until
  confirmed.

> Legal boundary (do not lose): logistics/inventory copy may state origin and
> the Stockton **distribution location** only. Do NOT restore "our port,"
> "our inventory," "our freight," "contracted carriers," or any owned/contracted
> asset language without contractual proof — flag such phrasing for James first.
> NSF / potable-water certification must not be claimed; it is not held.

---

## Company & identity facts

| # | Unverified fact | Page · Section | Disposition | Evidence needed to restore |
|---|---|---|---|---|
| 1 | Founder / company principals + titles + background | about.html · "Company background" (Who is behind AragoCor) | Removed (whole section deleted) | Names, titles and roles of principals; verifiable background |
| 2 | Founder / company principals + their roles | index.html · "Our story" company-facts grid (Leadership) | Removed (grid deleted) | Same as #1 |
| 3 | Founding year / legal formation record | about.html · "Company background" (Company formation) | Removed (section deleted) | Incorporation / legal formation record with date |
| 4 | Founding year | about.html · Mission stat strip (Company formation card) | Removed (card deleted; strip rebalanced to Bahamas + Stockton) | Incorporation / formation date |
| 5 | Founding year | index.html · "Our story" grid (Company formation) | Removed (grid deleted) | Incorporation / formation date |
| 6 | Founding year + principals + original company purpose | about.html · Timeline (Chapter "Company formation") | Removed (chapter deleted; timeline renumbered) | Formation record + principals + documented original purpose |
| 7 | Years of operating history attributable to AragoCor | about.html · "Company background" (Operating tenure) | Removed (section deleted) | Documented operating tenure specific to AragoCor |
| 8 | Years operating | about.html · Mission stat strip (Operating history card) | Removed (card deleted) | Documented operating tenure |
| 9 | Years of operating history | index.html · "Our story" grid (Operating history) | Removed (grid deleted) | Documented operating tenure |

## Source, sourcing partner, licensing & chain of custody

| # | Unverified fact | Page · Section | Disposition | Evidence needed to restore |
|---|---|---|---|---|
| 10 | Named Bahamian sourcing/harvest partner, license holder, each party's role, current agreement status | about.html · Origin section (callout) | Removed | Named partner + license holder + each party's role + current signed agreement status |
| 11 | Named source/harvest partner, license holder and chain of custody | about.html · Source-to-supply ("Source relationship" card) | Removed (card deleted; sequence renumbered 7→6) | Named source/harvest partner + license holder + chain-of-custody documentation |
| 12 | Named Bahamian sourcing/harvest partner + exact commercial relationship | about.html · Timeline (Chapter "Supply relationship") | Removed (chapter deleted; timeline renumbered) | Named partner + documented commercial relationship |
| 13 | Named Bahamian sourcing/harvest partner + exact relationship | index.html · "Our story" grid (Bahamian source relationship) | Removed (grid deleted) | Named partner + documented relationship |
| 14 | Exact sourcing / harvest-partner / licensing relationship | index.html · Process timeline Step 02 | Rewritten — kept true part ("Natural Bahamian oolitic origin is identified for the material"); step retitled "Source verification" → "Source identification" | Named harvest partner + license holder + agreement, to restore a full "source verification" claim |

## Logistics / freight

| # | Unverified fact | Page · Section | Disposition | Evidence needed to restore |
|---|---|---|---|---|
| 15 | Owned or contracted trucking, rail, port, warehouse or shipping relationship | about.html · Source-to-supply ("Freight & delivery" card) | Rewritten → "Distributed from Stockton, California." | Contractual proof of any owned/contracted logistics asset **before** naming it (see legal boundary above) |

## Response time

| # | Unverified fact | Page · Section | Disposition | Evidence needed to restore |
|---|---|---|---|---|
| 16 | Response-time window the team can consistently meet | contact.html · "Response-time commitment" | Rewritten → "We respond to qualified inquiries as promptly as we can." | An operationally committed response SLA the team can consistently meet |

## Lab / analytical documentation (Science composition module)

These were framed conservatively as "available on request" rather than removed,
because the true fallback (documentation on request) holds. Restore specific
values only when a real lab assay exists.

| # | Unverified fact | Page · Section | Disposition | Evidence needed to restore |
|---|---|---|---|---|
| 17 | Current certified laboratory assay | science.html · Composition "Data status" (Certified assay) | Rewritten → "Current specification and any available lot-specific assay supplied on request." | A current lab-issued certified assay |
| 18 | Test methods used for each reported value | science.html · Composition "Data status" (Test methods) | Rewritten → "Characterization methods … available to support evaluation." | Documented analytical method behind each reported value |
| 19 | Sample / lot ID and report date | science.html · Composition "Data status" (Lot identity) | Rewritten → "Sample or lot identification provided with current documentation on request." | A real COA with lot ID + report date |
| 20 | Lab-issued specification PDF (certified-spec download) | science.html · assay-fields disclosure | Rewritten → "These fields are provided in current lot documentation on request." | A real lab-issued specification PDF (e.g. `resources/AragoCor_Technical_Data_Sheet.pdf`, not yet in repo) |

---

## Also still withheld (never placed on the site; confirm before adding)

Per the Trust Assets brief, these cannot be sourced or synthesized and must come
from James before any use:

- Actual per-lot numbers for iron (Fe₂O₃), brightness, bulk density, particle-size
  distribution — every one stays "request current documentation."
- A named analytical lab (none on record).
- A real direct phone number (the old `+1 855 751-9100` was placeholder — omitted).
- A named contact person with title.
- NSF / potable-water certification (do not claim; not held).
- Customer names, case studies, testimonials, tonnage-shipped figures.
- Representative surface-area figures (~1.8 m²/g aragonite vs ~0.55 m²/g GCC) were
  rendered qualitatively in the Science comparison table pending confirmation of
  the internal value.
