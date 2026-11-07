# Design system

This design system is adopted incrementally. The shared tokens and components are used by the application shell (sidebar, header, and login screen), Dashboard, POS, Products, Sales, Invoices, and Clients; other business pages remain unmigrated.

## Tokens

Tokens are CSS custom properties with role-oriented names so a future dark theme can replace values without changing component intent. Utility aliases are exposed through Tailwind v4 `@theme`; for example, `bg-ds-brand`, `text-ds-muted`, `rounded-ds-md`, and `shadow-ds-sm`.

| Token | Default | Intended use |
|---|---|---|
| `--ds-brand` | `#5846E8` | Primary actions and brand emphasis |
| `--ds-brand-hover` | `#4937D3` | Hovered primary actions |
| `--ds-brand-soft` | `#F0EEFF` | Subtle brand surfaces |
| `--ds-brand-contrast` | `#FFFFFF` | Text/icons on the brand color |
| `--ds-accent` | `#4385F5` | Secondary emphasis |
| `--ds-accent-soft` | `#EAF1FF` | Subtle accent surfaces |
| `--ds-bg` | `#F4F5FA` | Application background |
| `--ds-surface` | `#FFFFFF` | Cards and controls |
| `--ds-surface-2` | `#F8F9FD` | Secondary surfaces |
| `--ds-text` | `#171827` | Main text and headings |
| `--ds-text-muted` | `#62677A` | Supporting text |
| `--ds-border` | `#E0E3ED` | Dividers and control borders |
| `--ds-success` / `--ds-success-soft` | `#168568` / `#E7F4EF` | Successful states only |
| `--ds-danger` / `--ds-danger-soft` | `#B3261E` / `#FCEAEC` | Errors and destructive states |
| `--ds-warning` / `--ds-warning-soft` | `#B85A12` / `#FFF0E4` | Warnings only |
| `--ds-info` | `#4385F5` | Informational states |
| `--ds-radius-sm` / `md` / `lg` | `0.5rem` / `0.75rem` / `1rem` | Small, standard, and large corners |
| `--ds-shadow-sm` / `md` | subtle / medium | Low and medium elevation |
| `--ds-touch-target` | `44px` | Minimum interactive target height |

Use warning tokens only to communicate a warning. Orange used decoratively or for ordinary emphasis should map to the brand or accent role instead.

## Shared components

Import components from `src/components/ui` or individual files. The shell currently uses Badge on synchronization and notification states, and Button, Card, and Input on Login.

### Button

```tsx
import { Button } from './components/ui';

<Button variant="primary" size="md" onClick={save}>Save</Button>
<Button variant="secondary" size="sm" loading>Saving</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger" disabled>Delete</Button>
```

### Card

```tsx
import { Card } from './components/ui';

<Card aria-label="Account summary">Account details</Card>
```

### PageHeader

```tsx
import { Button, PageHeader } from './components/ui';

<PageHeader
  title="Products"
  description="Manage the store catalog."
  actions={<Button>Add product</Button>}
/>
```

### Badge

```tsx
import { Badge } from './components/ui';

<Badge variant="success">Active</Badge>
<Badge variant="danger">Blocked</Badge>
<Badge variant="warning">Needs attention</Badge>
<Badge variant="info">Information</Badge>
<Badge variant="neutral">Draft</Badge>
```

### Input

```tsx
import { Input } from './components/ui';

<Input
  label="Email"
  type="email"
  helpText="Use your work email."
  error={emailError}
  value={email}
  onChange={event => setEmail(event.target.value)}
/>
```

### Select

```tsx
import { Select } from './components/ui';

<Select label="Currency" value={currency} onChange={event => setCurrency(event.target.value)}>
  <option value="DT">DT</option>
  <option value="EUR">EUR</option>
</Select>
```

### EmptyState

```tsx
import { Button, EmptyState } from './components/ui';

<EmptyState
  title="No products yet"
  description="Add a product to get started."
  action={<Button>Add product</Button>}
/>
```

The shared form controls use logical text alignment, associated labels, accessible error/help descriptions, visible focus, and 16px text to support RTL layouts and prevent automatic mobile browser zoom.

## Migration correspondence

This mapping records the migration applied to the application shell and provides guidance for later page-by-page migration.

