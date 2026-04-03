import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Calendar, Image, Mail, Home as HomeIcon, Plane, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const { user, supabase } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', path: '/', icon: <HomeIcon size={18} /> },
        { name: 'Nuestras 100 Citas', path: '/100-citas', icon: <Calendar size={18} /> },
        { name: 'Viaje a Lima', path: '/nuestro-viaje', icon: <Plane size={18} /> },
        { name: 'Galería', path: '/#gallery', icon: <Image size={18} /> },
        { name: 'Cartas', path: '/#letters', icon: <Mail size={18} /> },
        { name: 'Momento Especial', path: '/momento-especial', icon: <Heart size={18} className="text-gold" /> },
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            gsap.fromTo(".nav-item",
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-60 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-8'
                }`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-serif text-white tracking-tighter flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        Âmes Sœurs
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-xs uppercase tracking-[0.2em] transition-colors hover:text-gold ${location.pathname === link.path ? 'text-gold' : 'text-white/60'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                                <span className="text-[10px] text-gold uppercase tracking-widest flex items-center gap-2">
                                    <UserIcon size={12} /> {user.email?.split('@')[0]}
                                </span>
                                <button onClick={handleLogout} className="text-white/40 hover:text-white transition-colors">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="hidden md:block text-[10px] text-white/40 hover:text-gold uppercase tracking-[0.3em] border border-white/10 px-4 py-2 rounded-full transition-all">
                                Entrar
                            </Link>
                        )}
                        <button onClick={toggleMenu} className="md:hidden text-white/80 hover:text-white transition-colors">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-55 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col gap-8 text-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className="nav-item flex items-center gap-4 text-2xl font-serif text-white hover:text-gold transition-colors"
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navbar;
