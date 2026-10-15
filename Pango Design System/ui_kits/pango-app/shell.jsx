const initialsOf = n => String(n).split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
const { PangoMark, Icon, NavItem, SegmentedControl, Badge, Avatar, IconButton, PageHeader, Button, SearchField } = window.PangoDesignSystem_86a349;

const NAV = [
  { key:'properties', label:'Properties', icon:'properties' },
  { key:'billing', label:'Rent & Invoices', icon:'invoice' },
  { key:'repairs', label:'Repairs', icon:'repairs', count:8 },
  { key:'vacancies', label:'Vacancies', icon:'vacancies' },
  { key:'verify', label:'Verify Payment', icon:'verify' },
  { divider:true },
  { key:'insights', label:'AI Insights', icon:'sparkle', ai:true },
  { key:'managers', label:'Managers', icon:'managers' }
];

function Sidebar({ screen, go, role, setRole, onSignOut }) {
  return (
    <aside style={{ width:'var(--sidebar-w)', flexShrink:0, background:'var(--surface-card)', borderRight:'1px solid var(--border-card)',
      display:'flex', flexDirection:'column', padding:'var(--pad-sidebar)', height:'100%' }}>
      <div style={{ padding:'4px 6px 22px' }}><PangoMark size="md" tagline /></div>
      <nav style={{ display:'flex', flexDirection:'column', gap:'var(--gap-nav)' }}>
        {NAV.map((n, i) => n.divider
          ? <div key={'d'+i} style={{ height:1, background:'var(--border-inset)', margin:'8px 6px' }}></div>
          : <NavItem key={n.key} active={screen === n.key} onClick={() => go(n.key)} icon={<Icon name={n.icon} />}
              badge={n.count ? <Badge style={{ marginLeft:'auto' }}>{n.count}</Badge>
                    : n.ai ? <Badge variant="flag" style={{ marginLeft:'auto' }}>AI</Badge> : null}>
              {n.label}
            </NavItem>)}
      </nav>
      <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap:14 }}>
        <div>
          <div style={{ fontSize:'var(--fs-10-5)', fontWeight:700, color:'var(--grey-750)', letterSpacing:'var(--ls-caps-badge)', margin:'0 6px 8px' }}>VIEWING AS</div>
          <SegmentedControl value={role} onChange={setRole}
            options={[{ value:'landlord', label:'Landlord' }, { value:'manager', label:'Manager' }]} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 8px', borderTop:'1px solid var(--border-inset)' }}>
          <Avatar initials={role === 'landlord' ? 'JM' : 'GW'} />
          <div style={{ lineHeight:1.3, minWidth:0, flex:1 }}>
            <div style={{ fontWeight:700, fontSize:'var(--fs-13)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{role === 'landlord' ? 'James Mwangi' : 'Grace Wambui'}</div>
            <div style={{ fontSize:'var(--fs-11)', color:'var(--text-faint)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{role === 'landlord' ? 'Owner · 4 properties' : 'Apex Property Mgmt'}</div>
          </div>
          <IconButton title="Sign out" onClick={onSignOut}><Icon name="logout" size={15} strokeWidth={1.9} /></IconButton>
        </div>
      </div>
    </aside>
  );
}

const TITLES = {
  properties: ['Properties', '4 properties across Nairobi'],
  billing: ['Rent & Invoices', 'June 2026 · 7 invoices in this period'],
  repairs: ['Repairs', '8 jobs logged · KES 51,000 spent this quarter'],
  vacancies: ['Vacancies', '4 listings · 3 published, 1 draft'],
  verify: ['Verify Payment', 'Submit an M-Pesa or bank confirmation'],
  insights: ['AI Insights', 'Modelled from your rent roll and repair history'],
  managers: ['Managers', '4 people with access to this portfolio']
};
const CTA = {
  properties: 'Add property', billing: 'Generate invoices', repairs: 'Log a repair',
  vacancies: 'New listing', verify: null, insights: null, managers: 'Invite manager'
};

function Shell({ screen, go, role, setRole, onSignOut, children }) {
  const [t, sub] = TITLES[screen] || ['', ''];
  const cta = CTA[screen];
  return (
    <div style={{ display:'flex', height:'100%', background:'var(--surface-app)', color:'var(--text-body)', fontFamily:'var(--font-body)', fontSize:'var(--fs-14)' }}>
      <Sidebar screen={screen} go={go} role={role} setRole={setRole} onSignOut={onSignOut} />
      <main style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', height:'100%', overflowY:'auto' }}>
        <PageHeader title={t} subtitle={sub} cta={cta ? <Button>{cta}</Button> : null}>
          {screen === 'verify' ? null : <SearchField />}
        </PageHeader>
        <div style={{ padding:'var(--pad-page)', maxWidth:'var(--content-max)', width:'100%' }}>{children}</div>
      </main>
    </div>
  );
}

Object.assign(window, { Shell, Sidebar });