| Existing color / class | Target token | Mapping note |
|---|---|---|
| `#5846E8`, `bg-indigo-600` (when used as the primary brand) | `--ds-brand` | Primary actions and brand identity |
| `#4937D3`, `bg-indigo-700` (hover on brand) | `--ds-brand-hover` | Brand hover state |
| `#F0EEFF`, `bg-indigo-50` (decorative brand surface) | `--ds-brand-soft` | Soft brand background |
| `#4385F5`, `text-blue-600` (informational accent) | `--ds-accent` or `--ds-info` | Accent emphasis or informational state |
| `#EAF1FF`, `bg-blue-50` (accent surface) | `--ds-accent-soft` | Soft accent background |
| `#F4F5FA`, `bg-[#F6F7FB]` | `--ds-bg` | Page background |
| `#FFFFFF`, `bg-white` | `--ds-surface` | Cards and controls |
| `#F8F9FD`, `bg-[#F8F9FD]` | `--ds-surface-2` | Secondary surface |
| `#171827`, `text-slate-900`, `text-gray-900` | `--ds-text` | Replace near-black text with role-based text |
| `#62677A`, `text-slate-500`, `text-gray-500` | `--ds-text-muted` | Supporting text |
| `#E0E3ED`, `border-slate-200` | `--ds-border` | Borders and separators |
| `#168568`, `text-emerald-700` | `--ds-success` | Positive state |
| `#E7F4EF`, `bg-emerald-50` | `--ds-success-soft` | Positive state surface |
| `#B3261E`, `text-red-700` | `--ds-danger` | Error/destructive state |
| `#FCEAEC`, `bg-rose-50` | `--ds-danger-soft` | Error/destructive surface |
| `#B85A12`, orange classes used for a warning | `--ds-warning` | Use only for an actual warning |
| `#FFF0E4`, orange soft classes used for a warning | `--ds-warning-soft` | Use only for an actual warning |
| Orange classes used for decoration or ordinary emphasis | `--ds-brand` or `--ds-accent` | Do not use warning colors semantically |
| Black/gray foreground classes (`text-black`, `text-gray-*`, `text-slate-*`) | `--ds-text` / `--ds-text-muted` | Avoid pure black; select by text role |
| Gray/white background classes (`bg-gray-*`, `bg-slate-*`, `bg-white`) | `--ds-surface` / `--ds-surface-2` | Select by surface role |
| `rounded-lg`, `rounded-xl`, `rounded-2xl` | `--ds-radius-sm` / `md` / `lg` | Map by actual component scale |
| Existing shadow utilities | `--ds-shadow-sm` / `--ds-shadow-md` | Select by desired elevation |

## Migration 2: application shell

Migrated files:

- `src/App.tsx`: sidebar navigation, sidebar status cards, header, notifications, and the main application container.
- `src/components/Login.tsx`: login form, actions, card, and error state.

The route list, role/permission filters, authentication flows, notifications, synchronization handlers, and sign-out handler were kept unchanged. Existing brand identity remains rendered through `BrandLogo` and the centralized brand configuration. Business pages are not yet migrated.

## Migration 3: Dashboard

Migrated files:

- `src/components/Dashboard.tsx`: dashboard cards, reports, alerts, tables, modal content, loading and empty states.
- `src/components/SalesVolumeChart.tsx`: chart palette, grid, tooltip, and surrounding controls.

The migration uses `Card`, `PageHeader`, `Badge`, `Button`, and `EmptyState` where they replace existing presentation blocks. Dashboard colors now use `ds-*` utilities; Recharts colors use the matching CSS variables. Violet/blue are used for brand and neutral emphasis, green for positive results, red for errors or stockouts, and orange only for warnings. Decorative orange emphasis was moved to brand/accent colors. No original hard-coded colors were intentionally retained.

Color inventory used a case-insensitive hex-color match and a Tailwind color-palette utility match (`bg`, `text`, `border`, `from`, `via`, `to`, `ring`, `shadow`, `fill`, and `stroke` with named palette colors). Against `main`, `Dashboard.tsx` had 180 hex occurrences and 471 palette utility occurrences; `SalesVolumeChart.tsx` had 70 and 18, respectively. Both files now have zero matches for either category.

Dashboard correspondence examples:

| Existing presentation | Dashboard target |
|---|---|
| Gray/white backgrounds and borders | `bg-ds-surface`, `bg-ds-surface-2`, `border-ds-border` |
| Gray/black text | `text-ds-text`, `text-ds-text-muted` |
| Violet/orange decorative emphasis | `ds-brand` / `ds-accent` |
| Green positive metrics | `ds-success` / `ds-success-soft` |
| Red errors and stockouts | `ds-danger` / `ds-danger-soft` |
| Orange low-stock warnings | `ds-warning` / `ds-warning-soft` |
| Recharts gradients and palette colors | `--ds-brand`, `--ds-accent`, `--ds-accent-soft`, and `--ds-border` |

