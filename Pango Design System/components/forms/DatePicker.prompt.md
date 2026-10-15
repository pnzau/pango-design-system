```jsx
const [day, setDay] = React.useState('2026-09-18');

<DatePicker value={day} onChange={setDay} max={todayISO} />
<DatePicker value={due} onChange={setDue} min={todayISO} clearable={false} placeholder="Due date" />
<MonthPicker value={period} onChange={setPeriod} placeholder="Billing period" />
```

Values are ISO strings — `YYYY-MM-DD` for `DatePicker`, `YYYY-MM` for `MonthPicker`.
Never reach for `<input type="date">`: the native picker renders the browser's own
chrome and blue, which nothing in this system matches.
