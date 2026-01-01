import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Swords, Trophy, ScrollText, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col md:flex-row h-[100dvh] bg-[#09090b] text-[#e4e4e7] font-cinzel overflow-hidden relative selection:bg-[#ffd700] selection:text-black">
            
            {/* Minimal Arkaplan */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1f1f22] via-[#09090b] to-black z-0"></div>

            {/* SIDEBAR (Masaüstü) / BOTTOM BAR (Mobil) */}
            <aside className="
                w-full md:w-72 
                h-20 md:h-full 
                fixed md:relative bottom-0 z-50 
                flex flex-row md:flex-col 
                border-t md:border-t-0 md:border-r border-white/10
                bg-[#09090b]/95 backdrop-blur-xl
                shrink-0 order-2 md:order-1
            ">
                {/* Logo */}
                <div className="hidden md:flex h-32 flex-col items-center justify-center border-b border-white/5">
                    <h1 className="text-3xl font-black text-[#ffd700] tracking-[0.2em]">CASTRUM</h1>
                    <span className="text-[10px] text-gray-500 tracking-[0.4em] uppercase mt-1">Strateji</span>
                </div>

                {/* Menü */}
                <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start md:p-4 gap-2">
                    <MenuItem text="Lobi" to="/lobby" icon={<Swords size={20} />} />
                    <MenuItem text="Liderlik" to="/leaderboard" icon={<Trophy size={20} />} />
                    <MenuItem text="Kurallar" to="/rules" icon={<ScrollText size={20} />} />
                </nav>

                {/* Çıkış */}
                <div className="hidden md:flex p-4 border-t border-white/5">
                    <Link to="/" className="flex items-center gap-3 text-gray-500 hover:text-red-400 transition-colors w-full px-4 py-3 rounded-lg hover:bg-white/5">
                        <LogOut size={18} />
                        <span className="text-xs font-bold tracking-widest">ÇIKIŞ YAP</span>
                    </Link>
                </div>
            </aside>

            {/* İÇERİK ALANI (Merkezlenmiş) */}
            <main className="flex-1 relative z-10 flex flex-col order-1 md:order-2 h-full overflow-hidden">
                {/* Mobil Header */}
                <div className="md:hidden h-14 flex items-center justify-center border-b border-white/10 bg-[#09090b] shrink-0">
                     <h1 className="text-lg font-bold text-[#ffd700] tracking-[0.3em]">CASTRUM</h1>
                </div>

                {/* Kaydırma Alanı & Hizalama Düzeltmesi */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto w-full h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

const MenuItem = ({ text, to, icon }) => {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link to={to} className="flex-1 md:flex-none">
            <div className={`
                flex flex-col md:flex-row items-center justify-center md:justify-start
                h-full md:h-auto py-2 md:py-3 px-2 md:px-4 rounded-xl
                transition-all duration-300
                ${active 
                    ? 'text-[#ffd700] bg-[#ffd700]/10 border border-[#ffd700]/20' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                }
            `}>
                <span className="mb-1 md:mb-0 md:mr-3">{icon}</span>
                <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">{text}</span>
            </div>
        </Link>
    );
};

export default Layout;