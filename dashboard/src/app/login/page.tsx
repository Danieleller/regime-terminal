"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "options" | "email" | "phone" | "phone-verify";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("options");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { hd: "goodnessgardens.net" },
      },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else { window.location.href = "/"; }
  }

  async function handlePhoneSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) { setError(error.message); setLoading(false); }
    else { setMode("phone-verify"); setLoading(false); }
  }

  async function handlePhoneVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
    if (error) { setError(error.message); setLoading(false); }
    else { window.location.href = "/"; }
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-[#2a2a3a] bg-[#12121f] text-[#e0e0e0] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4ade80]";
  const btnClass =
    "w-full flex items-center justify-center gap-2 border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-sm font-mono text-[#a0a0b0] hover:bg-[#1a1a2e] transition-colors disabled:opacity-50";
  const primaryBtn =
    "w-full bg-[#4ade80] text-[#0a0a0f] rounded-lg px-4 py-2.5 text-sm font-mono font-medium hover:opacity-90 transition-opacity disabled:opacity-50";

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="bg-[#12121f] rounded-xl border border-[#2a2a3a] p-8 w-full max-w-sm text-center">
        <h1 className="text-xl font-mono font-bold text-[#e0e0e0] mb-1">
          Regime Terminal
        </h1>
        <p className="text-xs font-mono text-[#6a6a7a] mb-6">
          HMM Trading Dashboard
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm font-mono">
            {error}
          </div>
        )}

        {mode === "options" && (
          <div className="space-y-3">
            <button onClick={handleGoogleSignIn} disabled={loading} className={btnClass}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2a2a3a]" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-[#12121f] px-2 text-[#6a6a7a]">or</span></div>
            </div>
            <button onClick={() => setMode("email")} className={btnClass}>Sign in with Email</button>
            <button onClick={() => setMode("phone")} className={btnClass}>Sign in with Phone</button>
          </div>
        )}

        {mode === "email" && (
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
            <button type="submit" disabled={loading} className={primaryBtn}>{loading ? "Signing in…" : "Sign in"}</button>
            <button type="button" onClick={() => { setMode("options"); setError(""); }} className="w-full text-sm font-mono text-[#6a6a7a] hover:underline">Back</button>
          </form>
        )}

        {mode === "phone" && (
          <form onSubmit={handlePhoneSendOtp} className="space-y-3">
            <input type="tel" placeholder="+1 (555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputClass} />
            <button type="submit" disabled={loading} className={primaryBtn}>{loading ? "Sending…" : "Send code"}</button>
            <button type="button" onClick={() => { setMode("options"); setError(""); }} className="w-full text-sm font-mono text-[#6a6a7a] hover:underline">Back</button>
          </form>
        )}

        {mode === "phone-verify" && (
          <form onSubmit={handlePhoneVerify} className="space-y-3">
            <p className="text-sm font-mono text-[#6a6a7a]">Code sent to {phone}</p>
            <input type="text" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} className={`${inputClass} text-center tracking-widest`} />
            <button type="submit" disabled={loading} className={primaryBtn}>{loading ? "Verifying…" : "Verify"}</button>
            <button type="button" onClick={() => { setMode("phone"); setError(""); }} className="w-full text-sm font-mono text-[#6a6a7a] hover:underline">Change number</button>
          </form>
        )}
      </div>
    </div>
  );
}
