```jsx
{/* plain */}
<Dropdown value={team} onSelect={setTeam} options={teams} placeholder="Select team…" />

{/* clearable — an empty value is valid */}
<Dropdown clearable value={owner} onSelect={setOwner} options={people} placeholder="Unassigned" />

{/* swatched + creatable: options carry a colour, the footer opens a create panel */}
<Dropdown value={cat} options={cats} onSelect={setCat}
  colorPalette={['var(--cat-1)','var(--cat-2)','var(--cat-3)','var(--cat-4)']}
  onCreate={async (name, color) => { await api.addCategory(name, color); }}
  createLabel="Add category" />

{/* one pinned action under the options */}
<Dropdown value={v} onSelect={setV} options={o} footerLabel="Manage teams…" onFooter={openSettings} />
```

`height={40}` in a page header, the default `42` in forms and sheets. There is no
native `<select>` in this system.
