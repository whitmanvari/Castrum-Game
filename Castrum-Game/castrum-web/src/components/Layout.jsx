import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        // ANA KAPLAYICI
        <div className="flex h-screen bg-[#0c0a09] text-[#e7e5e4] font-cinzel overflow-hidden relative selection:bg-[#ffd700] selection:text-black">
            
            {/* Arkaplan Efekti */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] mix-blend-overlay"></div>
            <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-black via-transparent to-black opacity-80"></div>

            {/* ==========================================================
                SOL SÜTUN (SIDEBAR)
               ========================================================== */}
            <aside className="w-80 h-full relative z-50 flex flex-col border-r border-[#3e2723]/30 bg-[#15100d] shadow-[10px_0_50px_rgba(0,0,0,0.8)] shrink-0">
                
                {/* 1. LOGO ALANI */}
                <div className="h-44 flex flex-col items-center justify-center relative overflow-hidden shrink-0 border-b border-[#3e2723]/20 bg-gradient-to-b from-[#1a120b] to-transparent">
                    {/* Arkadaki ışık */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#ffd700] blur-[100px] opacity-5 pointer-events-none"></div>
                    
                    {/* Dekoratif Çizgiler & Başlık */}
                    <div className="flex flex-col items-center z-10">
                        {/* Üst Çizgi */}
                        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/40 to-transparent mb-1"></div>

                        {/* Marka Adı (DÜZELTME BURADA YAPILDI) */}
                        {/* pt-3 ekleyerek 'C' harfini aşağıya aldık */}
                        <h1 className="text-7xl text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#b8860b] drop-shadow-[0_2px_15px_rgba(255,215,0,0.2)] tracking-wide leading-tight pt-3 pb-1" 
                            style={{ fontFamily: "'Great Vibes', cursive" }}>
                            Castrum
                        </h1>
                        
                        {/* Alt Slogan */}
                        <span className="text-[9px] text-[#8b7355] tracking-[0.5em] uppercase font-bold opacity-80">
                            Strategic Warfare
                        </span>

                        {/* Alt Çizgi */}
                        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/40 to-transparent mt-3"></div>
                    </div>
                </div>

                {/* 2. MENÜ (ORTA ALAN) */}
                <nav className="flex-1 px-6 py-8 space-y-4 overflow-y-auto">
                    <MenuItem text="SAVAŞ ALANI" to="/" />
                    <MenuItem text="LOBİ & TURNUVA" to="/tournament" />
                    <MenuItem text="KADİM KURALLAR" to="/rules" />
                    <MenuItem text="LİDERLİK TABLOSU" to="/leaderboard" />

                    <div className="py-8 flex items-center justify-center opacity-10">
                        <span className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#ffd700] to-transparent"></span>
                        <span className="mx-2 text-[#ffd700] text-lg">❖</span>
                        <span className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#ffd700] to-transparent"></span>
                    </div>
                </nav>

                {/* 3. PROFIL & FOOTER  */}
                <div className="p-6 border-t border-[#3e2723]/30 bg-[#0c0a09]/60 shrink-0">
                    
                    {/* Profil Kartı */}
                    <div className="group flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-[#3e2723] hover:bg-white/5 transition-all cursor-pointer">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8b7355] to-[#2c1e16] p-[2px]">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                    <span className="text-[#d7ccc8] font-bold text-sm group-hover:text-[#ffd700] transition-colors">KR</span>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-900 border-2 border-black rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        {/* Bilgiler */}
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[#8b7355] uppercase tracking-widest font-bold">General</span>
                            <span className="text-sm text-[#e7e5e4] font-cinzel font-bold group-hover:text-[#ffd700] transition-colors">
                                Kral Ragnar
                            </span>
                            <span className="text-[9px] text-[#5d4037] mt-0.5">Seviye 42</span>
                        </div>
                    </div>

                    {/* Çıkış Butonu */}
                    <button className="w-full mt-4 py-2 text-[10px] tracking-[0.2em] text-[#5d4037] hover:text-[#8b0000] uppercase font-bold border-t border-[#3e2723]/30 transition-colors">
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* İÇERİK ALANI */}
            <main className="flex-1 relative z-10 p-6 md:p-10 overflow-hidden flex flex-col items-center justify-center">
                <div className="w-full h-full max-w-[1600px] relative flex flex-col items-center">
                    {children}
                </div>
            </main>

            {/* MOBİL ALT BAR */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#15100d] border-t border-[#3e2723] z-[60] flex justify-around items-center px-4 shadow-2xl">
                 <span className="text-[#ffd700] text-2xl">⚔</span>
                 <span className="text-gray-500 text-2xl">🏰</span>
                 <span className="text-gray-500 text-2xl">👤</span>
            </div>
        </div>
    );
};

// --- MENÜ ELEMANI ---
const MenuItem = ({ text, to }) => {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link to={to}>
            <div className={`
                group relative cursor-pointer py-3 px-4 transition-all duration-300
                border-l-[3px]
                ${active 
                    ? 'border-[#ffd700] bg-gradient-to-r from-[#ffd700]/10 to-transparent' 
                    : 'border-transparent hover:border-[#8b7355] hover:bg-white/5'
                }
            `}>
                <span className={`
                    text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 block
                    ${active ? 'text-[#ffd700] drop-shadow-sm' : 'text-[#a8a29e] group-hover:text-[#d7ccc8]'}
                `}>
                    {text}
                </span>
                <span className={`
                    absolute right-2 top-1/2 -translate-y-1/2 text-[#ffd700] opacity-0 transition-all duration-300 transform translate-x-2
                    ${active ? 'opacity-100 translate-x-0' : 'group-hover:opacity-100 group-hover:translate-x-0'}
                `}>
                    ›
                </span>
            </div>
        </Link>
    );
};

export default Layout;