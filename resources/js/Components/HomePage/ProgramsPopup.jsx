import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, CalendarDays, X, Sparkles } from 'lucide-react';

export default function ProgramsPopup() {
    const { props } = usePage();
    const programs = props.publicPrograms || [];
    const [visible, setVisible] = useState(false);
    const program = programs[0];
    const dismissalKey = program
        ? `buits-program-popup-${program.id}-${program.popupImage || 'fallback'}`
        : null;

    useEffect(() => {
        if (programs.length === 0) return;
        const key = `buits-program-popup-${programs[0].id}-${programs[0].popupImage || 'fallback'}`;
        const dismissedAt = Number(window.localStorage.getItem(key));
        const dismissedRecently = Number.isFinite(dismissedAt)
            && dismissedAt > 0
            && Date.now() - dismissedAt < 24 * 60 * 60 * 1000;

        if (!dismissedRecently) {
            const timer = window.setTimeout(() => setVisible(true), 900);
            return () => window.clearTimeout(timer);
        }
    }, [programs.length, programs[0]?.id, programs[0]?.popupImage]);

    if (programs.length === 0) return null;

    const dismiss = () => {
        window.localStorage.setItem(dismissalKey, String(Date.now()));
        setVisible(false);
    };

    return (
        <div
            className={`fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md transition-opacity duration-500 ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            role="dialog"
            aria-modal="true"
            aria-hidden={!visible}
            aria-label="Featured program"
        >
            <div className="relative w-full max-w-[19rem] overflow-hidden rounded-2xl border border-white/20 bg-slate-950 shadow-2xl shadow-indigo-950/50 sm:max-w-xl sm:rounded-3xl">
                <button type="button" onClick={dismiss} aria-label="Close featured program" className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 text-white shadow-lg ring-1 ring-white/30 backdrop-blur transition hover:bg-lime-300 hover:text-slate-950 sm:right-3 sm:top-3 sm:h-10 sm:w-10" title="Close">
                    <X className="h-5 w-5" strokeWidth={2.5} />
                </button>
                <div className="grid md:grid-cols-[0.95fr_1.05fr]">
                    <Link href={`/t/${program.slug}`} onClick={dismiss} className="relative h-32 overflow-hidden bg-gradient-to-br from-indigo-700 to-violet-950 sm:h-56 md:h-auto md:min-h-[20rem]">
                        {program.popupImage ? <img src={program.popupImage} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" /> : <div className="flex h-full items-center justify-center text-6xl font-black text-white/20">BUITS</div>}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                        <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-lime-300 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-slate-950"><Sparkles className="h-3.5 w-3.5" /> Featured</div>
                    </Link>
                    <div className="flex flex-col justify-center p-5 sm:p-10">
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-lime-300 sm:text-xs sm:tracking-[0.25em]">Now open for registration</p>
                        <h2 className="mt-2 text-2xl font-black leading-tight text-white sm:mt-3 sm:text-4xl">{program.title}</h2>
                        {program.deadline && <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-300 sm:mt-4 sm:gap-2 sm:text-sm"><CalendarDays className="h-3.5 w-3.5 text-lime-300 sm:h-4 sm:w-4" /> Registration closes {new Date(program.deadline).toLocaleDateString()}</p>}
                        {program.content && <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-400 sm:mt-4 sm:line-clamp-3 sm:text-sm sm:leading-6">{program.content}</p>}
                        <Link href={`/t/${program.slug}`} onClick={dismiss} className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-lime-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-lime-200 sm:mt-7 sm:px-6 sm:py-3.5 sm:text-base">
                            Explore program <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        <button type="button" onClick={dismiss} className="mt-3 w-fit text-xs text-slate-400 underline-offset-4 hover:text-white hover:underline sm:mt-4 sm:text-sm">Maybe later</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
