const { Card, SectionHeading, StatusChip, Tag, Badge, Money, Button, Icon, SegmentedControl, PangoMark, EyebrowLabel } = window.PangoDesignSystem_86a349;

/* The share card. Photography is user-supplied — the app drops an
   <image-slot> here, so the kit shows the same empty state. */
function ShareCard({ v, format }) {
  const square = format === 'square';
  return (
    <div style={{ position:'relative', width: square ? 380 : 260, height: square ? 380 : 462,
      borderRadius:'var(--r-18)', overflow:'hidden', padding:22, display:'flex', flexDirection:'column',
      justifyContent:'space-between', background:'#3a463c',
      backgroundImage:'linear-gradient(rgba(255,255,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px)',
      backgroundSize:'26px 26px' }}>
      <div style={{ position:'absolute', inset:0, background:'var(--photo-scrim)' }}></div>
      <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <PangoMark size="sm" tone="glass" wordmark />
        <Badge variant="pill">{v.available === 'Available now' ? 'Available now' : 'Vacant soon'}</Badge>
      </div>
      <div style={{ position:'relative' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--glass-fill-strong)', backdropFilter:'var(--blur-glass)', borderRadius:'var(--r-pill)', padding:'5px 12px', fontSize:'var(--fs-12-5)', fontWeight:700, color:'#fff' }}>
          <Icon name="pin" size={13} strokeWidth={2.2} color="#fff" />{v.area}
        </div>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize: square ? 'var(--fs-22)' : 'var(--fs-19)', color:'#fff', letterSpacing:'var(--ls-display-md)', lineHeight:1.2, marginTop:12 }}>{v.title}</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, margin:'16px 0 18px' }}>
          {v.amenities.slice(0, square ? 4 : 3).map(a => (
            <span key={a} style={{ fontSize:'var(--fs-12-5)', fontWeight:600, color:'#fff', background:'var(--glass-fill)', backdropFilter:'var(--blur-glass)', borderRadius:'var(--r-8)', padding:'6px 11px' }}>{a}</span>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:14, paddingTop:16, borderTop:'1px solid rgba(255,255,255,.2)' }}>
          <div>
            <div style={{ fontSize:'var(--fs-12)', fontWeight:600, color:'rgba(255,255,255,.7)' }}>Rent from</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-30)', color:'#fff', letterSpacing:'var(--ls-display-lg)', lineHeight:1 }}>
              {'KES ' + v.rent.toLocaleString('en-US')}<span style={{ fontSize:'var(--fs-15)', fontWeight:600, color:'rgba(255,255,255,.75)' }}>/mo</span>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'flex-end', color:'#fff', fontSize:'var(--fs-13)', fontWeight:700 }}>
              <Icon name="phone" size={14} strokeWidth={2} color="#fff" />+254 712 004 118
            </div>
            <div style={{ fontSize:'var(--fs-11-5)', color:'rgba(255,255,255,.65)', marginTop:3 }}>Book a viewing today</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VacanciesScreen() {
  const D = window.PangoData;
  const [sel, setSel] = React.useState(0);
  const [format, setFormat] = React.useState('square');
  const v = D.vacancies[sel];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'var(--gap-grid)', alignItems:'start' }}>
      <div>
        <SectionHeading style={{ marginBottom:14 }}
          trailing={<SegmentedControl value={format} onChange={setFormat} radius="var(--r-10)"
            options={[{ value:'square', label:'Instagram · 1:1' },{ value:'story', label:'Story · 9:16' }]} />}>
          Shareable cards
        </SectionHeading>
        <div style={{ display:'flex', justifyContent:'center', padding:20, background:'var(--grey-350)', border:'1px solid var(--border-control)', borderRadius:'var(--r-18)' }}>
          <ShareCard v={v} format={format} />
        </div>
        <SectionHeading style={{ margin:'26px 0 14px' }}>All listings</SectionHeading>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {D.vacancies.map((x,i) => (
            <Card key={x.unit} interactive onClick={() => setSel(i)} padding="14px 18px"
              style={{ display:'flex', alignItems:'center', gap:14, borderColor: i === sel ? 'var(--border-strong)' : undefined }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:'var(--fs-13-5)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{x.title}</div>
                <div style={{ fontSize:'var(--fs-12)', color:'var(--text-faint)', marginTop:2 }}>{x.unit} · {x.prop} · {x.available}</div>
              </div>
              <div style={{ display:'flex', gap:14, fontSize:'var(--fs-11-5)', fontWeight:600, color:'var(--text-faint)' }}>
                <span>{x.views} views</span><span>{x.enquiries} enquiries</span>
              </div>
              <Money currency="KES" amount={x.rent} size="var(--fs-13)" />
              <StatusChip status={x.status} />
            </Card>
          ))}
        </div>
      </div>
      <Card>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-15)', marginBottom:6 }}>Share</div>
        <p style={{ margin:'0 0 14px', fontSize:'var(--fs-12-5)', color:'var(--text-muted)', lineHeight:'var(--lh-body)' }}>Drop a photo on the card, then post it straight to your channels.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          <Button size="wide" block style={{ background:'var(--whatsapp)' }} icon={<Icon name="whatsapp" size={18} color="#fff" />}>Share to WhatsApp</Button>
          <Button size="wide" block style={{ background:'var(--instagram)' }} icon={<Icon name="instagram" size={18} strokeWidth={2} color="#fff" />}>Share to Instagram</Button>
          <Button variant="secondary" size="wide" block icon={<Icon name="download" size={15} strokeWidth={1.9} />}>Download image</Button>
        </div>
        <div style={{ marginTop:18, paddingTop:16, borderTop:'1px solid var(--grey-150)' }}>
          <EyebrowLabel style={{ marginBottom:9 }}>LISTING</EyebrowLabel>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>{v.amenities.map(a => <Tag key={a}>{a}</Tag>)}</div>
        </div>
      </Card>
    </div>
  );
}
Object.assign(window, { VacanciesScreen, ShareCard });
