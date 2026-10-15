const { Card, InsetPanel, EyebrowLabel, CheckRow, TextArea, Button, Money, ProgressBar, Avatar, Icon, Tag } = window.PangoDesignSystem_86a349;

const ITEMS = [
  { name:'Rent', basis:'Monthly rent for C4', amount:52000 },
  { name:'Water', basis:'Metered · billed monthly', amount:1500 },
  { name:'Electricity', basis:'Prepaid tokens', amount:2400 },
  { name:'Garbage', basis:'Twice-weekly collection', amount:500 },
  { name:'Service levy', basis:'Security & common areas', amount:1500 }
];

function VerifyScreen() {
  const [checked, setChecked] = React.useState({ Rent:true, Water:false, Electricity:false, Garbage:false, 'Service levy':false });
  const [channel, setChannel] = React.useState('mpesa');
  const [msg, setMsg] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const selected = ITEMS.filter(i => checked[i.name]).reduce((a,i) => a + i.amount, 0);
  const total = ITEMS.reduce((a,i) => a + i.amount, 0);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:'var(--gap-grid)', alignItems:'start' }}>
      <Card padding="var(--sp-24)" radius="var(--r-18)">
        <div style={{ display:'flex', alignItems:'center', gap:11, paddingBottom:18, borderBottom:'1px solid var(--border-inset)', marginBottom:18 }}>
          <Avatar initials="MK" shape="square" size={40} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:'var(--fs-15)' }}>Muthoni Kariuki</div>
            <div style={{ fontSize:'var(--fs-12-5)', color:'var(--text-muted)' }}>C4 · Riverside Court · Jul 2026</div>
          </div>
        </div>

        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-15)', marginBottom:4 }}>1 · Select what you've paid</div>
        <p style={{ margin:'0 0 14px', fontSize:'var(--fs-13)', color:'var(--text-muted)', lineHeight:'var(--lh-body)' }}>Tick each billable item you've cleared this month.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {ITEMS.map(i => (
            <CheckRow key={i.name} checked={!!checked[i.name]} onChange={() => setChecked({ ...checked, [i.name]: !checked[i.name] })}
              name={i.name} basis={i.basis} amount={'KES ' + i.amount.toLocaleString('en-US')} />
          ))}
        </div>

        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-15)', margin:'22px 0 10px' }}>2 · Paste your payment message</div>
        <div style={{ display:'flex', gap:8, marginBottom:11 }}>
          {[['mpesa','M-Pesa'],['kcb','KCB Bank']].map(([k,l]) => (
            <button key={k} onClick={() => setChannel(k)}
              style={{ border: channel === k ? '1px solid var(--ink)' : '1px solid var(--border-control)',
                background: channel === k ? 'var(--ink)' : 'var(--surface-card)',
                color: channel === k ? '#fff' : 'var(--text-secondary)',
                borderRadius:'var(--r-9)', padding:'9px 14px', fontWeight:700, fontSize:'var(--fs-12-5)', cursor:'pointer', fontFamily:'inherit' }}>{l}</button>
          ))}
        </div>
        <TextArea mono minHeight={96} value={msg} onChange={e => setMsg(e.target.value)}
          placeholder={channel === 'mpesa' ? 'SFG5H2K9QW Confirmed. Ksh53,500.00 sent to PANGO RENTALS…' : 'KCB Bank: Confirmed. KES 52,200.00 received from…'} />
        <Button size="wide" block disabled={!msg || selected === 0} onClick={() => setSent(true)} style={{ marginTop:16 }}>
          {sent ? 'Sent for confirmation' : 'Submit for confirmation'}
        </Button>
      </Card>

      <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap-grid)' }}>
        <div style={{ background:'var(--ink)', color:'#fff', borderRadius:'var(--r-16)', padding:'var(--pad-card-lg)' }}>
          <div style={{ fontSize:'var(--fs-11-5)', color:'#b0b0b0', fontWeight:600 }}>Selected total</div>
          <Money value={'KES ' + selected.toLocaleString('en-US')} size="var(--fs-30)"
            style={{ fontFamily:'var(--font-display)', letterSpacing:'var(--ls-display-lg)', display:'block', marginTop:4 }} />
          <div style={{ fontSize:'var(--fs-12)', color:'var(--text-on-dark-muted)', marginTop:4 }}>of KES {total.toLocaleString('en-US')} billed this month</div>
          <ProgressBar value={selected/total*100} style={{ marginTop:14 }} />
        </div>
        <InsetPanel padding="18px 20px" radius="var(--r-16)">
          <EyebrowLabel style={{ marginBottom:10 }}>HOW IT WORKS</EyebrowLabel>
          {['Tick the items you have paid.','Paste the confirmation message from M-Pesa or your bank.','Your landlord confirms and the invoice is marked paid.'].map((t,i) => (
            <div key={i} style={{ display:'flex', gap:10, padding:'6px 0', fontSize:'var(--fs-12-5)', color:'#5a5a5a', lineHeight:1.45 }}>
              <span style={{ width:19, height:19, borderRadius:'50%', background:'#0a8f5b1a', color:'var(--pango-green-deep)', fontWeight:700, fontSize:'var(--fs-11)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</span>
              {t}
            </div>
          ))}
        </InsetPanel>
        {sent ? (
          <div style={{ background:'#0a8f5b12', border:'1px solid #0a8f5b40', borderRadius:'var(--r-14)', padding:16, display:'flex', alignItems:'center', gap:11 }}>
            <span style={{ width:30, height:30, borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon name="check" size={16} strokeWidth={3} color="#fff" />
            </span>
            <div style={{ fontSize:'var(--fs-13)', fontWeight:600, lineHeight:1.4 }}>Sent to your landlord for confirmation. You'll be notified once verified.</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
Object.assign(window, { VerifyScreen });
