The sidebar's only nav pattern, plus the role / format switcher.

```jsx
<NavItem icon={<Icon name="properties" />} active>Properties</NavItem>
<NavItem icon={<Icon name="repairs" />} badge={<Badge style={{marginLeft:'auto'}}>11</Badge>}>Repairs</NavItem>
<SegmentedControl value={role} onChange={setRole}
  options={[{value:'landlord',label:'Landlord'},{value:'manager',label:'Manager'}]} />
```

Nav rows sit in a `flex-direction:column` with a 3px gap; a 1px `--border-inset` divider separates the operational group from AI Insights and Managers.
