// ─── Design Tokens — Task Manager (Dir A) ───────────────────
// Drop this file into src/utils/theme.js

export const C = {
    // Backgrounds
    bg0: '#0f172a',   // App background
    bg1: '#1e293b',   // Surfaces: header, member cols
    bg2: '#334155',   // Borders, dividers
    bg3: '#475569',   // Muted borders

    // Accents
    sky: '#38bdf8', // Task FAB, primary CTA, alarm toggle
    violet: '#a78bfa', // Member FAB, member CTA
    emerald: '#34d399', // (auto-assigned to 3rd member)
    red: '#f87171', // Now-line, alarm badge

    // Text
    text: '#f1f5f9',
    muted: '#94a3b8',
    subtle: '#475569',
};

// Auto-assigned member colors (cycles if > 8 members)
export const PALETTE = [
    '#38bdf8', // sky
    '#a78bfa', // violet
    '#34d399', // emerald
    '#fb923c', // orange
    '#f472b6', // pink
    '#facc15', // yellow
    '#60a5fa', // blue
    '#f87171', // rose
];

export const FONTS = {
    mono: 'SpaceMono-Regular', // or 'Courier New' as fallback
    monoBold: 'SpaceMono-Bold',
};

// Timeline layout
export const HOUR_HEIGHT = 68;   // px per hour
export const TIME_AXIS_W = 50;   // width of left time column
export const COL_MIN_W = 118;  // minimum member column width
