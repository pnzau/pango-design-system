const { PangoMark, Button, Input, EyebrowLabel, Checkbox } = window.PangoDesignSystem_86a349;

function LoginScreen({ onSignIn }) {
  const [remember, setRemember] = React.useState(true);
  return (
    <div style={{ height:'100%', background:'var(--surface-app)', color:'var(--text-body)', fontFamily:'var(--font-body)', display:'flex' }}>
      <div style={{ flex:1, minWidth:0, background:'var(--surface-auth-gradient)', color:'#fff', padding:'56px 52px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        <PangoMark size="lg" tone="black" tagline />
        <div style={{ maxWidth:420 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-38)', lineHeight:'var(--lh-tight)', letterSpacing:'var(--ls-display-xl)', margin:'0 0 18px' }}>Every unit, tenant and shilling in one place.</h1>
          <p style={{ color:'#b6b6b6', fontSize:'var(--fs-15)', lineHeight:'var(--lh-prose)', margin:0 }}>Collect rent, log repairs, publish vacancies and give your managers exactly the access they need — from one dashboard.</p>
        </div>
        <div style={{ display:'flex', gap:26, flexWrap:'wrap' }}>
          {[['4','Properties'],['Ksh 1.9M','Collected in June'],['M-Pesa','& bank reconciliation']].map(([v,l]) => (
            <div key={l}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-26)' }}>{v}</div>
              <div style={{ fontSize:'var(--fs-12)', color:'var(--text-on-dark-muted)', fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width:'min(46%,520px)', flexShrink:0, background:'var(--surface-card)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 44px' }}>
        <div style={{ width:'100%', maxWidth:340 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--fs-25)', letterSpacing:'-.4px', margin:'0 0 6px' }}>Welcome back</h2>
          <p style={{ color:'var(--text-muted)', fontSize:'var(--fs-13-5)', margin:'0 0 26px' }}>Sign in to manage your portfolio</p>
          <EyebrowLabel style={{ marginBottom:7 }}>EMAIL ADDRESS</EyebrowLabel>
          <Input tone="auth" type="email" value="james.mwangi@gmail.com" onChange={()=>{}} style={{ marginBottom:16 }} />
          <EyebrowLabel style={{ marginBottom:7 }}>PASSWORD</EyebrowLabel>
          <Input tone="auth" type="password" placeholder="••••••••" style={{ marginBottom:10 }} />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <label onClick={() => setRemember(!remember)} style={{ display:'flex', alignItems:'center', gap:7, fontSize:'var(--fs-12-5)', color:'var(--grey-1000)', fontWeight:600, cursor:'pointer' }}>
              <Checkbox checked={remember} size={15} /> Remember me
            </label>
            <a href="#" style={{ fontSize:'var(--fs-12-5)' }}>Forgot password?</a>
          </div>
          <Button size="lg" block onClick={onSignIn} style={{ marginBottom:14 }}>Sign in</Button>
          <div style={{ textAlign:'center', fontSize:'var(--fs-13)', color:'var(--text-muted)' }}>New to Pango? <a href="#" style={{ color:'var(--text-body)' }}>Create an account</a></div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { LoginScreen });
