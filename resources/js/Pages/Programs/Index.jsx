import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, CalendarDays, CreditCard, Sparkles } from 'lucide-react';
import NavBar from '@/Components/HomePage/Navbar';

export default function ProgramsIndex({ events }) {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Head title="Programs" />
            <NavBar />
            <main className="px-5 pb-20 pt-32 sm:px-8 lg:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-3xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-200">
                            <Sparkles className="h-4 w-4" /> Learn. Connect. Grow.
                        </div>
                        <h1 className="text-5xl font-black tracking-tight sm:text-7xl">Programs</h1>
                        <p className="mt-5 text-lg leading-8 text-slate-300">Explore upcoming BUITS courses, events, workshops, and experiences.</p>
                    </div>
                    {events.length === 0 ? (
                        <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">No running programs are available right now.</div>
                    ) : (
                        <div className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                            {events.map((event) => (
                                <article key={event.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] shadow-2xl shadow-indigo-950/30 transition duration-500 hover:-translate-y-2 hover:border-lime-300/50">
                                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-indigo-700 to-violet-950">
                                        {event.popupImage ? <img src={event.popupImage} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-7xl font-black text-white/20">BUITS</div>}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                                    </div>
                                    <div className="p-6">
                                        <h2 className="text-2xl font-bold">{event.title}</h2>
                                        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                                            {event.deadline && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-lime-300" /> Register by {new Date(event.deadline).toLocaleDateString()}</span>}
                                            <span className="inline-flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-lime-300" /> {event.requiresPayment ? 'Registration fee applies' : 'Free registration'}</span>
                                        </div>
                                        <Link href={`/t/${event.slug}`} className="mt-7 inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-lime-200">
                                            View program <ArrowUpRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
