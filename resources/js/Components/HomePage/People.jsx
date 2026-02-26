import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from '@inertiajs/react';




const membersData = [
    { id: 1, name: "Mazharul Islam Rifat", batch: "executive member 6", status: "alumni", cf: "Founding Member", img: "/img/people/male-placeholder-image.jpeg" },
    { id: 2, name: "Md Jawadur Rahman", batch: "executive member 6", status: "alumni", cf: "Founding Member", img: "/img/people/male-placeholder-image.jpeg" },
    { id: 3, name: "Abu Ubaida", batch: "", status: "alumni", note: "", img: "/img/people/Abu Ubaida.jpg" },
    { id: 4, name: "Ashik Hossain", batch: "", status: "alumni", note: "", img: "/img/people/Ashik Hossain.jpg" },
    { id: 5, name: "Dipan Nandi", batch: "", status: "alumni", note: "", img: "/img/people/Dipan Nandi.jpg" },
    { id: 6, name: "Hadiuzzaman Sujon", batch: "", status: "alumni", note: "", img: "/img/people/Hadiuzzaman Sujon.jpg" },
    { id: 7, name: "Jannatul Ferdous Rima", batch: "", status: "alumni", note: "", img: "/img/people/Jannatul Ferdous Rima.jpg" },
    { id: 8, name: "Mahfuzur Rahman Nazim", batch: "", status: "alumni", note: "", img: "/img/people/Mahfuzur Rahman Nazim.jpg" },
    { id: 9, name: "Md Fazlay Rabby", batch: "", status: "alumni", note: "", img: "/img/people/Md Fazlay Rabby.jpg" },
    { id: 10, name: "Md Shoibur Rahman khan Shifat", batch: "", status: "alumni", note: "", img: "/img/people/Md Shoibur Rahman khan Shifat.jpg" },
    { id: 11, name: "Md. Hasan Shahrier", batch: "", status: "alumni", note: "", img: "/img/people/Md. Hasan Shahrier.jpg" },
    { id: 12, name: "Md. Redoan Sarkar", batch: "", status: "alumni", cf: "", img: "/img/people/Md. Redoan Sarkar.jpg" },
    { id: 13, name: "Md. Tanvir Rahman", batch: "", status: "alumni", cf: "", img: "/img/people/Md. Tanvir Rahman.jpg" },
    { id: 14, name: "shuvro", batch: "", status: "Running President", cf: "", img: "/img/people/shuvro.jpg" },
    { id: 15, name: "Taium Hossain Sajal", batch: "", status: "alumni", cf: "", img: "/img/people/Taium Hossain Sajal.jpg" },
    { id: 16, name: "Farhana Yesmen Tori", batch: "", status: "alumni", cf: "", img: "/img/people/female_placeholder.jpg" },
];
const COLS = 6;
const ROWS = 3;
const GRID_SIZE = COLS * ROWS;
const MAX_HISTORY = 6;

function checkConstraints(slots) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 1; c++) {
            if (slots[r * COLS + c].content === null && slots[r * COLS + (c + 1)].content === null) return false;
        }
    }
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS - 1; r++) {
            if (slots[r * COLS + c].content === null && slots[(r + 1) * COLS + c].content === null) return false;
        }
    }
    return true;
}

function buildInitialGrid() {
    let attempts = 0;
    while (attempts < 100) {
        attempts++;
        const slots = Array.from({ length: GRID_SIZE }, (_, i) => ({
            index: i,
            col: i % COLS,
            row: Math.floor(i / COLS),
            content: null,
        }));
        const emptyIndices = [];
        for (let c = 0; c < COLS; c++) {
            emptyIndices.push(Math.floor(Math.random() * ROWS) * COLS + c);
        }
        const available = slots.filter(s => !emptyIndices.includes(s.index));
        const shuffled = [...membersData].sort(() => Math.random() - 0.5);
        shuffled.forEach((coder, i) => { if (i < available.length) available[i].content = coder; });
        if (checkConstraints(slots)) return slots;
    }
    return [];
}

