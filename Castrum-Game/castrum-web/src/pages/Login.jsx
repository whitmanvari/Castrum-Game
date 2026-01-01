import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sword, Crown, Shield } from 'lucide-react';
import { gameService } from '../services/gameService'; // Servisi ekledik

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (username.trim()) {
            setLoading(true);
            try {
                // Backend'e Login İsteği At
                const user = await gameService.login(username);
                
                // Gelen kullanıcı bilgilerini kaydet
                localStorage.setItem("castrum_user", JSON.stringify(user));
                
                // Lobiye yönlendir
                navigate('/lobby');
            } catch (error) {
                console.error(error);
                alert("Giriş yapılamadı! Backend çalışıyor mu?");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden font-cinzel text-white">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ffd700]/5 via-transparent to-transparent opacity-50"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 w-full max-w-md p-8"
            >
                <div className="text-center mb-10">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4 text-[#ffd700]"
                    >
                        <Crown size={64} className="drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
                    </motion.div>
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#b8860b] drop-shadow-lg tracking-widest">
                        CASTRUM
                    </h1>
                    <p className="text-[#a3a3a3] tracking-[0.4em] text-xs mt-2 uppercase">Sınıfın Efsanesi Ol</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 bg-[#1a1a1a]/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <div>
                        <label className="block text-[#d4af37] text-xs font-bold tracking-widest mb-2 uppercase">Generalin Adı</label>
                        <div className="relative">
                            <Sword className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] outline-none transition-all uppercase tracking-wider font-bold"
                                placeholder="ADINIZ..."
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#ffd700] to-[#b8860b] text-black font-black py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] tracking-widest flex items-center justify-center gap-2"
                    >
                        {loading ? "GİRİŞ YAPILIYOR..." : <><Shield size={20} /> SAVAŞA KATIL</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;