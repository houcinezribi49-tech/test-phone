# Design system

This design system is adopted incrementally. The shared tokens and components are used by the application shell (sidebar, header, and login screen); business pages remain unmigrated.

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
