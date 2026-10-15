# Pango app — UI kit

A high-fidelity recreation of the Pango landlord/manager dashboard, rebuilt from the
app's own source. Every screen composes the design system's primitives — nothing is
re-implemented locally.

Open `index.html`. You land on the sign-in screen; sign in to reach the dashboard,
then use the sidebar to move between surfaces. It is a click-through, not a working
product: data is static and destructive actions are inert.

## Screens

| File | Surface |
|---|---|
| `login-screen.jsx` | Split sign-in — dark gradient brand panel + white form |
| `shell.jsx` | Sidebar, role switcher, user block, sticky page header |
| `properties-screen.jsx` | Portfolio dashboard: AI brief, pending payment verifications, month stepper, KPI row, property cards with floor grids |
| `property-detail-screen.jsx` | One property: KPI row, full building layout, amenities, unit sheet |
| `billing-screen.jsx` | Invoice table with filters, plus the unpaid-rent list |
| `repairs-screen.jsx` | Repair timeline, spend by category, log-a-repair sheet |
| `vacancies-screen.jsx` | Shareable listing card (1:1 / 9:16), listing list, share panel |
| `verify-screen.jsx` | Tenant-facing flow: tick paid items, paste the M-Pesa/bank message |
| `insights-screen.jsx` | Projected income bar chart and opportunity cards |
| `managers-screen.jsx` | Team cards and the invite-a-manager sheet |

`data.js` holds the sample portfolio — four Nairobi properties, invoices, repairs,
listings, arrears and managers — copied from the app source.

## Deliberate omissions

The source has no imagery of its own: listing photos come from a drag-and-drop slot
the user fills. The share card therefore renders its empty state (a tinted grid) rather
than substituting stock photography.

Mobile behaviour (bottom-sheet nav, single-column grids at `max-width: 860px`) exists in
the source and is documented in the readme, but this kit is laid out for desktop.
