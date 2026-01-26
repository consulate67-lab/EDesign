import React, { useRef, useState, useEffect } from 'react';
import { FileText, ShoppingCart, Globe, Plane, Package, Zap, Upload, LogOut, User, X, CreditCard, Building2, Phone, Mail, Sparkles } from 'lucide-react';
import { api } from './api';
import { PaymentModal } from './PaymentModal.tsx';

interface SelectionProps {
    onSelect: (moduleId: string, template: string, moduleName: string, customContent?: string) => void;
    onLogout: () => void;
}

interface Module {
    id: string;
    name: string;
    icon: React.ReactElement;
    color: string;
    template: string;
}

const modules: Module[] = [
    {
        id: 'fatura',
        name: 'E-Fatura',
        icon: <FileText size={24} />,
        color: '#6366f1',
        template: 'Antrepo_Fatura.xslt'
    },
    {
        id: 'arsiv',
        name: 'E-Arşiv',
        icon: <Package size={24} />,
        color: '#10b981',
        template: 'antrepo_arsiv.xslt'
    },
    {
        id: 'mikro',
        name: 'Mikro İhracat',
        icon: <Zap size={24} />,
        color: '#f59e0b',
        template: 'Antrepo_Arsiv-mikro.xslt'
    },
    {
        id: 'net',
        name: 'İnternet Satışı',
        icon: <ShoppingCart size={24} />,
        color: '#ec4899',
        template: 'Antrepo_Net.xslt'
    },
    {
        id: 'yolcu',
        name: 'Yolcu Beraber',
        icon: <Plane size={24} />,
        color: '#0ea5e9',
        template: 'Antrepo_Yolcu.xslt'
    },
    {
        id: 'ihracat',
        name: 'E-İhracat',
        icon: <Globe size={24} />,
        color: '#8b5cf6',
        template: 'Antrepo_Ihracat.xslt'
    },
];

export const Selection: React.FC<SelectionProps> = ({ onSelect, onLogout }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        api.getMe().then(setUserInfo).catch(console.error);
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            // Pass content and use a dummy template name, or the filename
            onSelect('custom', file.name, 'Özel Belge', content);
        };
        reader.readAsText(file);
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            fontFamily: 'Inter, sans-serif',
            color: 'white',
            padding: '2rem',
            boxSizing: 'border-box',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute', top: '2rem', right: '2rem',
                display: 'flex', gap: '1rem', zIndex: 50
            }}>
                <button
                    onClick={() => setShowPaymentModal(true)}
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none',
                        padding: '0.6rem 1.4rem', borderRadius: '12px', color: 'white', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)', fontWeight: 'bold'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                    <Sparkles size={18} />
                    <span style={{ fontSize: '0.9rem' }}>Paket Al</span>
                </button>

                <button
                    onClick={() => setShowProfileModal(true)}
                    style={{
                        background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.6rem 1.2rem', borderRadius: '12px', color: 'white', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                        backdropFilter: 'blur(10px)'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)')}
                >
                    <User size={18} color="#818cf8" />
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Profilim</span>
                </button>

                <button
                    onClick={onLogout}
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        padding: '0.6rem 1.2rem', borderRadius: '12px', color: '#f87171', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                        backdropFilter: 'blur(10px)'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                    }}
                >
                    <LogOut size={18} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Çıkış</span>
                </button>
            </div>

            {/* Profile Modal */}
            {showProfileModal && userInfo && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                    zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
                }}>
                    <div style={{
                        background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px',
                        width: '100%', maxWidth: '450px', padding: '2.5rem', position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <button
                            onClick={() => setShowProfileModal(false)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '80px', height: '80px', background: '#6366f1', borderRadius: '24px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
                                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)'
                            }}>
                                <User size={40} color="white" />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{userInfo.full_name || 'Kullanıcı'}</h2>
                            <span style={{ background: '#0f172a', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                {userInfo.role === 'admin' ? 'Yönetici Hesabı' : 'Standart Hesap'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Building2 size={20} color="#94a3b8" />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Firma</span>
                                    <span style={{ fontSize: '0.95rem' }}>{userInfo.company_name || '-'}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Mail size={20} color="#94a3b8" />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>E-Posta</span>
                                    <span style={{ fontSize: '0.95rem' }}>{userInfo.username}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Phone size={20} color="#94a3b8" />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Telefon</span>
                                    <span style={{ fontSize: '0.95rem' }}>{userInfo.phone_number || '-'}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <CreditCard size={20} color="#10b981" />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.65rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>Mevcut Kredi</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>{userInfo.credits} <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>Tasarım</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".xslt,.xsl,.xml"
                onChange={handleFileUpload}
            />

            <div style={{
                width: '100%',
                maxWidth: '900px', // Limit width to keep it centered properly
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 2.5rem)', // Responsive font size
                        fontWeight: '800',
                        marginBottom: '1rem',
                        background: 'linear-gradient(to right, #818cf8, #c084fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        E-Belge Tasarımcısı
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                        Kurumsal e-dönüşüm belgelerinizi profesyonel araçlarla tasarlayın.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    // Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '20px',
                    width: '100%',
                    justifyContent: 'center',
                    justifyItems: 'center' // Center items within their grid cells if they are smaller
                }}>
                    {modules.map((module) => (
                        <button
                            key={module.id}
                            onClick={() => onSelect(module.id, module.template, module.name)}
                            style={{
                                background: 'rgba(30, 41, 59, 0.4)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '16px',
                                padding: '20px',
                                width: '100%', // Take full width of the grid cell
                                maxWidth: '280px', // But don't grow too large
                                height: '100px', // Fixed height for uniformity
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                backdropFilter: 'blur(10px)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                                e.currentTarget.style.borderColor = module.color;
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = `0 10px 20px -5px ${module.color}22`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: `${module.color}22`,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: module.color,
                                flexShrink: 0
                            }}>
                                {module.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'white', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{module.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#64748b' }}>
                                    <span>Düzenle</span>
                                    <span style={{ fontSize: '1rem', lineHeight: 0 }}>&rsaquo;</span>
                                </div>
                            </div>
                        </button>
                    ))}

                    {/* CUSTOM XSLT OPTION */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            background: 'rgba(30, 41, 59, 0.4)',
                            border: '1px dashed rgba(255,255,255,0.2)',
                            borderRadius: '16px',
                            padding: '20px',
                            width: '100%',
                            maxWidth: '280px',
                            height: '100px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                            e.currentTarget.style.borderColor = '#ffffff';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: `#ffffff11`,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            flexShrink: 0
                        }}>
                            <Upload size={24} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'white', marginBottom: '2px' }}>Kendin Seç</h3>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                XSLT Yükle (Bağımsız)
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={(credits) => setUserInfo((prev: any) => prev ? { ...prev, credits } : null)}
            />
        </div>
    );
};
