/* Sample portfolio data, copied from the Pango app source. */
window.PangoData = {
  properties: [
    { id:'p1', name:'Riverside Court', area:'Kilimani, Nairobi', type:'Apartment',
      amenities:['Borehole water','Backup generator','CCTV security','Covered parking','Passenger lift','High-speed Wi-Fi','Rooftop laundry','Perimeter wall'],
      repairSummary:'5 repairs logged', repairCost:'KES 37,400',
      aiHint:'C2 has had two plumbing jobs in six weeks — replace the trap rather than reseal it.',
      floors:[
        { label:'FL 2', units:[{id:'C1',status:'overdue',tenant:'Otieno O.',rent:52000},{id:'C2',status:'paid',tenant:'Achieng A.',rent:52000},{id:'C3',status:'vacant',tenant:'',rent:52000},{id:'C4',status:'paid',tenant:'Muthoni K.',rent:52000}] },
        { label:'FL 1', units:[{id:'B1',status:'paid',tenant:'Kibet R.',rent:48000},{id:'B2',status:'soon',tenant:'Wairimu N.',rent:48000},{id:'B3',status:'paid',tenant:'Salim H.',rent:48000},{id:'B4',status:'paid',tenant:'Nduta G.',rent:48000}] },
        { label:'GRD', units:[{id:'A1',status:'paid',tenant:'Wanjiru K.',rent:45000},{id:'A2',status:'overdue',tenant:'Barasa W.',rent:45000},{id:'A3',status:'vacant',tenant:'',rent:45000},{id:'A4',status:'paid',tenant:'Njoroge P.',rent:45000}] }
      ] },
    { id:'p2', name:'Acacia Heights', area:'Westlands, Nairobi', type:'Apartment',
      amenities:['Piped water','Solar hot water','Gym','Secure parking','Lift','Fibre internet'],
      repairSummary:'2 repairs logged', repairCost:'KES 6,600',
      aiHint:'Occupancy is steady; B2 has slipped late twice this quarter.',
      floors:[
        { label:'FL 3', units:[{id:'D1',status:'paid',tenant:'Hassan M.',rent:62000},{id:'D2',status:'paid',tenant:'Atieno L.',rent:62000}] },
        { label:'FL 2', units:[{id:'C1',status:'soon',tenant:'Gitau S.',rent:58000},{id:'C2',status:'paid',tenant:'Faith W.',rent:58000}] },
        { label:'FL 1', units:[{id:'B1',status:'paid',tenant:'Omar A.',rent:55000},{id:'B2',status:'overdue',tenant:'Cherono J.',rent:55000}] },
        { label:'GRD', units:[{id:'A1',status:'vacant',tenant:'',rent:52000},{id:'A2',status:'paid',tenant:'Mwangi D.',rent:52000}] }
      ] },
    { id:'p3', name:'Baraka Villas', area:'Runda, Nairobi', type:'Standalone',
      amenities:['Private garden','Borehole','Solar backup','DSQ','Electric fence','Gated community'],
      repairSummary:'2 repairs logged', repairCost:'KES 37,500',
      aiHint:'V5 is 62 days overdue — the largest single exposure in the portfolio.',
      floors:[
        { label:'HSE', units:[{id:'V1',status:'paid',tenant:'Karanja F.',rent:120000},{id:'V2',status:'paid',tenant:'Adhiambo P.',rent:120000},{id:'V3',status:'soon',tenant:'Mutua B.',rent:135000},{id:'V4',status:'vacant',tenant:'',rent:135000},{id:'V5',status:'overdue',tenant:'Wekesa T.',rent:120000}] }
      ] },
    { id:'p4', name:'Jacaranda Mews', area:'Lavington, Nairobi', type:'Maisonette',
      amenities:['Piped & borehole water','Backup power','CCTV','Carport','Communal garden'],
      repairSummary:'2 repairs logged', repairCost:'KES 13,300',
      aiHint:'M3 falls vacant on 20 Jul — the draft listing still has no photos.',
      floors:[
        { label:'UP', units:[{id:'M1',status:'paid',tenant:'Njeri C.',rent:85000},{id:'M2',status:'paid',tenant:'Owino V.',rent:85000},{id:'M3',status:'vacant',tenant:'',rent:90000}] },
        { label:'LWR', units:[{id:'G1',status:'paid',tenant:'Said R.',rent:82000},{id:'G2',status:'overdue',tenant:'Lagat E.',rent:82000},{id:'G3',status:'paid',tenant:'Mumbi A.',rent:82000}] }
      ] }
  ],
  pending: [
    { tenant:'Muthoni Kariuki', unit:'C4', prop:'Riverside Court', items:['Rent','Water'], amount:53500, channel:'M-Pesa', tone:'#0a8f5b', ref:'SFG5H2K9QW',
      msg:'SFG5H2K9QW Confirmed. Ksh53,500.00 sent to PANGO RENTALS for account C4 on 3/7/26 at 9:14 AM. New M-PESA balance is Ksh1,240.00.' },
    { tenant:'Salim Hamisi', unit:'B3', prop:'Riverside Court', items:['Rent','Water','Electricity','Garbage'], amount:52200, channel:'KCB Bank', tone:'#1466d6', ref:'KCB8842190',
      msg:'KCB Bank: Confirmed. KES 52,200.00 received from SALIM HAMISI Ref KCB8842190 to Pango Rentals Acc on 02/07/2026.' }
  ],
  invoices: [
    { id:'INV-2051', tenant:'Wanjiru Kamau', unit:'A1', prop:'Riverside Court', period:'Jun 2026', status:'paid', total:49100 },
    { id:'INV-2052', tenant:'Barasa Wekesa', unit:'A2', prop:'Riverside Court', period:'Jun 2026', status:'overdue', total:50450 },
    { id:'INV-2053', tenant:'Otieno Ouma', unit:'C1', prop:'Riverside Court', period:'Jun 2026', status:'overdue', total:58400 },
    { id:'INV-2054', tenant:'Hassan Mohamed', unit:'D1', prop:'Acacia Heights', period:'Jun 2026', status:'paid', total:66500 },
    { id:'INV-2055', tenant:'Karanja Francis', unit:'V1', prop:'Baraka Villas', period:'Jun 2026', status:'paid', total:126500 },
    { id:'INV-2056', tenant:'Cherono Joan', unit:'B2', prop:'Acacia Heights', period:'Jun 2026', status:'sent', total:59300 },
    { id:'INV-2045', tenant:'Salim Hamisi', unit:'B3', prop:'Riverside Court', period:'Jun 2026', status:'paid', total:52200 }
  ],
  repairs: [
    { date:'29 Jun 2026', prop:'Jacaranda Mews', unit:'General', cats:['Plumbing'], task:'Unblock main drainage line', cost:9200 },
    { date:'28 Jun 2026', prop:'Riverside Court', unit:'C2', cats:['Plumbing'], task:'Fix leaking kitchen sink', cost:4500 },
    { date:'24 Jun 2026', prop:'Acacia Heights', unit:'General', cats:['Electrical'], task:'Replace stairwell bulbs', cost:2800 },
    { date:'20 Jun 2026', prop:'Riverside Court', unit:'A3', cats:['Painting'], task:'Repaint vacant studio', cost:6500 },
    { date:'18 Jun 2026', prop:'Baraka Villas', unit:'General', cats:['General'], task:'Service backup generator', cost:15500 },
    { date:'14 Jun 2026', prop:'Jacaranda Mews', unit:'M1', cats:['Electrical'], task:'Fix water-heater trip', cost:4100 },
    { date:'12 Jun 2026', prop:'Riverside Court', unit:'B3', cats:['Electrical'], task:'Rewire faulty socket', cost:3200 },
    { date:'22 May 2026', prop:'Riverside Court', unit:'C2', cats:['Plumbing','Carpentry'], task:'Replace cabinet under leaking sink', cost:5200 }
  ],
  vacancies: [
    { title:'Spacious 2-Bedroom at Riverside Court', unit:'C3', prop:'Riverside Court', area:'Kilimani, Nairobi', rent:52000, available:'Jul 15, 2026', status:'published', views:184, enquiries:9,
      amenities:['Borehole water','Backup generator','CCTV security','Covered parking'] },
    { title:'Vacant Studio — perfect for a young professional', unit:'A3', prop:'Riverside Court', area:'Kilimani, Nairobi', rent:45000, available:'Available now', status:'published', views:97, enquiries:6,
      amenities:['Fibre internet','CCTV security','Covered parking'] },
    { title:'4-Bed Villa coming up at Baraka Villas', unit:'V4', prop:'Baraka Villas', area:'Runda, Nairobi', rent:135000, available:'Aug 1, 2026', status:'published', views:212, enquiries:14,
      amenities:['Private garden','DSQ','Solar backup','Gated community'] },
    { title:'Upper maisonette — Jacaranda Mews', unit:'M3', prop:'Jacaranda Mews', area:'Lavington, Nairobi', rent:90000, available:'Jul 20, 2026', status:'draft', views:0, enquiries:0,
      amenities:['Backup power','CCTV','Carport','Communal garden'] }
  ],
  overdue: [
    { tenant:'Wekesa Timothy', unit:'V5', prop:'Baraka Villas', amount:138400, days:62, since:'Apr 28' },
    { tenant:'Otieno Ouma', unit:'C1', prop:'Riverside Court', amount:58400, days:41, since:'May 19' },
    { tenant:'Barasa Wekesa', unit:'A2', prop:'Riverside Court', amount:50450, days:28, since:'Jun 1' },
    { tenant:'Lagat Eric', unit:'G2', prop:'Jacaranda Mews', amount:84300, days:19, since:'Jun 10' },
    { tenant:'Cherono Joan', unit:'B2', prop:'Acacia Heights', amount:59300, days:8, since:'Jun 21' }
  ],
  managers: [
    { id:'m1', name:'Grace Wambui', email:'grace@apexpm.co.ke', phone:'+254 712 004 118', title:'Property Manager', props:['Riverside Court','Acacia Heights','Baraka Villas','Jacaranda Mews'], status:'active', added:'Jan 2025' },
    { id:'m2', name:'Peter Kamau', email:'peter.k@apexpm.co.ke', phone:'+254 720 887 342', title:'Caretaker', props:['Riverside Court'], status:'active', added:'Mar 2025' },
    { id:'m3', name:'Alice Nyambura', email:'alice.n@apexpm.co.ke', phone:'+254 701 233 909', title:'Caretaker', props:['Acacia Heights'], status:'active', added:'Jun 2025' },
    { id:'m4', name:'Daniel Otieno', email:'daniel.o@apexpm.co.ke', phone:'+254 733 908 552', title:'Assistant Manager', props:['Baraka Villas','Jacaranda Mews'], status:'invited', added:'2 days ago' }
  ]
};
