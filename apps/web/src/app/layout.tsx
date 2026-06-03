'use client';
import './globals.css';
import { useAuth } from '@/store/auth';
import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = useAuth((s:any) => s.theme);
  useEffect(() => { document.documentElement.className = theme; document.body.className = theme; }, [theme]);
  return <html className={theme}><head><title>EduMind</title><script src="https://checkout.razorpay.com/v1/checkout.js" async /></head><body className={theme}>{children}</body></html>;
}
