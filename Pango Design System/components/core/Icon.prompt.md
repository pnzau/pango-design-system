Renders one of Pango's inline stroke icons — the app has no icon font or icon package, so always use this rather than pasting SVG or reaching for emoji.

```jsx
<Icon name="properties" size={18} />
<Icon name="chevronDown" size={13} strokeWidth={2.4} />
<Icon name="whatsapp" size={18} color="#fff" />   {/* filled, not stroked */}
```

Names: properties, invoice, repairs, vacancies, verify, sparkle, managers, logout, menu, search, chevronDown/Left/Right, pin, wrench, clock, check, download, phone, edit, whatsapp, instagram. Icons inherit `currentColor`, so colour them by setting `color` on the parent.
