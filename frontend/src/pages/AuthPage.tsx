import { useState } from 'react';
import { GraduationCap, Loader2, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

type AuthenticatedUser = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    setError('');

    try {
      // 1. Sign in with Google through Firebase
      const { user: googleUser, idToken } = await signInWithGoogle();

      // 2. Send Firebase ID token to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      // 3. Backend rejection check
      if (!response.ok) {
        throw new Error(
          data.message || 'Backend authentication failed.',
        );
      }

      // 4. Verification successful
      console.log('Backend authentication successful:', data);

      setUser({
        displayName: googleUser.displayName,
        email: googleUser.email,
        photoURL: googleUser.photoURL,
      });
    } catch (err) {
      console.error('Google authentication error:', err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Google sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  }

  // --- SUCCESS STATE ---
  if (user) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-black px-6 text-white selection:bg-red-600 selection:text-white">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-[120px]" />

        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="relative mx-auto mb-6 h-24 w-24">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="h-full w-full rounded-2xl border-2 border-red-600/50 object-cover shadow-lg shadow-red-600/20"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-red-500">
                <GraduationCap className="h-10 w-10" />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 rounded-full bg-red-600 p-1.5 text-black">
              <ShieldCheck className="h-4 w-4 stroke-[3]" />
            </div>
          </div>

          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            Verification Done <span className="text-red-600">.</span>
          </h1>

          <p className="mt-2 text-lg font-semibold text-zinc-200">
            {user.displayName || 'Koolage Student'}
          </p>

          <p className="mt-0.5 text-xs font-mono text-zinc-500">
            {user.email || 'No email associated'}
          </p>

          <div className="mt-6 rounded-2xl border border-red-600/30 bg-red-600/10 p-4 text-xs font-medium text-red-400 backdrop-blur-sm">
            Authenticated via Koolage Core Engine.
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-3.5 font-bold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 active:scale-[0.98]"
          >
            Continue to Dashboard
          </button>
        </div>
      </main>
    );
  }

  // --- MAIN LOGIN / SIGNUP PAGE ---
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white selection:bg-red-600 selection:text-white">
      {/* Dynamic Background Accents */}
      <div className="absolute top-10 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-red-600/15 blur-[140px]" />
      <div className="absolute bottom-10 right-10 -z-10 h-60 w-60 rounded-full bg-zinc-800/40 blur-[100px]" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-red-600 shadow-inner">
            <GraduationCap className="h-7 w-7" />
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-red-600">
            KOOLAGE AUTH
          </p>

          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
            <span className="text-red-600">.</span>
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            {isSignUp
              ? 'Join your campus hub and stay ahead.'
              : 'Your college community, all in one space.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/90 p-7 shadow-2xl backdrop-blur-xl">
          {/* Main Google Trigger Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-5 py-4 font-bold text-black transition-all duration-200 hover:bg-zinc-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin text-black" size={20} />
            ) : (
              <GoogleIcon />
            )}

            <span className="text-sm font-extrabold uppercase tracking-wide">
              {loading
                ? 'Verifying...'
                : isSignUp
                ? 'Sign Up with Google'
                : 'Continue with Google'}
            </span>

            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Error Message Container */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-600/40 bg-red-600/10 px-4 py-3 text-xs font-semibold text-red-500">
              {error}
            </div>
          )}

          <p className="mt-6 text-center text-[11px] font-medium leading-relaxed text-zinc-500">
            By continuing, you agree to connect your Google profile for verification on Koolage.
          </p>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-zinc-800" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              OR
            </span>
            <div className="h-[1px] flex-1 bg-zinc-800" />
          </div>

          {/* New User Toggle Button */}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 py-3.5 text-xs font-bold text-zinc-300 transition-all hover:border-red-600/50 hover:bg-zinc-900 hover:text-white"
          >
            <UserPlus className="h-4 w-4 text-red-600" />
            {isSignUp ? (
              <span>Already have an account? <strong className="text-white underline underline-offset-4">Sign In</strong></span>
            ) : (
              <span>New to Koolage? <strong className="text-white underline underline-offset-4">Create Account</strong></span>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.72-.06-1.41-.18-2.07H12v3.92h5.23a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.92-4.18 2.92-7.24Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.83A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.83V7.64H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.36l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.14c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.16 14.63 2.25 12 2.25A9.75 9.75 0 0 0 3.3 7.64l3.24 2.53 3.24 2.53c.77-2.31 2.92-4.03 5.46-4.03Z"
      />
    </svg>
  );
}