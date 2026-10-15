const initialsOf = n => String(n).split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
const { Card, StatCard, Avatar, Tag, Button, Icon, IconButton, Sheet, EyebrowLabel, Input, Checkbox, SectionHeading } = window.PangoDesignSystem_86a349;

function ManagerSheet({ open, onClose }) {
  const props = window.PangoData.properties;
  const [picked, setPicked] = React.useState(['p1']);
  return (
    <Sheet open={open} onClose={onClose} width={460} title="Invite a manager">
      <div style={{ padding:'0 24px 24px' }}>
        <EyebrowLabel style={{ marginBottom:7 }}>FULL NAME</EyebrowLabel>
        <Input placeholder="Grace Wambui" style={{ marginBottom:15 }} />
        <EyebrowLabel style={{ marginBottom:7 }}>EMAIL ADDRESS</EyebrowLabel>
        <Input type="email" placeholder="grace@apexpm.co.ke" style={{ marginBottom:15 }} />
        <EyebrowLabel style={{ marginBottom:7 }}>PHONE</EyebrowLabel>
        <Input placeholder="+254 712 004 118" style={{ marginBottom:15 }} />
        <EyebrowLabel style={{ marginBottom:9 }}>PROPERTIES THEY CAN ACCESS</EyebrowLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:18 }}>
          {props.map(p => {
            const on = picked.indexOf(p.id) >= 0;
            return (
              <div key={p.id} onClick={() => setPicked(on ? picked.filter(x => x !== p.id) : picked.concat(p.id))}
                style={{ display:'flex', alignItems:'center', gap:11, cursor:'pointer', padding:'11px 13px', borderRadius:'var(--r-11)',
                  background: on ? 'var(--surface-inset)' : 'var(--surface-card)',
                  border: on ? '1px solid var(--border-control)' : '1px solid var(--border-inset)' }}>
                <Checkbox checked={on} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:'var(--fs-13-5)' }}>{p.name}</div>
                  <div style={{ fontSize:'var(--fs-11)', color:'var(--text-faint)' }}>{p.area}</div>
                </div>
              </div>
            );
          })}
        </div>
        <Button size="wide" block onClick={onClose}>Send invitation</Button>
      </div>
    </Sheet>
  );
}

function ManagersScreen() {
  const D = window.PangoData;
  const [open, setOpen] = React.useState(false);
  const active = D.managers.filter(m => m.status === 'active').length;
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'var(--gap-cards)', marginBottom:20 }}>
        <StatCard label="Active" value={active} trend="with portfolio access" trendColor="var(--paid)" valueColor="var(--paid)" />
        <StatCard label="Invited" value={D.managers.length - active} trend="awaiting acceptance" trendColor="var(--soon-fg)" />
        <StatCard label="Properties covered" value="4" trend="all sites staffed" />
      </div>
      <SectionHeading style={{ marginBottom:14 }} trailing={<Button size="sm" onClick={() => setOpen(true)}>Invite manager</Button>}>Your team</SectionHeading>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'var(--gap-cards)' }}>
        {D.managers.map(m => (
          <Card key={m.id}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
              <Avatar initials={initialsOf(m.name)} size={40} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-16)', letterSpacing:'var(--ls-display-sm)' }}>{m.name}</div>
                <div style={{ fontSize:'var(--fs-12-5)', color:'var(--text-muted)', marginTop:2 }}>{m.title}</div>
              </div>
              <Tag tone={m.status === 'active' ? '#0a8f5b' : '#d98a00'} size="xs">{m.status === 'active' ? 'Active' : 'Invited'}</Tag>
            </div>
            <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:5, fontSize:'var(--fs-12-5)', color:'var(--text-secondary)' }}>
              <div>{m.email}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'var(--fs-12)' }}>{m.phone}</div>
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:14, paddingTop:14, borderTop:'1px solid var(--grey-150)' }}>
              {m.props.map(p => <Tag key={p}>{p}</Tag>)}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:14 }}>
              <span style={{ fontSize:'var(--fs-11-5)', color:'var(--text-faint)', fontWeight:600 }}>Added {m.added}</span>
              <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                <IconButton title="Edit"><Icon name="edit" size={14} strokeWidth={2} /></IconButton>
                <Button variant="quiet" size="sm">Manage access</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <ManagerSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
Object.assign(window, { ManagersScreen, ManagerSheet });
