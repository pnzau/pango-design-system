Every dialog in Pango — unit detail, add repair, add manager, filters — is this one component. There are no popovers, tooltips or toasts in the product.

```jsx
<Sheet open={open} onClose={close} width={440} mobile={isMobile} title="Log a repair">
  <div style={{padding:'0 24px 24px'}}>…</div>
</Sheet>
```

Widths in the source: 420 (unit detail), 440 (add repair), 460 (edit property / manager), 840 (add property, two-column).
