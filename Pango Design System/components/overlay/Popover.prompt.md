```jsx
const triggerRef = React.useRef(null);
const [open, setOpen] = React.useState(false);

<div style={{ position: 'relative' }}>
  <button ref={triggerRef} onClick={() => setOpen(o => !o)}>Filters</button>
  <AnchoredPopover anchorRef={triggerRef} open={open} onClose={() => setOpen(false)}
    minWidth={240} padding={12}>
    …panel contents…
  </AnchoredPopover>
</div>
```

The parent must be `position: relative`. `Dropdown` and `DatePicker` already use this
layer — reach for it directly only for a panel those two don't cover.
