Selection controls. In Pango the whole row is the hit target, not just the box — use `CheckRow` for lists of billable items.

```jsx
<CheckRow checked name="Rent" basis="Monthly rent for C4" amount="KES 52,000" onChange={toggle} />
<Switch checked={autoOn} onChange={toggleAuto} />
```

Checked rows tint to `--surface-inset` and firm their border; there is no coloured row highlight.
