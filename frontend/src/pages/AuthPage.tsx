import { useState } from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';
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

  async function handleGoogleLogin() {
    setLoading(true);
    setError('');

    try {
      // 1. Sign in with Google through Firebase
      const { user: googleUser, idToken } = await signInWithGoogle();

      // 2. Send Firebase ID token to our backend
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

      // 3. Backend rejected the Firebase token
      if (!response.ok) {
        throw new Error(
          data.message || 'Backend authentication failed.',
        );
      }

      // 4. Backend successfully verified the user
      console.log('Backend authentication successful:', data);

      setUser({
        displayName: googleUser.displayName,
        email: googleUser.email,
        photoURL: googleUser.photoURL,
      });
    } catch (error) {
      console.error('Google authentication error:', error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Google sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="mx-auto h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-fuchsia-500/10">
              <GraduationCap className="h-10 w-10 text-fuchsia-400" />
            </div>
          )}

          <h1 className="mt-5 text-2xl font-bold">
            Google verification successful 🎉
          </h1>

          <p className="mt-2 text-slate-300">
            {user.displayName || 'Koolage student'}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {user.email || 'No email available'}
          </p>

          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            Your Google account has been successfully verified by
            Koolage.
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 w-full rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-md">
        {/* Logo / Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-500/10">
            <GraduationCap className="h-8 w-8 text-fuchsia-400" />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-fuchsia-400">
            KOOLAGE
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Welcome to Koolage
          </h1>

          <p className="mt-4 text-slate-400">
            Your college community, all in one place.
          </p>
        </div>

        {/* Authentication Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2
                className="animate-spin"
                size={20}
              />
            ) : (
              <GoogleIcon />
            )}

            {loading
              ? 'Verifying with Google...'
              : 'Continue with Google'}
          </button>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-400">
              {error}
            </div>
          )}

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            Google is used only to verify your account.
            Your Koolage profile information will be entered
            separately.
          </p>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
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