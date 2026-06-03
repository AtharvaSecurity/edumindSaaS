'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const login = useAuth((s:any) => s.login);
  const [msg, setMsg] = useState('');

  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('Creating...');
    const f = new FormData(e.target as HTMLFormElement);
    try {
      const r = await fetch('http://127.0.0.1:3001/api/v1/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(Object.fromEntries(f)) });
      const d = await r.json();
      if(d.success){ login(d.data.user, d.data.tenant, d.data.tokens.accessToken); router.push('/dashboard'); }
      else setMsg(d.error||'Failed');
    } catch { setMsg('Cannot connect.'); }
  };

  const s = { padding:'10px 14px', border:'1px solid var(--border)', borderRadius:12, background:'var(--bg2)', color:'var(--text)', fontSize:13, outline:'none', width:'100%' };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <form onSubmit={go} className="fade-in" style={{ width:440, padding:36, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:24, boxShadow:'var(--shadow)' }}>
        <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Create school</h1>
        <p style={{ fontSize:13, color:'var(--text2)', marginBottom:20 }}>Free for up to 50 students</p>
        {msg && <div style={{ padding:10, borderRadius:10, marginBottom:14, fontSize:12, background:msg.includes('Creating')?'#f0f9ff':'#fff5f5', color:msg.includes('Creating')?'#0284c7':'var(--red)' }}>{msg}</div>}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <input name="schoolName" placeholder="School name" style={s} required />
          <input name="subdomain" placeholder="Subdomain" style={s} required />
          <input name="adminFullName" placeholder="Your name" style={s} required />
          <input name="adminPhone" placeholder="Phone" style={s} />
        </div>
        <input name="adminEmail" type="email" placeholder="Email" style={{...s,marginTop:10}} required />
        <input name="adminPassword" type="password" placeholder="Password (min 8 chars)" style={{...s,marginTop:10}} required />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10 }}>
          <input name="city" placeholder="City" style={s} required />
          <input name="state" placeholder="State" style={s} required />
        </div>
        <button type="submit" style={{ width:'100%', marginTop:16, padding:13, background:'var(--accent)', color:'var(--bg)', border:'none', borderRadius:14, fontWeight:700, fontSize:14, cursor:'pointer' }}>Create School →</button>
        <p style={{ textAlign:'center', marginTop:16, fontSize:12, color:'var(--text2)' }}>Have an account? <Link href="/login" style={{ color:'var(--accent)', fontWeight:600 }}>Sign in</Link></p>
      </form>
    </div>
  );
}
