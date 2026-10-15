Text entry. Pair every field with an `<EyebrowLabel>` above it — Pango never uses floating or placeholder-only labels.

```jsx
<EyebrowLabel style={{marginBottom:7}}>EMAIL ADDRESS</EyebrowLabel>
<Input tone="auth" type="email" placeholder="you@example.com" />
<Select size="lg" options={units} style={{width:'100%'}} />
<TextArea mono placeholder="Paste the full M-Pesa message…" minHeight={96} />
```

Focus is a border swap to ink — no glow, no ring, no accent outline.