// Smart tooltip positioning based on grid position
function CoderCard({ coder, isActive, onMouseEnter, onMouseLeave, filledAnim, col, row }) {
    const isFirstRow = row === 0;
    const isLeftEdge = col <= 1;
    const isRightEdge = col >= 4;

    const tooltipStyle = {
        position: 'absolute',
        width: '160px',
        background: 'white',
        boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        padding: '8px',
        zIndex: 100,
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease',
        pointerEvents: 'none',
        textAlign: 'left',
        // Vertical: show below for first row (top:110%), above for all others (bottom:110%)
        ...(isFirstRow ? { top: '110%', bottom: 'auto' } : { bottom: '110%', top: 'auto' }),
        // Horizontal: pin left for left edge, pin right for right edge, center otherwise
        ...(isLeftEdge
            ? { left: 0, right: 'auto', transform: isActive ? 'translateY(0)' : 'translateY(10px)' }
            : isRightEdge
                ? { left: 'auto', right: 0, transform: isActive ? 'translateY(0)' : 'translateY(10px)' }
                : { left: '50%', transform: isActive ? 'translateX(-50%)' : 'translateX(-50%) translateY(10px)' }),
    };

    // Arrow pointing correctly: down (below card) for normal rows, up (above card) for first row tooltips shown below
    const arrowStyle = {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        left: isLeftEdge ? '20px' : isRightEdge ? 'auto' : '50%',
        right: isRightEdge ? '20px' : 'auto',
        transform: (!isLeftEdge && !isRightEdge) ? 'translateX(-50%)' : 'none',
        ...(isFirstRow
            ? { top: '-8px', bottom: 'auto', borderWidth: '0 8px 8px', borderColor: 'transparent transparent white transparent' }
            : { bottom: '-8px', top: 'auto', borderWidth: '8px 8px 0', borderColor: 'white transparent transparent transparent' }),
    };

    return (
        <div
            className={`coder-card${filledAnim ? ' filled' : ''}${isActive ? ' active' : ''}`}
            data-id={coder.id}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <img src={coder.img} alt={coder.name} />
            <div className="coder-tooltip" style={tooltipStyle}>
                <div style={arrowStyle} />
                <div className="tooltip-header">
                    <span className="badge-batch">{coder.batch}</span>
                    <span className="badge-rating">{coder.rating}</span>
                </div>
                <div className="tooltip-user">
                    <img src={coder.img} alt="Avatar" />
                    <span className="tooltip-name">{coder.name}</span>
                </div>
                <div className="tooltip-handles">
                    <div>{coder.cf}</div>
                  
                </div>
            </div>
        </div>
    );
}

