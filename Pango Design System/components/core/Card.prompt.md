Containers. `Card` for anything on the app background, `InsetPanel` for a panel nested inside a card, `DarkPanel` for AI briefs and running totals.

```jsx
<Card interactive onClick={open}>…property summary…</Card>
<Card padding="18px 20px"><InsetPanel>…floor grid…</InsetPanel></Card>
<DarkPanel padding="24px 26px" radius="var(--r-18)">…portfolio intelligence…</DarkPanel>
```

Cards never carry a resting shadow — depth appears only on hover (`interactive`) or when floating as a sheet.
