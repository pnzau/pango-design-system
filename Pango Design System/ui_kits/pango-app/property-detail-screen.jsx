const { Card, InsetPanel, SectionHeading, StatCard, StatusLegend, UnitGrid, Tag, Icon, Button, Sheet, Money, StatusChip, EyebrowLabel } = window.PangoDesignSystem_86a349;

function UnitSheet({ unit, prop, onClose }) {
  if (!unit) return null;
  const bill = [['Rent', unit.rent],['Water',1500],['Electricity',2400],['Garbage',500],['Service levy',1500]];
  const total = bill.reduce((a,b) => a + b[1], 0);
  const paid = unit.status === 'paid' ? total : unit.status === 'overdue' ? Math.round(total*0.35) : 0;
  return (
    <Sheet open onClose={onClose} width={420}>
      <div style={{ padding:'22px 24px 24px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-20)', letterSpacing:'var(--ls-display-sm)' }}>Unit {unit.id}</div>
            <div style={{ fontSize:'var(--fs-12-5)', color:'var(--text-muted)', marginTop:3 }}>{prop} · {unit.tenant || 'Vacant'}</div>
          </div>
          <StatusChip status={unit.status === 'soon' ? 'unconfirmed' : unit.status === 'vacant' ? 'draft' : unit.status} label={unit.status === 'soon' ? 'Due soon' : unit.status === 'vacant' ? 'Vacant' : undefined} />
        </div>
        <InsetPanel padding={16} style={{ marginBottom:16 }}>
          <EyebrowLabel style={{ marginBottom:10 }}>THIS MONTH'S BILL</EyebrowLabel>
          {bill.map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', fontSize:'var(--fs-13)' }}>
              <span style={{ color:'var(--text-secondary)', fontWeight:600 }}>{k}</span><Money currency="KES" amount={v} size="var(--fs-13)" weight={600} />
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, paddingTop:10, borderTop:'1px solid var(--border-inset)' }}>
            <span style={{ fontWeight:700, fontSize:'var(--fs-13-5)' }}>Balance</span>
            <Money currency="KES" amount={total - paid} color={total - paid > 0 ? 'var(--overdue-fg)' : 'var(--paid-fg)'} />
          </div>
        </InsetPanel>
        <Button size="wide" block onClick={onClose}>{unit.status === 'vacant' ? 'Publish a listing' : 'Send a reminder'}</Button>
      </div>
    </Sheet>
  );
}

function PropertyDetailScreen({ propId, onBack }) {
  const p = window.PangoData.properties.find(x => x.id === propId) || window.PangoData.properties[0];
  const [unit, setUnit] = React.useState(null);
  const units = p.floors.flatMap(f => f.units);
  const occ = units.filter(u => u.status !== 'vacant').length;
  const revenue = units.filter(u => u.status !== 'vacant').reduce((a,u) => a + u.rent, 0);
  return (
    <div>
      <Button variant="quiet" size="sm" onClick={onBack} icon={<Icon name="chevronLeft" size={14} strokeWidth={2.2} />} style={{ marginBottom:16 }}>All properties</Button>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16, flexWrap:'wrap', marginBottom:20 }}>
        <div>
          <span style={{ fontSize:'var(--fs-11)', fontWeight:700, color:'var(--text-secondary)', background:'var(--surface-chip)', borderRadius:'var(--r-7)', padding:'5px 9px' }}>{p.type}</span>
          <h2 style={{ margin:'10px 0 4px', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-26)', letterSpacing:'-.6px' }}>{p.name}</h2>
          <div style={{ display:'flex', alignItems:'center', gap:5, color:'var(--text-muted)', fontSize:'var(--fs-14)' }}>
            <Icon name="pin" size={15} strokeWidth={2} />{p.area}
          </div>
        </div>
        <Button variant="secondary" size="sm" icon={<Icon name="edit" size={14} strokeWidth={2} />}>Edit property</Button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'var(--gap-cards)', marginBottom:18 }}>
        <StatCard label="Total units" value={units.length} trend={occ + ' occupied'} trendColor="var(--paid)" />
        <StatCard label="Occupancy" value={Math.round(occ/units.length*100) + '%'} trend={(units.length-occ) + ' vacant'} />
        <StatCard label="Monthly revenue" value={'KES ' + revenue.toLocaleString('en-US')} trend="▲ collected on time" trendColor="var(--paid)" />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:'var(--gap-grid)', alignItems:'start' }}>
        <Card padding="var(--pad-card-lg)">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-15)' }}>Building layout</div>
            <StatusLegend compact items={[{status:'success',label:'Paid'},{status:'warning',label:'Due soon'},{status:'danger',label:'Overdue'},{status:'empty',label:'Vacant'}]} />
          </div>
          <UnitGrid floors={p.floors} onUnitClick={setUnit} animate />
        </Card>
        <Card padding="var(--pad-card-lg)">
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-15)', marginBottom:14 }}>Amenities</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {p.amenities.map(a => (
              <span key={a} style={{ display:'flex', alignItems:'center', gap:7, fontSize:'var(--fs-12-5)', fontWeight:600, color:'#444', background:'var(--surface-hover)', border:'1px solid #eee', borderRadius:'var(--r-9)', padding:'8px 12px' }}>{a}</span>
            ))}
          </div>
          <div style={{ marginTop:18, paddingTop:16, borderTop:'1px solid var(--grey-150)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:9 }}>
              <span style={{ color:'var(--accent)', fontSize:'var(--fs-13)' }}>✦</span>
              <span style={{ fontSize:'var(--fs-12-5)', color:'var(--grey-950)', lineHeight:1.5, fontStyle:'italic' }}>{p.aiHint}</span>
            </div>
          </div>
        </Card>
      </div>
      <UnitSheet unit={unit} prop={p.name} onClose={() => setUnit(null)} />
    </div>
  );
}
Object.assign(window, { PropertyDetailScreen });
