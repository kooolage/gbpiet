import { Heart, MessageCircle, Users } from 'lucide-react';

const features = [
  ['Find your vibe', 'Match and chat with people who match your preferences.', Heart],
  ['Community', 'Share posts, join conversations, and discover what is trending.', Users],
  ['Private notes', 'Keep personal notes and ideas close at hand.', MessageCircle],
] as const;

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fuchsia-400">GBPiet</p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">Find your people. Feel the vibe.</h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-300">A progressive web app for meaningful matches, real-time chats, communities, notes, discovery, and premium experiences.</p>
        <button className="mt-8 rounded-xl bg-fuchsia-500 px-5 py-3 font-semibold text-white transition hover:bg-fuchsia-400">Start discovering</button>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {features.map(([title, description, Icon]) => (
            <article key={title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <Icon className="text-fuchsia-400" />
              <h2 className="mt-4 text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
