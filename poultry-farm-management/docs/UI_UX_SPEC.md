# UI/UX Specification

## Design direction
Clean, calm, practical, mobile-first. The app should feel like a reliable farm tool rather than an accounting package.

## Navigation
### Mobile
Use bottom navigation for the most frequent areas:
- Home
- Eggs
- Money
- History
- More

Primary actions should be reachable without opening a complex menu.

### Desktop/tablet
Use a compact sidebar navigation with the same information architecture.

## Core screens
1. Dashboard
2. Collect eggs
3. Sell eggs / income
4. Record expense
5. History
6. Flocks overview

## Dashboard
Prioritize:
- Current egg stock
- Today's collection
- Today's sales/revenue
- Today's expenses
- Today's/selected-period profit
- Simple trend indicators

## Interaction principles
- One focused task per form.
- Large touch targets.
- Minimal typing.
- Sensible defaults for date and common categories.
- Confirmation after financial/inventory transactions.
- Clear validation errors.
- Never hide important consequences.

## Visual system
- Typography: Geist preferred; Inter is acceptable fallback.
- UI library: shadcn/ui.
- Styling: Tailwind CSS.
- Use restrained colors with semantic states rather than decorative color.
- Use cards sparingly for dashboard summaries.
- Use tables for history on larger screens and compact list rows on mobile.
- Icons should reinforce labels, not replace them.

## Accessibility
- High readable contrast.
- Keyboard support on desktop.
- Labels for every form control.
- Do not communicate status by color alone.
- Comfortable touch targets.

## Design responsibility
The implementation agent may refine spacing, exact palette, and component composition while preserving the information architecture and usability principles above.
