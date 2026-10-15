```jsx
{/* settings row */}
<ThemeToggle />

{/* header icon button */}
<ThemeToggle variant="switch" />

{/* no OS option, icons only */}
<ThemeToggle options={['light','dark']} showLabels={false} />
```

Boot the stored choice before first paint so the page doesn't flash:

```html
<script>
  (function () {
    var c = localStorage.getItem('ds-theme') || 'system';
    var d = c === 'dark' || (c === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
  })();
</script>
```

For a custom control use `useTheme()` → `{ theme, choice, setChoice }`.
