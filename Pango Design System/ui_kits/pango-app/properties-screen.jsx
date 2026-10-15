const { Card, InsetPanel, DarkPanel, SectionHeading, StatCard, StatusLegend, UnitGrid, Tag, Badge, Icon, Button, IconButton, Money, Avatar, StatusChip } = window.PangoDesignSystem_86a349;

function AiBrief({ text, onOpen }) {
  return (
    <DarkPanel style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:20 }}>
      <div style={{ width:38, height:38, borderRadius:'var(--r-11)', background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon name="sparkle" size={20} strokeWidth={1.8} color="var(--accent)" />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-14-5)', color:'#fff' }}>AI portfolio brief</span>
          <Badge variant="live">LIVE</Badge>
        </div>
        <p style={{ margin:'5px 0 0', fontSize:'var(--fs-13)', color:'var(--text-on-dark-body)', lineHeight:1.55 }}>{text}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onOpen}>Full insights →</Button>
    </DarkPanel>
  );
}

function PendingVerifications({ rows, onConfirm }) {
  const [open, setOpen] = React.useState(null);
  if (!rows.length) return null;
  return (
    <div style={{ background:'var(--surface-card)', border:'1px solid #0a8f5b40', borderRadius:'var(--r-16)', overflow:'hidden', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'15px 20px', background:'#0a8f5b0d', borderBottom:'1px solid var(--border-inset)' }}>
        <Icon name="clock" size={17} strokeWidth={2} color="var(--accent)" />
        <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-14-5)' }}>Payment verifications to review</span>
        <Badge variant="pillMono">{rows.length}</Badge>
      </div>
      {rows.map((v, i) => (
        <div key={v.ref} style={{ borderBottom:'1px solid var(--grey-150)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, padding:'var(--pad-row)', flexWrap:'wrap' }}>
            <Avatar initials={v.tenant.split(' ').map(w=>w[0]).join('')} shape="square" size={40} background="var(--surface-chip)" color="var(--text-secondary)" />
            <div style={{ minWidth:150 }}>
              <div style={{ fontWeight:700, fontSize:'var(--fs-13-5)' }}>{v.tenant}</div>
              <div style={{ fontSize:'var(--fs-12)', color:'var(--text-faint)' }}>{v.unit} · {v.prop}</div>
            </div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap', flex:1, minWidth:150 }}>
              {v.items.map(it => <Tag key={it} size="sm">{it}</Tag>)}
            </div>
            <button onClick={() => setOpen(open === i ? null : i)}
              style={{ display:'flex', alignItems:'center', gap:7, border:'1px solid var(--border-control)', background:'var(--surface-card)',
                borderRadius:'var(--r-8)', padding:'7px 11px', fontSize:'var(--fs-11-5)', fontWeight:700, color:'var(--text-secondary)', cursor:'pointer', minWidth:120, fontFamily:'inherit' }}>
              <Tag tone={v.tone} size="xs">{v.channel}</Tag>{v.ref}
              <Icon name="chevronDown" size={13} strokeWidth={2.4} style={{ transform: open === i ? 'rotate(180deg)' : 'none' }} />
            </button>
            <Money currency="KES" amount={v.amount} style={{ width:110, textAlign:'right' }} />
            <Button size="sm" onClick={onConfirm}>Confirm</Button>
          </div>
          {open === i ? (
            <InsetPanel padding="14px 16px" style={{ margin:'0 20px 16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <Tag tone={v.tone} size="xs">{v.channel}</Tag>
                <span style={{ fontSize:'var(--fs-10-5)', fontWeight:700, color:'var(--text-label)', letterSpacing:'var(--ls-label)' }}>CONFIRMATION MESSAGE</span>
              </div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'var(--fs-12)', color:'var(--grey-1100)', lineHeight:'var(--lh-prose)' }}>{v.msg}</div>
            </InsetPanel>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function MonthStepper() {
  const [i, setI] = React.useState(0);
  const label = new Date(2026, 6 + i, 1).toLocaleDateString('en-US', { month:'short', year:'numeric' });
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
      <div style={{ display:'flex', alignItems:'center', background:'var(--surface-card)', border:'1px solid var(--border-card)', borderRadius:'var(--r-11)', padding:4 }}>
        <IconButton variant="plain" onClick={() => setI(i-1)}><Icon name="chevronLeft" size={16} strokeWidth={2.2} /></IconButton>
        <div style={{ minWidth:118, textAlign:'center', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-14)' }}>{label}</div>
        <IconButton variant="plain" onClick={() => setI(i+1)}><Icon name="chevronRight" size={16} strokeWidth={2.2} /></IconButton>
      </div>
      {i !== 0 ? <Button variant="secondary" size="sm" onClick={() => setI(0)}>Today</Button> : null}
      <span style={{ fontSize:'var(--fs-12-5)', color:'var(--text-faint)', fontWeight:600 }}>
        {i === 0 ? 'Current period — 5 tenants unpaid' : i < 0 ? 'Closed period' : 'Invoices not yet issued'}
      </span>
    </div>
  );
}

function PropertyCard({ p, onOpen }) {
  const units = p.floors.flatMap(f => f.units);
  const occ = units.filter(u => u.status !== 'vacant').length;
  const overdue = units.filter(u => u.status === 'overdue').length;
  const revenue = units.filter(u => u.status !== 'vacant').reduce((a,u) => a + u.rent, 0);
  return (
    <Card interactive onClick={onOpen}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10 }}>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-17)', letterSpacing:'var(--ls-display-sm)' }}>{p.name}</div>
          <div style={{ display:'flex', alignItems:'center', gap:5, color:'var(--text-muted)', fontSize:'var(--fs-12-5)', marginTop:4 }}>
            <Icon name="pin" size={13} strokeWidth={2} />{p.area}
          </div>
        </div>
        <span style={{ fontSize:'var(--fs-11)', fontWeight:700, color:'var(--text-secondary)', background:'var(--surface-chip)', borderRadius:'var(--r-7)', padding:'5px 9px', whiteSpace:'nowrap' }}>{p.type}</span>
      </div>
      <UnitGrid floors={p.floors} variant="dots" animate style={{ margin:'16px 0' }} />
      <div style={{ display:'flex', gap:18, flexWrap:'wrap' }}>
        {[['Units', units.length],['Occupied', occ + '/' + units.length],['Overdue', overdue]].map(([l,v],i) => (
          <div key={l}>
            <div style={{ fontSize:'var(--fs-11)', color:'var(--text-faint)', fontWeight:600 }}>{l}</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-16)', color: l === 'Overdue' && v > 0 ? 'var(--overdue-fg)' : undefined }}>{v}</div>
          </div>
        ))}
        <div style={{ marginLeft:'auto', textAlign:'right' }}>
          <div style={{ fontSize:'var(--fs-11)', color:'var(--text-faint)', fontWeight:600 }}>Monthly</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-16)' }}>{'KES ' + revenue.toLocaleString('en-US')}</div>
        </div>
      </div>
      <InsetPanel padding="10px 12px" radius="var(--r-10)" style={{ display:'flex', alignItems:'center', gap:9, marginTop:14 }}>
        <Icon name="wrench" size={15} strokeWidth={1.8} color="var(--text-muted)" />
        <span style={{ fontSize:'var(--fs-12)', fontWeight:600, color:'var(--grey-1000)' }}>{p.repairSummary}</span>
        <Money value={p.repairCost} size="var(--fs-12)" style={{ marginLeft:'auto' }} />
      </InsetPanel>
      <div style={{ display:'flex', alignItems:'flex-start', gap:7, marginTop:10 }}>
        <span style={{ color:'var(--accent)', fontSize:'var(--fs-13)', lineHeight:1.4 }}>✦</span>
        <span style={{ fontSize:'var(--fs-12)', color:'var(--grey-950)', lineHeight:1.45, fontStyle:'italic' }}>{p.aiHint}</span>
      </div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:14, paddingTop:14, borderTop:'1px solid var(--grey-150)' }}>
        {p.amenities.slice(0,4).map(a => <Tag key={a}>{a}</Tag>)}
        {p.amenities.length > 4 ? <Tag style={{ color:'var(--text-faint)' }}>+{p.amenities.length - 4} more</Tag> : null}
      </div>
    </Card>
  );
}

function PropertiesScreen({ onOpenProperty, onOpenInsights }) {
  const D = window.PangoData;
  const all = D.properties.flatMap(p => p.floors.flatMap(f => f.units));
  const occ = all.filter(u => u.status !== 'vacant').length;
  const revenue = all.filter(u => u.status !== 'vacant').reduce((a,u) => a + u.rent, 0);
  return (
    <div>
      <AiBrief onOpen={onOpenInsights}
        text="Collections are tracking 3% ahead of May, but KES 390,850 sits unpaid across five tenants — V5 at Baraka Villas is the largest exposure at 62 days." />
      <PendingVerifications rows={D.pending} onConfirm={() => {}} />
      <MonthStepper />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'var(--gap-cards)', marginBottom:26 }}>
        <StatCard label="Properties" value="4" trend="Across Nairobi" />
        <StatCard label="Total units" value={all.length} trend={occ + ' occupied'} trendColor="var(--paid)" />
        <StatCard label="Occupancy" value={Math.round(occ/all.length*100) + '%'} trend={(all.length-occ) + ' vacant'} />
        <StatCard label="Monthly revenue" value={'KES ' + revenue.toLocaleString('en-US')} trend="▲ collected on time" trendColor="var(--paid)" />
      </div>
      <SectionHeading trailing={<StatusLegend items={[{status:'success',label:'Paid'},{status:'warning',label:'Due soon'},{status:'danger',label:'Overdue'},{status:'empty',label:'Vacant'}]} />} style={{ marginBottom:14 }}>Your properties</SectionHeading>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(360px,1fr))', gap:'var(--gap-grid)' }}>
        {D.properties.map(p => <PropertyCard key={p.id} p={p} onOpen={() => onOpenProperty(p.id)} />)}
      </div>
    </div>
  );
}
Object.assign(window, { PropertiesScreen, AiBrief, PendingVerifications, MonthStepper, PropertyCard });
