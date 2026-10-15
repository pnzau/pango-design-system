The Pango button — one accent-filled primary per view, everything else outlined.

```jsx
<Button>Add property</Button>
<Button variant="secondary" size="sm" icon={<Icon name="edit" size={14} strokeWidth={2} />}>Edit property</Button>
<Button variant="ghost">Full insights →</Button>
<Button variant="primary" size="wide" block>Save repair</Button>
```

Primary brightens 8% on hover (never darkens); outlined variants fill to `--surface-hover`. Nothing scales or shifts on press.
