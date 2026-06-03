'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = 'http://localhost:3001/api/v1';

export default function Login() {
  const router = useRouter();
  const login = useAuth((s:any) => s.login);
  const theme = useAuth((s:any) => s.theme);
  const toggleTheme = useAuth((s:any) => s.toggleTheme);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ tenantSubdomain:'demo-school', email:'admin@demoschool.edu.in', password:'Admin@123', remember:true });

  useEffect(() => {
    const saved = localStorage.getItem('edumind-creds');
    if (saved) { try { setForm({...JSON.parse(saved), remember:true}); } catch {} }
  }, []);

  const go = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true); setMsg('');
    try {
      const r = await fetch(`${API}/auth/login`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ email:form.email, password:form.password, tenantSubdomain:form.tenantSubdomain })
      });
      const d = await r.json();
      if(d.success){ 
        if(form.remember) localStorage.setItem('edumind-creds', JSON.stringify({tenantSubdomain:form.tenantSubdomain, email:form.email, password:form.password}));
        login(d.data.user, d.data.tenant, d.data.tokens.accessToken); 
        router.push('/dashboard'); 
      } else setMsg(d.error||'Login failed');
    } catch { setMsg('Backend not running. Start: cd ~/vidyaerp/apps/server && npm run dev'); }
    setLoading(false);
  };

  const inp = { padding:'12px 16px', border:'2px solid var(--border)', borderRadius:12, background:'var(--bg2)', color:'var(--text)', fontSize:14, outline:'none', width:'100%' };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <button onClick={toggleTheme} style={{ position:'fixed', top:20, right:20, padding:'8px 14px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:20, cursor:'pointer', fontSize:14, zIndex:10 }}>{theme==='light'?'🌙 Dark':'☀️ Light'}</button>
      <div className="fade-in" style={{ width:400, padding:40, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:24, boxShadow:'var(--shadow)' }}>
        <div style={{ marginBottom:32, textAlign:'center' }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🎓</div>
          <h1 style={{ fontSize:24, fontWeight:800 }}>Welcome back</h1>
          <p style={{ fontSize:14, color:'var(--text2)' }}>Sign in to your school</p>
        </div>
        {msg && <div style={{ padding:12, borderRadius:12, marginBottom:20, fontSize:13, fontWeight:500, textAlign:'center', background:msg.includes('not running')?'#fff5f5':'#f0fdf4', color:msg.includes('not running')?'var(--red)':'var(--green)' }}>{msg}</div>}
        <form onSubmit={go} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div><label style={{ fontSize:12, fontWeight:600, color:'var(--text2)', display:'block', marginBottom:6 }}>School Code</label><input value={form.tenantSubdomain} onChange={e=>setForm({...form,tenantSubdomain:e.target.value})} style={inp} required /></div>
          <div><label style={{ fontSize:12, fontWeight:600, color:'var(--text2)', display:'block', marginBottom:6 }}>Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email" style={inp} required /></div>
          <div><label style={{ fontSize:12, fontWeight:600, color:'var(--text2)', display:'block', marginBottom:6 }}>Password</label><input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" style={inp} required /></div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}><input type="checkbox" checked={form.remember} onChange={e=>setForm({...form,remember:e.target.checked})} style={{ width:16,height:16 }} id="rem" /><label htmlFor="rem" style={{ fontSize:12, color:'var(--text2)', cursor:'pointer' }}>Remember me</label></div>
          <button type="submit" disabled={loading} style={{ width:'100%',padding:14,background:loading?'var(--border)':'var(--accent)',color:loading?'var(--text2)':'var(--bg)',border:'none',borderRadius:14,fontWeight:700,fontSize:15,cursor:loading?'wait':'pointer' }}>{loading?'Signing in...':'Sign In →'}</button>
        </form>
        <p style={{ textAlign:'center', marginTop:24, fontSize:13, color:'var(--text2)' }}>New school? <Link href="/register" style={{ color:'var(--accent)', fontWeight:700 }}>Create free account</Link></p>
      </div>
    </div>
  );
}
