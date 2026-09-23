import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Layout, Sparkles, CheckCircle, Trash2, Clock, AlertCircle } from 'lucide-react';
import { xsltTemplates, XSLTTemplate } from './templates';
import { api } from './api';

interface TemplateGalleryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: XSLTTemplate, docTypeId?: string) => void;
}

// Static fallback in case API content fails completely
const SAFE_TEMPLATES = Array.isArray(xsltTemplates) ? xsltTemplates : [];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ isOpen, onClose, onSelect }) => {
    // UI States
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('Hepsi');
    const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');

    // Data States
    const [dynamicTemplates, setDynamicTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // User Context
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Initial Load
    useEffect(() => {
        if (isOpen) {
            loadUserAndTemplates();
        } else {
            // Reset states when closed
            setSearchTerm('');
            setActiveCategory('Hepsi');

            setError(null);
        }
    }, [isOpen]);

    // Reload templates when Tab changes (for Admin)
    useEffect(() => {
        if (isOpen && isAdmin) {
            loadTemplates(activeTab);
        }
    }, [activeTab, isAdmin, isOpen]);

    const loadUserAndTemplates = async () => {
        setLoading(true);
        try {
            // 1. Get User Info
            const user = await api.getMe().catch(() => null);
            setCurrentUser(user);
            const adminParams = user && user.role === 'admin';
            setIsAdmin(adminParams);

            // 2. Load Templates (Default to approved)
            // If admin was looking at pending before, we could persist it, but safety first: default to approved
            setActiveTab('approved');
            await loadTemplates('approved');

        } catch (err) {
            console.error('Gallery Load Error:', err);
            setError('Veriler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const loadTemplates = async (status: 'approved' | 'pending') => {
        try {
            const temps = await api.getTemplates(status);
            if (Array.isArray(temps)) {
                setDynamicTemplates(temps);
            } else {
                setDynamicTemplates([]);
            }
        } catch (e) {
            console.warn('Failed to load dynamic templates', e);
            setDynamicTemplates([]);
        }
    };

    // Actions
    const handleApprove = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Onaylamak istiyor musunuz?')) return;
        try {
            await api.approveTemplate(id);
            await loadTemplates('pending'); // Refresh list
        } catch (e) {
            alert('İşlem başarısız.');
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Silmek/Reddetmek istiyor musunuz?')) return;
        try {
            await api.deleteTemplate(id);
            // Refresh current view
            await loadTemplates(activeTab);
        } catch (e) {
            alert('İşlem başarısız.');
        }
    };

    // --- Data Processing (Memoized & Safe) ---
    const displayedTemplates = useMemo(() => {
        // 1. Combine Sources based on Tab
        let rawList: any[] = [];

        if (activeTab === 'pending') {
            // Pending Tab: ONLY dynamic pending templates
            // Static templates are assumed "Approved" by default, so they don't show here
            rawList = dynamicTemplates.filter(t => t.status === 'pending');
        } else {
            // Approved Tab: Static Source + Dynamic Approved
            // Ensure static templates are treated as approved
            const staticWithStatus = SAFE_TEMPLATES.map(t => ({ ...t, status: 'approved', createdAt: '2023-01-01' })); // Mock date for sorting
            const dynamicApproved = dynamicTemplates.filter(t => t.status === 'approved');
            rawList = [...staticWithStatus, ...dynamicApproved];
        }

        // 2. Filter by Search & Category
        return rawList.filter(t => {
            if (!t) return false;
            try {
                const name = (t.name || '').toLowerCase();
                const desc = (t.description || '').toLowerCase();
                const term = searchTerm.toLowerCase();
                const cat = t.category || 'Genel';

                const matchesSearch = !term || name.includes(term) || desc.includes(term);
                const matchesCategory = activeCategory === 'Hepsi' || cat === activeCategory;

                return matchesSearch && matchesCategory;
            } catch (e) {
                return false;
            }
        }).sort((a, b) => {
            // 3. Sort by Date Newest First
            const da = new Date(a.createdAt || 0).getTime();
            const db = new Date(b.createdAt || 0).getTime();
            return (db || 0) - (da || 0); // Handle NaN gracefully with || 0
        });

    }, [dynamicTemplates, activeTab, searchTerm, activeCategory]);

    // Derived Categories
    const categories = useMemo(() => {
        const unique = new Set(displayedTemplates.map(t => t.category || 'Genel'));
        return ['Hepsi', ...Array.from(unique)];
    }, [displayedTemplates]);

    // Helper for safe date
    const safeDate = (dateStr: any) => {
        try {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return '';
            return d.toLocaleDateString('tr-TR');
        } catch { return ''; }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)'
        }}>
            <div style={{
                width: '100%', maxWidth: '1000px', height: '85vh',
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}>
                {/* --- HEADER --- */}
                <div style={{
                    padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: 'rgba(15, 23, 42, 0.3)'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold', margin: 0 }}>
                            Tasarım Kütüphanesi
                        </h2>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '8px'
                    }}>
                        <X size={28} />
                    </button>
                </div>

                {/* --- MAIN CONTENT --- */}
                {/* REMOVED DETAILS STEP - DIRECT GRID */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    {/* --- CONTROLS --- */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            {/* Admin Tabs */}
                            {isAdmin && (
                                <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '12px' }}>
                                    <button
                                        onClick={() => setActiveTab('approved')}
                                        style={{
                                            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', border: 'none',
                                            background: activeTab === 'approved' ? '#6366f1' : 'transparent',
                                            color: activeTab === 'approved' ? 'white' : '#94a3b8', fontWeight: '600'
                                        }}
                                    >Onaylanmış</button>
                                    <button
                                        onClick={() => setActiveTab('pending')}
                                        style={{
                                            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', border: 'none',
                                            background: activeTab === 'pending' ? '#f59e0b' : 'transparent',
                                            color: activeTab === 'pending' ? 'white' : '#94a3b8', fontWeight: '600',
                                            display: 'flex', alignItems: 'center', gap: '6px'
                                        }}
                                    >
                                        <Clock size={16} /> Onay Bekleyenler
                                    </button>
                                </div>
                            )}

                            {/* Categories */}
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        style={{
                                            padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer',
                                            background: activeCategory === cat ? '#334155' : 'transparent',
                                            color: activeCategory === cat ? 'white' : '#94a3b8',
                                            border: '1px solid', borderColor: activeCategory === cat ? '#475569' : 'rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <Search size={20} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Şablon ara..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 12px 12px 48px',
                                    background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {/* --- LIST --- */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                        {loading ? (
                            <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '3rem' }}>Yükleniyor...</div>
                        ) : displayedTemplates.length === 0 ? (
                            <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <AlertCircle size={48} opacity={0.5} />
                                <p>Gösterilecek şablon bulunamadı.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                                {displayedTemplates.map(t => (
                                    <div
                                        key={t.id}
                                        style={{
                                            background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                                            opacity: activeTab === 'pending' ? 0.9 : 1
                                        }}
                                    >
                                        {/* Preview Area */}
                                        <div
                                            style={{ height: '140px', background: t.previewColor || '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            onClick={() => {
                                                if (activeTab === 'approved') onSelect(t);
                                            }}
                                        >
                                            <Layout size={40} color="rgba(255,255,255,0.5)" />
                                        </div>

                                        {/* Info Area */}
                                        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                                                <h4 style={{ margin: 0, color: 'white', fontWeight: '600' }}>{t.name}</h4>
                                                <span style={{ fontSize: '0.7rem', background: '#1e293b', padding: '2px 6px', borderRadius: '4px', color: '#94a3b8' }}>
                                                    {t.category}
                                                </span>
                                            </div>

                                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {t.description}
                                            </p>

                                            {/* Meta Info (Admin) */}
                                            {isAdmin && (
                                                <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                                                    <div>Ekleyen: {t.username || '?'}</div>
                                                    <div>Tarih: {safeDate(t.createdAt)}</div>
                                                </div>
                                            )}

                                            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                                {activeTab === 'approved' ? (
                                                    <>
                                                        <button
                                                            onClick={() => onSelect(t)}
                                                            className='btn-primary'
                                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '36px' }}
                                                        >
                                                            Kullan
                                                        </button>
                                                        {/* User Delete (if owner) or Admin Delete */}
                                                        {(isAdmin || (currentUser && currentUser.username === t.username)) && (
                                                            <button
                                                                onClick={(e) => handleDelete(e, t.id)}
                                                                style={{ width: '36px', height: '36px', background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '6px', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                                title="Sil"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    // Pending Actions (Admin Only ideally, but we check role)
                                                    <>
                                                        <button
                                                            onClick={(e) => handleApprove(e, t.id)}
                                                            style={{ flex: 1, background: '#10b981', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', height: '36px', fontWeight: '600' }}
                                                        >
                                                            Onayla
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDelete(e, t.id)}
                                                            style={{ flex: 1, background: '#ef4444', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', height: '36px', fontWeight: '600' }}
                                                        >
                                                            Reddet
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