export default function People() {
    const [gridSlots, setGridSlots] = useState(() => buildInitialGrid());
    const [activeCoderId, setActiveCoderId] = useState(membersData[0].id);
    const [filledSet, setFilledSet] = useState(() => new Set(Array.from({ length: GRID_SIZE }, (_, i) => i)));
    const isHovered = useRef(false);
    const recentMoves = useRef([]);
    const loopRef = useRef(null);
    const marqueeWrapperRef = useRef(null);
    const marqueeTrackRef = useRef(null);

    const setActive = useCallback((coderId) => {
        setActiveCoderId(coderId);
        // Scroll only the marquee wrapper — NOT the page
        if (marqueeWrapperRef.current && marqueeTrackRef.current) {
            const wrapper = marqueeWrapperRef.current;
            const items = marqueeTrackRef.current.querySelectorAll('.marquee-item');
            const coderIndex = membersData.findIndex(c => c.id === coderId);
            if (coderIndex >= 0 && items[coderIndex]) {
                const item = items[coderIndex];
                const itemLeft = item.offsetLeft;
                const itemWidth = item.offsetWidth;
                const wrapperWidth = wrapper.offsetWidth;
                const targetScroll = itemLeft - (wrapperWidth / 2) + (itemWidth / 2);
                wrapper.scrollTo({ left: targetScroll, behavior: 'smooth' });
            }
        }
    }, []);

    const shuffleConstraint = useCallback(() => {
        setGridSlots(prev => {
            const slots = prev.map(s => ({ ...s }));
            const filledSlots = slots.filter(s => s.content !== null && !recentMoves.current.includes(s.content.id));
            const emptySlots = slots.filter(s => s.content === null);
            if (!filledSlots.length || !emptySlots.length) return prev;

            for (let i = 0; i < 50; i++) {
                const src = filledSlots[Math.floor(Math.random() * filledSlots.length)];
                const tgt = emptySlots[Math.floor(Math.random() * emptySlots.length)];
                const original = src.content;
                src.content = null;
                tgt.content = original;

                if (checkConstraints(slots)) {
                    recentMoves.current.push(original.id);
                    if (recentMoves.current.length > MAX_HISTORY) recentMoves.current.shift();
                    setFilledSet(f => { const next = new Set(f); next.delete(tgt.index); return next; });
                    setTimeout(() => {
                        setFilledSet(f => { const next = new Set(f); next.add(tgt.index); return next; });
                        setActive(original.id);
                    }, 300);
                    return slots;
                }
                src.content = original;
                tgt.content = null;
            }
            return prev;
        });
    }, [setActive]);

    useEffect(() => {
        setActive(membersData[0].id);
        loopRef.current = setInterval(() => {
            if (!isHovered.current) shuffleConstraint();
        }, 2500);
        return () => clearInterval(loopRef.current);
    }, [shuffleConstraint, setActive]);

    const handlePrev = () => {
        const idx = membersData.findIndex(c => c.id === activeCoderId);
        setActive(idx > 0 ? membersData[idx - 1].id : membersData[membersData.length - 1].id);
    };

    const handleNext = () => {
        const idx = membersData.findIndex(c => c.id === activeCoderId);
        setActive(idx < membersData.length - 1 ? membersData[idx + 1].id : membersData[0].id);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

                .people-section * { box-sizing: border-box; }

                .people-section {
                    width: 100%;
                    max-width: 1200px;
                    padding: 40px 20px;
                    margin: 0 auto;
                    font-family: 'Hind Siliguri', sans-serif;
                    box-sizing: border-box;
                }
                .people-section .container {
                    width: 100%;
                    max-width: 100%;
                    margin: 0 auto;
                }
                .section-title { text-align: center; font-size: 28px; font-weight: 700; margin-bottom: 30px; color: #333; }
                .purple-text { color: #6d28d9; }

                .dashed-container { padding: 30px; padding-top: 0; position: relative; border-radius: 0 0 15px 15px; width: 100%; box-sizing: border-box; }
                .dashed-border-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 0; }
                .border-line { position: absolute; background: repeating-linear-gradient(to bottom, #e5e7eb 0, #e5e7eb 10px, transparent 10px, transparent 20px); width: 2px; }
                .border-left  { top: 0; bottom: 15px; left: 0; }
                .border-right { top: 0; bottom: 15px; right: 0; }
                .border-bottom { bottom: 0; left: 0; right: 0; height: 2px; background: repeating-linear-gradient(to right, #e5e7eb 0, #e5e7eb 10px, transparent 10px, transparent 20px); border-radius: 0 0 15px 15px; }
                .shooting-star { position: absolute; background: linear-gradient(to bottom, transparent, #9333ea, #3b82f6); filter: drop-shadow(0 0 5px #9333ea); width: 2px; height: 100px; z-index: 1; opacity: 0; animation: shoot-border 8s linear infinite; }
                @keyframes shoot-border {
                    0%   { top: 0; left: 0; height: 100px; width: 2px; opacity: 0; }
                    5%   { opacity: 1; }
                    30%  { top: calc(100% - 100px); left: 0; height: 100px; width: 2px; }
                    35%  { top: 100%; left: 0; height: 2px; width: 2px; }
                    36%  { top: 100%; left: 0; height: 2px; width: 100px; background: linear-gradient(to right, #3b82f6, #9333ea, transparent); }
                    65%  { top: 100%; left: 100%; width: 100px; }
                    66%  { top: 100%; left: 100%; width: 2px; height: 2px; }
                    67%  { top: 100%; left: 100%; width: 2px; height: 100px; background: linear-gradient(to top, transparent, #9333ea, #3b82f6); }
                    95%  { top: 0; left: 100%; height: 100px; opacity: 1; }
                    100% { top: -100px; left: 100%; opacity: 0; }
                }

                .coders-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 15px; margin-bottom: 30px; position: relative; z-index: 2; width: 100%; box-sizing: border-box; }
                .grid-item { aspect-ratio: 1; background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 10px; position: relative; transition: all 0.3s ease; overflow: visible; }

                .coder-card { width: 100%; height: 100%; background: #f3f4f6; border-radius: 10px; overflow: visible; position: relative; cursor: pointer; transition: all 0.5s ease; opacity: 0; transform: scale(0.8); }
                .coder-card.filled { opacity: 1; transform: scale(1); }
                .coder-card img { width: 100%; height: 100%; object-fit: cover; border-radius: 10px; filter: grayscale(100%); transition: filter 0.3s ease; }
                .coder-card.active img, .coder-card:hover img { filter: grayscale(0%); box-shadow: 0 0 0 3px #9333ea; }

                .tooltip-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 3px; }
                .badge-batch { background: #fee2e2; color: #ef4444; padding: 1px 5px; border-radius: 3px; font-size: 9px; font-weight: 600; }
                .badge-rating { background: #dcfce7; color: #16a34a; padding: 1px 5px; border-radius: 3px; font-size: 8px; font-weight: 600; }
                .tooltip-user { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; }
                .tooltip-user img { width: 24px; height: 24px; border-radius: 50%; filter: none !important; box-shadow: none !important; }
                .tooltip-name { font-weight: 700; color: #6d28d9; font-size: 11px; line-height: 1.2; }
                .tooltip-handles { font-size: 9px; color: #555; background: #f3f4f6; padding: 5px; border-radius: 4px; border-left: 2px solid #6d28d9; }

                .coder-tooltip { transform-origin: center bottom; }
                @media (max-width: 768px) {
                    .coder-tooltip { width: 140px !important; padding: 6px !important; }
                    .tooltip-user img { width: 20px !important; height: 20px !important; }
                    .tooltip-name { font-size: 10px !important; }
                    .badge-batch, .badge-rating { font-size: 8px !important; padding: 1px 4px !important; }
                    .tooltip-handles { font-size: 8px !important; padding: 4px !important; }
                }
                @media (max-width: 480px) {
                    .coder-tooltip { width: 120px !important; padding: 5px !important; }
                    .tooltip-name { font-size: 9px !important; }
                    .badge-batch, .badge-rating { font-size: 7px !important; }
                    .tooltip-handles { font-size: 7px !important; }
                }

                .marquee-container { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid #e5e7eb; position: relative; z-index: 2; width: 100%; }
                .marquee-wrapper { flex: 1; overflow-x: auto; overflow-y: hidden; position: relative; height: 40px; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
                .marquee-wrapper::-webkit-scrollbar { display: none; }
                .marquee-wrapper { -ms-overflow-style: none; scrollbar-width: none; }
                .marquee-track { display: flex; gap: 15px; position: relative; padding: 0 10px; align-items: center; height: 100%; }
                .marquee-item { white-space: nowrap; font-size: 14px; font-weight: 500; color: #6b7280; cursor: pointer; padding: 5px 10px; border-radius: 5px; transition: color 0.3s, background 0.3s, transform 0.3s; flex-shrink: 0; }
                .marquee-item.active { color: #6d28d9; background: #f3f4f6; font-weight: 700; transform: scale(1.05); }

                @media (max-width: 768px) {
                    .marquee-wrapper { height: 35px; }
                    .marquee-track { gap: 10px; }
                    .marquee-item { font-size: 12px; padding: 4px 8px; }
                }
                @media (max-width: 480px) {
                    .marquee-wrapper { height: 32px; }
                    .marquee-track { gap: 8px; }
                    .marquee-item { font-size: 11px; padding: 3px 6px; }
                }

                .nav-btn { background: none; border: none; cursor: pointer; color: #9ca3af; padding: 5px; transition: color 0.3s; }
                .nav-btn:hover { color: #6d28d9; }
                .nav-btn svg { width: 24px; height: 24px; }

                .button-wrapper { text-align: center; margin-top: 30px; }
                .view-all-btn { background: linear-gradient(90deg, #7c3aed, #db2777); color: white; text-decoration: none; padding: 10px 40px; border-radius: 25px; font-weight: 600; box-shadow: 0 4px 15px rgba(124,58,237,0.4); transition: transform 0.2s; display: inline-block; }
                .view-all-btn:hover { transform: translateY(-2px); }

                @media (max-width: 768px) {
                    .people-section { padding: 40px 15px; box-sizing: border-box; }
                    .dashed-container { padding: 15px 10px; }
                    .coders-grid { gap: 8px; }
                }
                @media (max-width: 480px) {
                    .people-section { padding: 20px 10px; }
                    .coders-grid { gap: 5px; }
                }
            `}</style>

            <section className="people-section">
                <div className="container">
                    <h2 className="section-title">
                        They Dreamed, <span className="purple-text">We Achieved</span>
                    </h2>

                    <div className="dashed-container">
                        <div className="dashed-border-bg">
                            <div className="border-line border-left"></div>
                            <div className="border-line border-right"></div>
                            <div className="border-line border-bottom"></div>
                            <div className="shooting-star"></div>
                        </div>

                        <div className="coders-grid">
                            {gridSlots.map(slot => (
                                <div
                                    key={slot.index}
                                    className="grid-item"
                                    data-slot-index={slot.index}
                                    data-col={slot.col}
                                    style={{ zIndex: slot.content && activeCoderId === slot.content.id ? 50 : 2 }}
                                >
                                    {slot.content && (
                                        <CoderCard
                                            coder={slot.content}
                                            isActive={activeCoderId === slot.content.id}
                                            filledAnim={filledSet.has(slot.index)}
                                            col={slot.col}
                                            row={slot.row}
                                            onMouseEnter={() => { isHovered.current = true; setActive(slot.content.id); }}
                                            onMouseLeave={() => { isHovered.current = false; }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="marquee-container">
                            <button className="nav-btn prev-btn" onClick={handlePrev}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <div className="marquee-wrapper" ref={marqueeWrapperRef}>
                                <div className="marquee-track" ref={marqueeTrackRef}>
                                    {membersData.map(coder => (
                                        <div
                                            key={coder.id}
                                            className={`marquee-item${activeCoderId === coder.id ? ' active' : ''}`}
                                            onClick={() => setActive(coder.id)}
                                        >
                                            {coder.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="nav-btn next-btn" onClick={handleNext}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="button-wrapper">
                        <Link href="/previous-committee" className="view-all-btn">View All</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
