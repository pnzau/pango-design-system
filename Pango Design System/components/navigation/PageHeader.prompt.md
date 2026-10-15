Every in-app view starts with this header; the subtitle carries the context sentence.

```jsx
<PageHeader title="Properties" subtitle="4 properties across Nairobi"
  cta={<Button>Add property</Button>}>
  <SearchField />
</PageHeader>
```

Exactly one accent CTA lives here. Print hides the header (`data-noprint`).
