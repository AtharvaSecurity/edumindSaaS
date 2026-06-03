'use client';
import Link from 'next/link';
import { useAuth } from '@/store/auth';

export default function Home() {
  const theme = useAuth((s:any) => s.theme);
  const toggleTheme = useAuth((s:any) => s.toggleTheme);

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 32px', maxWidth:1000, margin:'0 auto' }}>
        <span style={{ fontSize:18, fontWeight:800, letterSpacing:'-0.5px' }}>EduMind</span>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <button onClick={toggleTheme} style={{ padding:'6px 12px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:20, cursor:'pointer', fontSize:14 }}>{theme==='light'?'🌙':'☀️'}</button>
          <Link href="/login" style={{ padding:'8px 18px', background:'var(--accent)', color:'var(--bg)', borderRadius:20, fontWeight:600, fontSize:13 }}>Sign In</Link>
        </div>
      </header>
      <main style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'60px 20px', textAlign:'center' }}>
        <div className="fade-in" style={{ maxWidth:480 }}>
          <h1 style={{ fontSize:44, fontWeight:900, letterSpacing:'-1px', lineHeight:1.1, marginBottom:16 }}>School management, beautifully simple.</h1>
          <p style={{ fontSize:15, color:'var(--text2)', marginBottom:32, lineHeight:1.6 }}>Attendance, fees, exams, library — all in one minimalist platform built for Indian schools.</p>
          <Link href="/register" style={{ padding:'14px 28px', background:'var(--accent)', color:'var(--bg)', borderRadius:30, fontWeight:700, fontSize:14, display:'inline-block' }}>Get Started Free →</Link>
        </div>
      </main>
    </div>
  );
}
