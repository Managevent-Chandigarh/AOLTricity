# Art of Living — Center Events Website

A simple, dependency-free website that lists upcoming **Satsangs**, **Long Kriyas** and
**Knowledge Sessions** across your centers. Visitors can search, filter by center or event
type, switch between a *by date* and a *by center* view, get directions, and call the center.

## Run it

- **Easiest:** double-click `index.html` — it opens in your browser and works offline.
- Or serve it locally: `python3 -m http.server 8000` in this folder, then open
  <http://localhost:8000>.

## Managing events (edit `data.js` only)

All centers and events live in one file: **`data.js`**. The listing and filters all
update automatically.

### 1. Define your centers

```js
const CENTERS = [
  {
    id: "city-center",              // short unique code — don't change it once events use it
    name: "City Center",
    address: "45, MG Road, opposite City Mall",
    phone: "+91 98450 00002",       // optional
  },
  // ...more centers
];
```

### 2. Add events

A **one-off event** (happens once):

```js
{
  id: "satsang-riverside-special",
  type: "satsang",                        // "satsang" | "long-kriya" | "knowledge-session"
  title: "Special Satsang with Senior Faculty",
  centerId: "riverside",                  // must match a center id above
  start: "2026-10-09T18:30",              // YYYY-MM-DD + T + 24-hour time (local)
  durationMin: 120,                       // optional, default 90
  host: "Visiting Faculty",               // optional
  description: "All are welcome.",        // optional
}
```

A **weekly recurring event** (e.g. every Sunday satsang) — the site shows the next
12 weeks automatically:

```js
{
  id: "satsang-green-meadows",
  type: "satsang",
  title: "Weekly Satsang",
  centerId: "green-meadows",
  weekly: { day: 0, time: "18:00" },      // day: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  durationMin: 90,
}
```

Notes:

- **Special programs** (for example a Janmashtami Celebration) are simply their own
  event entry, like any other — give them the event `title` and the `type` of program
  they mainly are (e.g. `"satsang"`).
- **Several types at once**: `type` also accepts an array — for example the sample
  `Janmashtami Celebration` event uses `type: ["satsang", "janmashtami"]`. The card
  shows a badge for each type.
- **Type filters combine with AND**: selecting *Satsang* + *Janmashtami* shows only
  events that carry **both** types (i.e. just the Janmashtami Celebration). With no
  type chip selected, every upcoming event is listed.
- **Adding a new type**: add one line to `EVENT_TYPES` at the top of `app.js`
  (e.g. `"navratri": { label: "Navratri" }`) and matching color rules in `styles.css`
  (copy the `.badge-janmashtami`, `.chip-janmashtami.active` and
  `.card.type-janmashtami` lines and swap in your colors).
- Past events disappear from the listing on their own; nothing to clean up.
- An event that has already started stays visible (marked **Happening now**) until its
  end time passes.
- To change how many weeks of recurring events are shown, adjust
  `WEEKLY_WEEKS_AHEAD` in `app.js`.

## The sample data is placeholder

The 4 centers and 6 events currently in `data.js` are **samples** — replace them with your
real centers and schedule.

## Putting it online

The folder is fully static, so any free static host works:

- **Netlify Drop** — drag the folder onto <https://app.netlify.com/drop>.
- **GitHub Pages** — push the folder to a repo, enable Pages in settings.
- Any web server — upload the 4 files (`index.html`, `styles.css`, `app.js`, `data.js`).

To update the site after deploying, edit `data.js` and re-upload it (or push).
