The Pango logo lockup — use it in sidebars, auth screens, share cards and print headers; never redraw the bars by hand.

```jsx
<PangoMark size="md" tagline />
<PangoMark size="sm" tone="glass" />   {/* over a photo */}
```

Variants: `size` lg/md/sm matches the app's 44/38/34px tiles. `tone="black"` is the auth-screen treatment, `tone="glass"` the share-card treatment. Set `wordmark={false}` for a bare tile, `tagline` to add RENTALS, HANDLED.