Responsive grids, horizontally scrollable table containers, mobile field sizing, and touch target sizing were updated as presentation only. Firestore queries/subscriptions, calculations, filters, date/amount formatting, and role conditions were not changed. Visual verification on desktop/mobile and with Admin, Casier, and Technicien remains to be performed.

## Migration 4: POS and Products

Migrated files:

- `src/components/POS.tsx`: product selection, scanner controls, category filters, cart, totals, payment controls, and sale/credit result dialogs.
- `src/components/Products.tsx`: product header, search and category filters, responsive table, stock badges/actions, product form, category/security/delete/replenishment/history dialogs.

Presentation mapping used:

| Existing meaning | Design System mapping |
|---|---|
| Primary checkout, selected category, ordinary emphasis | `ds-brand` / `ds-brand-soft` |
| Secondary information and stock movement | `ds-accent` / `ds-accent-soft` |
| In-stock, successful scan, settled payment, positive benefit | `ds-success` / `ds-success-soft` |
| Out of stock, validation errors, deletion, loss | `ds-danger` / `ds-danger-soft` |
| Low stock, customer credit/debt, outstanding migration warning | `ds-warning` / `ds-warning-soft` |
| Neutral backgrounds, text, controls and dividers | `ds-surface`, `ds-surface-2`, `ds-text`, `ds-text-muted`, `ds-border` |

Color inventory used a hex-color search plus Tailwind palette utilities (`bg`, `text`, `border`, gradient, ring, shadow, fill, stroke, and divide). Against the branch baseline, POS had 124 hex and 155 palette matches; Products had 0 hex and 360 palette matches. Neither file has remaining matches in those categories.

Intentional fixed-color exceptions: the generated EAN-13 SVG in `Products.tsx` retains white background and black bars as literal SVG fills so the printed barcode remains high-contrast and independent of CSS variables. POS printing still renders through the existing `PrintableTicket`; its markup and print styling were not changed. No `ds-*` class or `var(--ds-*)` reference was added to the generated print HTML or ticket.

The Product type currently has no image field. POS product cards therefore show a neutral package icon as a visual placeholder rather than introducing image data or changing the product model. On mobile, cart details can be collapsed while the checkout summary and payment actions remain rendered; the product grid and cart have `min-w-0`/scroll containment, and form fields use the shared controls with touch-sized targets.

Firestore queries, sale and stock calculations, scan handling, writes, validation handlers, role checks, and product fields were kept unchanged. Visual verification of a complete sale, printed ticket, and product add/edit flow on desktop/mobile and with all three roles remains outstanding.

## Migration 5A: Sales, Invoices, and Clients

Migrated files:

- `src/components/Sales.tsx`: page summary, search/filter controls, sales table, sale details, deletion/security dialogs, and PDF/print actions.
- `src/components/Invoices.tsx`: sales/purchase invoice lists, invoice creation/detail dialogs, purchase entry/payment/cancellation forms, and related states.
- `src/components/Clients.tsx`: client search/list, debt filter/status, client form, and debt settlement dialog.

`PageHeader`, `Card`, `Badge`, `Button`, `Input`, `Select`, and `EmptyState` are used where they replace existing presentation blocks. Primary actions and selected filters use `ds-brand`; paid/received/success states use `ds-success`; partial debts and outstanding balances use `ds-warning`; deletion, cancellation, and errors use `ds-danger`; neutral surfaces, text, controls, and dividers use the corresponding `ds-*` roles. Forms use the shared 16px controls, and data tables remain horizontally scrollable on narrow screens.

The baseline had 210, 326, and 154 Tailwind palette-color utility matches in Sales, Invoices, and Clients, respectively. Using the same inventory, the remaining counts are 4, 7, and 2; these are only translucent black modal overlays and white-alpha highlights/loader borders. All chromatic palette-shade utilities and hex colors were removed (0 hex colors before and after), while the neutral overlays remain intentionally fixed for contrast.

Printing remains outside the migrated token styles: the existing `PrintableTicket` component and its portal markup were not changed, browser print handlers remain in place, and the purchase image-compression canvas is untouched. No `ds-*` or `var(--ds-*)` references were added to printable content or canvas output.

Firestore subscriptions, query conditions, calculations, permissions, invoice/client workflows, and print/PDF handlers were preserved. Desktop/mobile rendering and the complete print flow still require visual verification.

The existing Clients page has no client purchase-history/detail view in its baseline, so this visual migration did not add one or introduce a new history query.
