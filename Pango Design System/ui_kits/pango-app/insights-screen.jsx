const { Card, DarkPanel, Icon, Money, Tag, SectionHeading, StatCard } = window.PangoDesignSystem_86a349;

const PROJECTION = [
  { label:'Feb', val:1856580, model:false }, { label:'Mar', val:1894860, model:false },
  { label:'Apr', val:1914000, model:false }, { label:'May', val:1952280, model:true },
  { label:'Jun', val:1990560, model:true },  { label:'Jul', val:2067120, model:true }
];

function InsightsScreen() {
  const max = Math.max(...PROJECTION.map(p => p.val));
  const total = PROJECTION.reduce((a,p) => a + p.val, 0);
  return (
    <div>
      <DarkPanel padding="24px 26px" radius="var(--r-18)" style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:20 }}>
        <div style={{ width:42, height:42, borderRadius:'var(--r-12)', background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon name="sparkle" size={22} strokeWidth={1.8} color="var(--accent)" />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-19)', color:'#fff', letterSpacing:'var(--ls-display-sm)' }}>Portfolio intelligence</div>
          <p style={{ color:'var(--text-on-dark-body)', fontSize:'var(--fs-13-5)', margin:'6px 0 0', lineHeight:'var(--lh-prose)', maxWidth:560 }}>
            Your rent roll supports KES 1.91M a month at current occupancy. Filling A3 and C3 at Riverside Court adds KES 97,000 — the largest single gain available this quarter.
          </p>
        </div>
      </DarkPanel>

      <Card padding="var(--pad-card-lg)" style={{ marginBottom:18 }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:18 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-15)' }}>Projected income — next 6 months</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-22)' }}>{'KES ' + total.toLocaleString('en-US')}</span>
            <span style={{ fontSize:'var(--fs-12)', fontWeight:700, color:'var(--accent)' }}>▲ 11.3%</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:12, height:170 }}>
          {PROJECTION.map(m => (
            <div key={m.label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:8, height:'100%', justifyContent:'flex-end' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'var(--fs-10-5)', fontWeight:600, color:'var(--grey-950)' }}>
                {(m.val/1000000).toFixed(2) + 'M'}
              </div>
              <div style={{ width:'100%', height:(m.val/max*120)+'px', borderRadius:'var(--r-8)', background: m.model ? 'var(--grey-600)' : 'var(--ink)' }}></div>
              <div style={{ fontSize:'var(--fs-11)', fontWeight:700, color:'var(--text-faint)' }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:16, marginTop:14, paddingTop:14, borderTop:'1px solid var(--grey-250)' }}>
          {[['Collected / booked','var(--ink)'],['Projected (model)','var(--grey-600)']].map(([l,c]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'var(--fs-11-5)', fontWeight:600, color:'var(--grey-950)' }}>
              <span style={{ width:11, height:11, borderRadius:3, background:c }}></span>{l}
            </div>
          ))}
        </div>
      </Card>

      <SectionHeading style={{ marginBottom:14 }}>Opportunities</SectionHeading>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'var(--gap-cards)' }}>
        {[
          ['#0a8f5b','Grossing','Two vacant units at Riverside Court','A3 is repainted and viewing-ready; C3 frees up on 15 Jul. Publishing both now adds KES 97,000 a month.'],
          ['#b32a20','Churn risk','V5 is 62 days overdue','KES 138,400 outstanding at Baraka Villas — the single largest exposure. Escalate before the next billing cycle.'],
          ['#1466d6','Upkeep','C2 is a repeat plumbing call','Two jobs in six weeks on the same sink. A trap replacement costs less than a third call-out.'],
          ['#0a8f5b','Opportunity','Rents in Runda have moved','V4 relets in August. Comparable villas in the estate are asking 8–11% above your current rate.']
        ].map(([tone,tag,title,body]) => (
          <Card key={title}>
            <Tag tone={tone} size="xs">{tag}</Tag>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-15)', marginTop:10 }}>{title}</div>
            <p style={{ margin:'6px 0 0', fontSize:'var(--fs-13)', color:'var(--text-secondary)', lineHeight:'var(--lh-body)' }}>{body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
Object.assign(window, { InsightsScreen });
