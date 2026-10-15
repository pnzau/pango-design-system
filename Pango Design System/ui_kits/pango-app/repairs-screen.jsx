/* Local tone map: the kit owns its own taxonomy colours. */
const CAT_TONE = { Plumbing:'var(--cat-1)', Electrical:'var(--cat-2)', Painting:'var(--cat-3)', General:'var(--cat-4)', Roofing:'var(--cat-5)', 'Pest control':'var(--cat-8)', Locksmith:'var(--cat-6)', Carpentry:'var(--cat-7)' };
const CategoryTone = c => CAT_TONE[c] || 'var(--cat-6)';
const { Card, InsetPanel, DarkPanel, SectionHeading, StatCard, Tag, Money, Select, Button, Icon, Sheet, EyebrowLabel, Input, TextArea } = window.PangoDesignSystem_86a349;

function AddRepairSheet({ open, onClose }) {
  const [cats, setCats] = React.useState(['Plumbing']);
  return (
    <Sheet open={open} onClose={onClose} width={440} title="Log a repair">
      <div style={{ padding:'0 24px 24px' }}>
        <EyebrowLabel style={{ marginBottom:7 }}>COST</EyebrowLabel>
        <Input mono placeholder="4500" style={{ marginBottom:15 }} />
        <EyebrowLabel style={{ marginBottom:7 }}>UNIT(S) REPAIRED</EyebrowLabel>
        <Select size="lg" style={{ width:'100%', marginBottom:15 }}
          options={[{ value:'c2', label:'C2 · Achieng A.' },{ value:'a3', label:'A3 · Vacant' },{ value:'gen', label:'General repairs (no specific unit)' }]} />
        <EyebrowLabel style={{ marginBottom:7 }}>CATEGORIES</EyebrowLabel>
        <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:9 }}>
          {cats.map(c => (
            <Tag key={c} tone={CategoryTone(c)} size="sm">{c}
              <span onClick={() => setCats(cats.filter(x => x !== c))} style={{ marginLeft:6, cursor:'pointer' }}>✕</span>
            </Tag>
          ))}
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          <Input placeholder="Type a category, press Enter to add…" />
          <Button variant="secondary" size="sm">Add</Button>
        </div>
        <div style={{ fontSize:'var(--fs-10-5)', color:'var(--text-label)', marginBottom:16 }}>
          Suggestions: {['Electrical','Painting','Roofing','Carpentry'].map(s => (
            <span key={s} onClick={() => cats.indexOf(s) < 0 && setCats(cats.concat(s))} style={{ cursor:'pointer', textDecoration:'underline', marginRight:8 }}>{s}</span>
          ))}
        </div>
        <EyebrowLabel style={{ marginBottom:7 }}>DESCRIPTION</EyebrowLabel>
        <TextArea placeholder="What was done…" style={{ marginBottom:18 }} />
        <Button size="wide" block onClick={onClose}>Save repair</Button>
      </div>
    </Sheet>
  );
}

function RepairsScreen() {
  const D = window.PangoData;
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('all');
  const rows = filter === 'all' ? D.repairs : D.repairs.filter(r => r.cats.indexOf(filter) >= 0);
  const spend = D.repairs.reduce((a,r) => a + r.cost, 0);
  const byCat = {};
  D.repairs.forEach(r => r.cats.forEach(c => { byCat[c] = (byCat[c] || 0) + r.cost; }));
  return (
    <div>
      <DarkPanel padding="20px 22px" style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
        <div style={{ width:38, height:38, borderRadius:'var(--r-11)', background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon name="wrench" size={20} strokeWidth={1.8} color="var(--accent)" />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-14-5)', color:'#fff' }}>Upkeep is 8.1% of rent this quarter</div>
          <p style={{ margin:'5px 0 0', fontSize:'var(--fs-13)', color:'var(--text-on-dark-body)', lineHeight:1.55 }}>C2 at Riverside Court has had two plumbing jobs in six weeks. Replacing the trap costs less than a third repeat call-out.</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>Log a repair</Button>
      </DarkPanel>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'var(--gap-cards)', marginBottom:20 }}>
        <StatCard label="Jobs logged" value={D.repairs.length} trend="all properties, all-time" />
        <StatCard label="Spent on repairs" value={'KES ' + spend.toLocaleString('en-US')} trend="8.1% of rent roll" />
        <StatCard label="Repeat units" value="1" trend="C2 · Riverside Court" trendColor="var(--soon-fg)" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:'var(--gap-grid)', alignItems:'start' }}>
        <Card padding="var(--pad-card-lg)">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginBottom:14, flexWrap:'wrap' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-15)' }}>Repair timeline</div>
            <Button size="sm" onClick={() => setOpen(true)}>Log a repair</Button>
          </div>
          <Select value={filter} onChange={e => setFilter(e.target.value)} style={{ width:'100%', marginBottom:16 }}
            options={[{ value:'all', label:'All categories' }].concat(Object.keys(byCat).map(c => ({ value:c, label:c })))} />
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {rows.map((r,i) => (
              <InsetPanel key={i} padding="13px 14px" style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'var(--fs-10-5)', fontWeight:600, color:'var(--text-faint)', width:78, flexShrink:0, paddingTop:2 }}>{r.date}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:'var(--fs-13)' }}>{r.task}</div>
                  <div style={{ fontSize:'var(--fs-11-5)', color:'var(--text-faint)', marginTop:2 }}>{r.unit} · {r.prop}</div>
                  <div style={{ display:'flex', gap:5, marginTop:7 }}>
                    {r.cats.map(c => <Tag key={c} tone={CategoryTone(c)} size="xs">{c}</Tag>)}
                  </div>
                </div>
                <Money currency="KES" amount={r.cost} size="var(--fs-13)" />
              </InsetPanel>
            ))}
          </div>
        </Card>
        <Card padding="var(--pad-card-lg)">
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-15)', marginBottom:16 }}>Spend by category</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {Object.entries(byCat).sort((a,b) => b[1]-a[1]).map(([c,v]) => (
              <div key={c}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <Tag tone={CategoryTone(c)} size="xs">{c}</Tag>
                  <Money currency="KES" amount={v} size="var(--fs-12-5)" />
                </div>
                <div style={{ height:8, background:'var(--grey-300)', borderRadius:5, overflow:'hidden' }}>
                  <div style={{ width:(v/spend*100)+'%', height:'100%', background:CategoryTone(c), borderRadius:5 }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <AddRepairSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
Object.assign(window, { RepairsScreen, AddRepairSheet });
