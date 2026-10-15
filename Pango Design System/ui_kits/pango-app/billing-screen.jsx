const { Card, StatCard, StatusChip, Money, SectionHeading, Select, Button, Tag, Icon, InsetPanel } = window.PangoDesignSystem_86a349;

function InvoiceTable({ rows }) {
  return (
    <Card padding={0} style={{ overflow:'hidden' }}>
      <div style={{ display:'grid', gridTemplateColumns:'110px 1.4fr 1.4fr 110px 120px 110px', gap:16, padding:'12px 20px', borderBottom:'1px solid var(--border-card)', background:'var(--grey-50)' }}>
        {['INVOICE','TENANT','PROPERTY','PERIOD','TOTAL','STATUS'].map(h => (
          <div key={h} style={{ fontSize:'var(--fs-10-5)', fontWeight:700, color:'var(--text-label)', letterSpacing:'var(--ls-label)' }}>{h}</div>
        ))}
      </div>
      {rows.map(r => (
        <div key={r.id} style={{ display:'grid', gridTemplateColumns:'110px 1.4fr 1.4fr 110px 120px 110px', gap:16, padding:'var(--pad-row)', borderBottom:'1px solid var(--grey-150)', alignItems:'center' }}>
          <Money value={r.id} size="var(--fs-12-5)" weight={600} />
          <div style={{ fontWeight:700, fontSize:'var(--fs-13-5)' }}>{r.tenant}</div>
          <div style={{ fontSize:'var(--fs-12-5)', color:'var(--text-muted)' }}>{r.unit} · {r.prop}</div>
          <div style={{ fontSize:'var(--fs-12-5)', color:'var(--text-secondary)', fontWeight:600 }}>{r.period}</div>
          <Money currency="KES" amount={r.total} color={r.status === 'overdue' ? 'var(--overdue-fg)' : undefined} />
          <div><StatusChip status={r.status} /></div>
        </div>
      ))}
    </Card>
  );
}

function BillingScreen() {
  const D = window.PangoData;
  const [prop, setProp] = React.useState('all');
  const rows = prop === 'all' ? D.invoices : D.invoices.filter(i => i.prop === prop);
  const billed = D.invoices.reduce((a,i) => a + i.total, 0);
  const collected = D.invoices.filter(i => i.status === 'paid').reduce((a,i) => a + i.total, 0);
  const unpaid = D.overdue.reduce((a,o) => a + o.amount, 0);
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'var(--gap-cards)', marginBottom:20 }}>
        <StatCard label="Billed (Jun)" value={'KES ' + billed.toLocaleString('en-US')} trend={D.invoices.length + ' invoices'} />
        <StatCard label="Rent collected" value={'KES ' + collected.toLocaleString('en-US')} trend="cleared & reconciled" trendColor="var(--paid)" valueColor="var(--paid)" />
        <StatCard label="Unpaid rent" value={'KES ' + unpaid.toLocaleString('en-US')} trend={D.overdue.length + ' unpaid tenants'} trendColor="var(--overdue-fg)" valueColor="var(--overdue-fg)" />
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, flexWrap:'wrap' }}>
        <Select value={prop} onChange={e => setProp(e.target.value)}
          options={[{ value:'all', label:'All properties' }].concat(D.properties.map(p => ({ value:p.name, label:p.name })))} />
        <Select options={[{ value:'jun', label:'Jun 2026' }]} style={{ minWidth:130 }} />
        <Select options={[{ value:'all', label:'Any status' }]} style={{ minWidth:130 }} />
        <Button variant="quiet" size="sm" icon={<Icon name="download" size={15} strokeWidth={1.9} />} style={{ marginLeft:'auto' }}>Export</Button>
      </div>
      <InvoiceTable rows={rows} />

      <SectionHeading style={{ margin:'26px 0 14px' }}>Unpaid rent</SectionHeading>
      <Card padding={0} style={{ overflow:'hidden' }}>
        {D.overdue.map(o => (
          <div key={o.tenant} style={{ display:'flex', alignItems:'center', gap:16, padding:'var(--pad-row)', borderBottom:'1px solid var(--grey-150)' }}>
            <div style={{ minWidth:180 }}>
              <div style={{ fontWeight:700, fontSize:'var(--fs-13-5)' }}>{o.tenant}</div>
              <div style={{ fontSize:'var(--fs-12)', color:'var(--text-faint)' }}>{o.unit} · {o.prop}</div>
            </div>
            <Tag tone={o.days > 45 ? '#b32a20' : o.days > 20 ? '#d98a00' : '#7a7a7a'} size="xs">{o.days} days · since {o.since}</Tag>
            <Money currency="KES" amount={o.amount} color="var(--overdue-fg)" style={{ marginLeft:'auto' }} />
            <Button size="sm">Remind</Button>
          </div>
        ))}
      </Card>
    </div>
  );
}
Object.assign(window, { BillingScreen, InvoiceTable });
