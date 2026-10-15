KPI tile for the top of a dashboard. Lay them out in `repeat(auto-fit,minmax(190px,1fr))` with a 14px gap.

```jsx
<StatCard label="Total units" value="30" trend="26 occupied" trendColor="var(--paid)" />
<StatCard label="Unpaid Rent" value="KES 390,850" trend="5 unpaid tenants" trendColor="var(--overdue-fg)" valueColor="var(--overdue-fg)" />
```
