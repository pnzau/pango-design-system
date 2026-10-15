```jsx
const [amount, setAmount] = React.useState('1250.50');

<NumberInput value={amount} onChange={setAmount} prefix="EUR" align="right" />
<NumberInput value={qty} onChange={setQty} suffix="units" />
<NumberInput value={reading} onChange={setReading} suffix="kWh" mono />
```

The value you hold is unformatted (`"1250.50"`); the field shows `1,250.50`. Use it for
any figure a person types, and format read-only figures with `<Money />` instead.
