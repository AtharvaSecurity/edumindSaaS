'use client';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const API = "http://localhost:3001/api/v1";

export default function Dashboard() {
  const user = useAuth((s:any) => s.user);
  const tenant = useAuth((s:any) => s.tenant);
  const token = useAuth((s:any) => s.token);
  const isAuth = useAuth((s:any) => s.isAuth);
  const theme = useAuth((s:any) => s.theme);
  const logout = useAuth((s:any) => s.logout);
  const toggleTheme = useAuth((s:any) => s.toggleTheme);
  const router = useRouter();
  
  const [tab, setTab] = useState(0);
  const [msg, setMsg] = useState('');
  const [data, setData] = useState<any>({ students:[], exams:[], events:[], books:[], routes:[], notices:[] });
  const [showForm, setShowForm] = useState(false);
  const [attList, setAttList] = useState<any[]>([]);

  const h = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const toast = (m: string) => { setMsg(m); setTimeout(()=>setMsg(''),2000); };

  useEffect(() => { if(!isAuth) router.push('/login'); else load(); }, [isAuth]);
  useEffect(() => { document.body.className = theme; }, [theme]);

  const load = async () => {
    try {
      const [st,ex,ev,bk,rt,nt] = await Promise.all([
        fetch(`${API}/students?limit=200`,{headers:h}).then(r=>r.json()),
        fetch(`${API}/exams`,{headers:h}).then(r=>r.json()),
        fetch(`${API}/timetable/events/list`,{headers:h}).then(r=>r.json()),
        fetch(`${API}/library/books`,{headers:h}).then(r=>r.json()),
        fetch(`${API}/transport/routes`,{headers:h}).then(r=>r.json()),
        fetch(`${API}/notices`,{headers:h}).then(r=>r.json()),
      ]);
      setData({ students:st.data||[], exams:ex.data||[], events:ev.data||[], books:bk.data||[], routes:rt.data||[], notices:nt.data||[] });
    } catch(e) {}
  };

  const post = async (url: string, body: any) => {
    try {
      const r = await fetch(`${API}${url}`,{method:'POST',headers:h,body:JSON.stringify(body)});
      const d = await r.json();
      if(d.success){ toast('✓ Done!'); load(); setShowForm(false); } else toast('✗ '+d.error);
    } catch { toast('✗ Error'); }
  };

  const markAtt = (sid: string, st: string) => {
    setAttList((p:any[]) => { const i = p.findIndex(a=>a.studentId===sid); if(i>=0){ const n=[...p]; n[i]={studentId:sid,status:st}; return n; } return [...p,{studentId:sid,status:st}]; });
  };

  const tabs = ['Home','Students','Attendance','Fees','Exams','Events','Library','Transport','Notices'];
  const icons = ['🏠','👥','✅','💰','📝','📅','📚','🚌','📢'];

  const css: any = {
    page: { minHeight:'100vh', background:'var(--bg)', display:'flex' },
    sidebar: { width:200, background:'var(--surface)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', height:'100vh', position:'sticky', top:0, flexShrink:0 },
    main: { flex:1, padding:28, overflow:'auto', maxHeight:'100vh' },
    card: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:18, marginBottom:14, boxShadow:'var(--shadow)' },
    inp: { width:'100%', padding:'10px 14px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text)', fontSize:13 },
    btn: { padding:'8px 16px', background:'var(--accent)', color:'var(--bg)', border:'none', borderRadius:10, fontWeight:600, fontSize:12, cursor:'pointer', whiteSpace:'nowrap' },
    btn2: { padding:'6px 12px', background:'transparent', color:'var(--text)', border:'1px solid var(--border)', borderRadius:8, fontWeight:500, fontSize:11, cursor:'pointer' },
    tag: { padding:'4px 10px', borderRadius:6, fontSize:10, fontWeight:700, border:'1px solid var(--border)', cursor:'pointer', background:'var(--bg2)', color:'var(--text2)' },
    tagActive: { padding:'4px 10px', borderRadius:6, fontSize:10, fontWeight:700, border:'1px solid var(--accent)', cursor:'pointer', background:'var(--accent)', color:'var(--bg)' },
  };

  if(!isAuth) return null;

  return (
    <div style={css.page}>
      {msg && <div style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', zIndex:99, padding:'8px 20px', background:'var(--accent)', color:'var(--bg)', borderRadius:20, fontWeight:600, fontSize:12 }}>{msg}</div>}

      <aside style={css.sidebar}>
        <div style={{ padding:'18px 16px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ fontSize:17, fontWeight:800 }}>EduMind</div>
          <div style={{ fontSize:10, color:'var(--text2)', marginTop:2 }}>{tenant?.name}</div>
        </div>
        <nav style={{ flex:1, padding:8, display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
          {tabs.map((t,i) => (
            <button key={i} onClick={()=>setTab(i)} style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:8,border:'none',cursor:'pointer',fontSize:12,fontWeight:tab===i?700:400,background:tab===i?'var(--accent)':'transparent',color:tab===i?'var(--bg)':'var(--text)',textAlign:'left',width:'100%',transition:'all 0.15s' }}>
              {icons[i]} {t}
            </button>
          ))}
        </nav>
        <div style={{ padding:10, borderTop:'1px solid var(--border)' }}>
          <button onClick={toggleTheme} style={{ width:'100%',padding:7,background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:8,cursor:'pointer',fontSize:14,marginBottom:6 }}>{theme==='light'?'🌙 Dark':'☀️ Light'}</button>
          <div style={{ display:'flex',alignItems:'center',gap:6,padding:'4px 0' }}>
            <div style={{ width:22,height:22,borderRadius:6,background:'var(--accent)',color:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800 }}>{user?.fullName?.[0]||'U'}</div>
            <div style={{ flex:1,minWidth:0 }}><div style={{ fontSize:11,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{user?.fullName||'User'}</div></div>
          </div>
          <button onClick={()=>{logout();router.push('/login');}} style={{ width:'100%',marginTop:4,padding:5,background:'transparent',border:'none',color:'var(--text2)',cursor:'pointer',fontSize:10,textAlign:'left' }}>Sign out</button>
        </div>
      </aside>

      <main style={css.main}>
        {tab===0 && <div className="fade-in">
          <h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Good morning{user?.fullName?', '+user.fullName.split(' ')[0]:''}</h1>
          <p style={{ color:'var(--text2)', fontSize:12, marginBottom:28 }}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
            {[{l:'Students',v:data.students.length},{l:'Exams',v:data.exams.length},{l:'Books',v:data.books.length},{l:'Events',v:data.events.length}].map((s,i)=>(
              <div key={i} style={{...css.card,textAlign:'center',cursor:'pointer'}} onClick={()=>setTab(i+1)} className="hover-lift">
                <div style={{ fontSize:26,fontWeight:800 }}>{s.v}</div><div style={{ fontSize:10,color:'var(--text2)',marginTop:4 }}>{s.l}</div>
              </div>
            ))}
          </div>
          {data.notices.length>0 && <div style={css.card}><h3 style={{fontWeight:700,fontSize:13,marginBottom:8}}>📢 Notices</h3>{data.notices.slice(0,3).map((n:any)=><div key={n.id} style={{padding:'5px 0',fontSize:12}}><b>{n.title}</b><span style={{color:'var(--text2)',marginLeft:8}}>{n.content?.slice(0,40)}...</span></div>)}</div>}
        </div>}

        {tab===1 && <div className="fade-in">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}><h2 style={{fontSize:18,fontWeight:800}}>Students · {data.students.length}</h2><button onClick={()=>setShowForm(!showForm)} style={css.btn}>{showForm?'Close':'+ Add'}</button></div>
          {showForm && <div style={css.card}>
            <form onSubmit={e=>{e.preventDefault();const f=new FormData(e.target as HTMLForm);post('/students',{...Object.fromEntries(f),password:'student123',rollNumber:parseInt(f.get('rollNumber')as string)||undefined});}} style={{display:'flex',flexDirection:'column',gap:8}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}><input name="fullName" style={css.inp} placeholder="Full name *" required /><input name="phone" style={css.inp} placeholder="Phone" /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}><input name="rollNumber" type="number" style={css.inp} placeholder="Roll no" /><select name="gender" style={css.inp}><option value="M">Male</option><option value="F">Female</option></select></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}><input name="parentName" style={css.inp} placeholder="Parent name" /><input name="parentPhone" style={css.inp} placeholder="Parent phone" /></div>
              <button type="submit" style={css.btn}>Enroll Student</button>
            </form>
          </div>}
          {data.students.map((s:any)=><div key={s.id} style={{...css.card,padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontWeight:600,fontSize:13}}>{s.fullName}</div><div style={{fontSize:10,color:'var(--text2)',marginTop:2}}>{s.admissionId}</div></div><span style={{fontSize:11,color:'var(--text2)'}}>Roll: {s.rollNumber||'--'}</span></div>)}
        </div>}

        {tab===2 && <div className="fade-in"><h2 style={{fontSize:18,fontWeight:800,marginBottom:18}}>Attendance</h2><div style={css.card}>{data.students.map((s:any)=>{const a=attList.find(x=>x.studentId===s.id);return <div key={s.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid var(--border)'}}><span style={{fontSize:12,fontWeight:600}}>{s.fullName}</span><div style={{display:'flex',gap:4}}>{['P','A','L'].map((o,i)=>{const st=['PRESENT','ABSENT','LATE'][i];return <button key={o} onClick={()=>markAtt(s.id,st)} style={a?.status===st?css.tagActive:css.tag}>{o}</button>})}</div></div>})}<button onClick={async()=>{await fetch(`${API}/attendance`,{method:'POST',headers:h,body:JSON.stringify({date:new Date().toISOString().split('T')[0],records:attList})});toast('✓ Saved!');load();}} style={{...css.btn,marginTop:10,width:'100%'}}>Save Attendance</button></div></div>}

        {tab===3 && <div className="fade-in"><h2 style={{fontSize:18,fontWeight:800,marginBottom:18}}>Fees</h2><div style={{...css.card,textAlign:'center',padding:28}}><p style={{color:'var(--text2)',fontSize:13,marginBottom:14}}>Collect fee via Razorpay</p><button onClick={()=>new (window as any).Razorpay({key:'rzp_test_YourKeyHere',amount:50000,currency:'INR',name:tenant?.name,handler:(r:any)=>toast('✓ Paid! '+r.razorpay_payment_id),theme:{color:'#212529'}}).open()} style={css.btn}>Collect ₹500</button></div></div>}

        {tab===4 && <div className="fade-in"><h2 style={{fontSize:18,fontWeight:800,marginBottom:18}}>Exams · {data.exams.length}</h2><div style={css.card}><form onSubmit={e=>{e.preventDefault();const f=new FormData(e.target as HTMLForm);post('/exams',{...Object.fromEntries(f),maxMarks:100,passMarks:33});}} style={{display:'flex',flexDirection:'column',gap:8}}><input name="name" style={css.inp} placeholder="Exam name *" required /><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}><select name="type" style={css.inp}><option>UNIT_TEST</option><option>HALF_YEARLY</option><option>ANNUAL</option></select><input name="startDate" type="date" style={css.inp} /></div><button type="submit" style={css.btn}>Create Exam</button></form></div>{data.exams.map((e:any)=><div key={e.id} style={{...css.card,padding:'10px 14px'}}><b style={{fontSize:13}}>{e.name}</b><span style={{color:'var(--text2)',fontSize:11,marginLeft:8}}>{e.type}</span></div>)}</div>}

        {tab===5 && <div className="fade-in"><h2 style={{fontSize:18,fontWeight:800,marginBottom:18}}>Events · {data.events.length}</h2><div style={css.card}><form onSubmit={e=>{e.preventDefault();const f=new FormData(e.target as HTMLForm);post('/timetable/events',Object.fromEntries(f));}} style={{display:'flex',gap:8}}><input name="title" style={css.inp} placeholder="Event name *" required /><input name="eventDate" type="date" style={{...css.inp,width:140}} required /><button type="submit" style={css.btn}>Add</button></form></div>{data.events.map((e:any)=><div key={e.id} style={{...css.card,padding:'10px 14px',display:'flex',justifyContent:'space-between'}}><b style={{fontSize:13}}>{e.title}</b><span style={{fontSize:11,color:'var(--text2)'}}>{e.eventDate?new Date(e.eventDate).toLocaleDateString('en-IN'):''}</span></div>)}</div>}

        {tab===6 && <div className="fade-in"><h2 style={{fontSize:18,fontWeight:800,marginBottom:18}}>Library · {data.books.length}</h2><div style={css.card}><form onSubmit={e=>{e.preventDefault();const f=new FormData(e.target as HTMLForm);post('/library/books',{...Object.fromEntries(f),quantity:parseInt(f.get('quantity')as string)||1});}} style={{display:'flex',flexDirection:'column',gap:8}}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}><input name="title" style={css.inp} placeholder="Title *" required /><input name="author" style={css.inp} placeholder="Author *" required /></div><button type="submit" style={css.btn}>Add Book</button></form></div>{data.books.map((b:any)=><div key={b.id} style={{...css.card,padding:'10px 14px',display:'flex',justifyContent:'space-between'}}><span style={{fontSize:13}}><b>{b.title}</b></span><span style={{fontSize:11,color:'var(--text2)'}}>{b.author}</span></div>)}</div>}

        {tab===7 && <div className="fade-in"><h2 style={{fontSize:18,fontWeight:800,marginBottom:18}}>Transport · {data.routes.length}</h2><div style={css.card}><form onSubmit={e=>{e.preventDefault();const f=new FormData(e.target as HTMLForm);post('/transport/routes',Object.fromEntries(f));}} style={{display:'flex',flexDirection:'column',gap:8}}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}><input name="routeName" style={css.inp} placeholder="Route *" required /><input name="vehicleNo" style={css.inp} placeholder="Vehicle no *" required /></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}><input name="driverName" style={css.inp} placeholder="Driver" /><input name="driverPhone" style={css.inp} placeholder="Phone" /></div><button type="submit" style={css.btn}>Add Route</button></form></div>{data.routes.map((r:any)=><div key={r.id} style={{...css.card,padding:'10px 14px'}}><b style={{fontSize:13}}>{r.routeName}</b><span style={{color:'var(--text2)',fontSize:11,marginLeft:8}}>{r.vehicleNo} | {r.driverName}</span></div>)}</div>}

        {tab===8 && <div className="fade-in"><h2 style={{fontSize:18,fontWeight:800,marginBottom:18}}>Notices · {data.notices.length}</h2><div style={css.card}><form onSubmit={e=>{e.preventDefault();const f=new FormData(e.target as HTMLForm);post('/notices',Object.fromEntries(f));}} style={{display:'flex',flexDirection:'column',gap:8}}><input name="title" style={css.inp} placeholder="Title *" required /><textarea name="content" style={{...css.inp,minHeight:60,resize:'vertical'}} placeholder="Content *" required /><button type="submit" style={css.btn}>Post Notice</button></form></div>{data.notices.map((n:any)=><div key={n.id} style={{...css.card,padding:'12px 14px'}}><div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{n.title}</div><div style={{fontSize:11,color:'var(--text2)'}}>{n.content}</div></div>)}</div>}
      </main>
    </div>
  );
}
