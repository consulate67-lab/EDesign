import React, { useState } from 'react';
import { X, Search, Filter, Check, Layout, Sparkles, FileText, CheckCircle, Trash2, Clock } from 'lucide-react';
import { xsltTemplates, XSLTTemplate } from './templates';
import { api } from './api';

interface TemplateGalleryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: XSLTTemplate, docTypeId?: string) => void;
}

const docTypes = [
    { id: 'fatura', name: 'E-Fatura', file: 'Antrepo_Fatura.xslt' },
    { id: 'arsiv', name: 'E-Arşiv', file: 'antrepo_arsiv.xslt' },
    { id: 'ihracat', name: 'E-İhracat', file: 'Antrepo_Ihracat.xslt' },
    { id: 'irsaliye', name: 'E-İrsaliye', file: 'Antrepo_Fatura.xslt' }, // Fallback
    { id: 'serbest', name: 'S. Meslek Mak', file: 'Antrepo_Fatura.xslt' }, // Fallback
    { id: 'mustahsil', name: 'Müstahsil Mak', file: 'Antrepo_Fatura.xslt' }, // Fallback
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('Hepsi');
    const [selectedTemplate, setSelectedTemplate] = useState<XSLTTemplate | null>(null);
    const [dynamicTemplates, setDynamicTemplates] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showPending, setShowPending] = useState(false); // Admin Toggle

    React.useEffect(() => {
        if (isOpen) {
            // Check Role
            api.getMe().then(user => {
                if (user && user.role === 'admin') {
                    setIsAdmin(true);
                }
            });

            // Load Approved Templates
            api.getTemplates('approved').then((temps: any) => {
                setDynamicTemplates(temps);
            });
        }
    }, [isOpen]);

    // Load pending if Admin and toggle is on
    React.useEffect(() => {
        if (isAdmin && showPending) {
            api.getTemplates('pending').then((temps: any) => {
                setDynamicTemplates(temps);
            });
        } else if (isOpen) {
            // Re-load approved
            api.getTemplates('approved').then((temps: any) => {
                setDynamicTemplates(temps);
            });
        }
    }, [isAdmin, showPending, isOpen]);

    const handleApprove = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Bu tasarımı onaylamak istiyor musunuz?')) {
            await api.approveTemplate(id);
            // Refresh
            const temps = await api.getTemplates('pending');
            setDynamicTemplates(temps as any);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Bu tasarımı silmek istiyor musunuz?')) {
            await api.deleteTemplate(id);
            // Refresh
            const temps = await api.getTemplates(showPending ? 'pending' : 'approved');
            setDynamicTemplates(temps as any);
        }
    };

    if (!isOpen) return null;

    const allTemplates = showPending ? dynamicTemplates : [...xsltTemplates, ...dynamicTemplates];
    // Consolidate categories
    const categories = ['Hepsi', ...new Set(allTemplates.map(t => t.category))];

    const filteredTemplates = allTemplates.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'Hepsi' || t.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div
            className="animate-fade-in"
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '2rem', background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)'
            }}
        >
            <div
                className="animate-modal-enter"
                style={{
                    width: '100%', maxWidth: '1000px', maxHeight: '90vh',
                    background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(15, 23, 42, 0.4)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px', height: '40px', background: 'rgba(99, 102, 241, 0.2)',
                            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Layout size={24} color="#818cf8" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
                                {selectedTemplate ? 'Belge Türü Seçimi' : 'Tasarım Kütüphanesi'}
                            </h2>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                                {selectedTemplate ? `${selectedTemplate.name} teması için belge türünü seçin` : 'Türkiye standartlarında profesyonel XSLT şablonları'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => selectedTemplate ? setSelectedTemplate(null) : onClose()} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px' }}>
                        <X size={24} />
                    </button>
                </div>

                {!selectedTemplate ? (
                    <>
                        {/* Filters & Search */}
                        {/* Filters & Search */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            background: 'rgba(15, 23, 42, 0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            {/* User/Admin Role & Mode Switches */}
                            {isAdmin && (
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(15, 23, 42, 0.4)', padding: '6px', borderRadius: '10px', alignSelf: 'flex-start' }}>
                                    <button
                                        onClick={() => setShowPending(false)}
                                        style={{
                                            padding: '8px 16px', borderRadius: '8px',
                                            background: !showPending ? '#6366f1' : 'transparent',
                                            color: !showPending ? 'white' : '#94a3b8',
                                            border: !showPending ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                            fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s'
                                        }}
                                    >Onaylanmış</button>
                                    <button
                                        onClick={() => setShowPending(true)}
                                        style={{
                                            padding: '8px 16px', borderRadius: '8px',
                                            background: showPending ? '#f59e0b' : 'transparent',
                                            color: showPending ? 'white' : '#94a3b8',
                                            border: showPending ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                            fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', transition: 'all 0.2s'
                                        }}
                                    ><Clock size={16} /> Onay Bekleyenler</button>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ position: 'relative', flex: '1 1 300px', minWidth: '280px' }}>
                                    <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        placeholder="Şablonlarda ara..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px', padding: '0.85rem 1rem 0.85rem 2.5rem', color: 'white', outline: 'none',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    overflowX: 'auto',
                                    paddingBottom: '4px',
                                    flex: '1',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                    alignItems: 'center'
                                }}>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            style={{
                                                padding: '0.6rem 1.2rem', borderRadius: '10px', fontSize: '0.85rem',
                                                background: activeCategory === cat ? '#6366f1' : 'rgba(30, 41, 59, 0.5)',
                                                color: activeCategory === cat ? 'white' : '#94a3b8',
                                                border: '1px solid',
                                                borderColor: activeCategory === cat ? '#6366f1' : 'rgba(255,255,255,0.05)',
                                                cursor: 'pointer', transition: 'all 0.2s',
                                                whiteSpace: 'nowrap',
                                                flexShrink: 0
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {filteredTemplates.map(template => (
                                <div
                                    key={template.id}
                                    style={{
                                        background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease',
                                        display: 'flex', flexDirection: 'column'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.borderColor = template.previewColor;
                                        e.currentTarget.style.boxShadow = `0 10px 30px -10px ${template.previewColor}44`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    onClick={() => setSelectedTemplate(template)}
                                >
                                    <div style={{ height: '140px', background: template.previewColor, padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                        <div style={{
                                            width: '80%', height: '100%', background: 'rgba(255,255,255,0.95)',
                                            borderRadius: '8px 8px 0 0', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                            display: 'flex', flexDirection: 'column', padding: '10px', gap: '6px'
                                        }}>
                                            <div style={{ height: '4px', width: '40%', background: '#e2e8f0', borderRadius: '2px' }}></div>
                                            <div style={{ height: '4px', width: '20%', background: '#e2e8f0', borderRadius: '2px' }}></div>
                                            <div style={{ height: '20px', width: '100%', border: '1px solid #e2e8f0', marginTop: '4px' }}></div>
                                            <div style={{ height: '4px', width: '60%', background: '#e2e8f0', borderRadius: '2px', marginTop: 'auto' }}></div>
                                        </div>
                                        <div style={{
                                            position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.3)',
                                            padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', color: 'white'
                                        }}>
                                            {template.category}
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 6px 0', color: 'white' }}>{template.name}</h3>

                                        {/* Admin Metadata View */}
                                        {isAdmin && showPending && (
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '8px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '4px' }}>
                                                <div><b>Belge:</b> {(template as any).docType || 'Genel'}</div>
                                                <div><b>Kullanıcı:</b> {(template as any).username || 'Bilinmiyor'}</div>
                                                <div><b>Tarih:</b> {new Date((template as any).createdAt).toLocaleString('tr-TR')}</div>
                                            </div>
                                        )}

                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 1rem 0', lineHeight: '1.4' }}>{template.description}</p>
                                        <button className="btn-primary" style={{ marginTop: 'auto', width: '100%', padding: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <Sparkles size={14} /> Şablonu Seç
                                        </button>

                                        {/* Admin Actions */}
                                        {isAdmin && (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                {showPending && (
                                                    <button
                                                        onClick={(e) => handleApprove(e, template.id)}
                                                        className="btn-success"
                                                        style={{
                                                            flex: 1, padding: '6px', fontSize: '0.75rem',
                                                            background: 'rgba(16, 185, 129, 0.2)', color: '#10b981',
                                                            border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px',
                                                            cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px'
                                                        }}>
                                                        <CheckCircle size={14} /> Onayla
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => handleDelete(e, template.id)}
                                                    style={{
                                                        padding: '6px', fontSize: '0.75rem',
                                                        background: 'rgba(239, 68, 68, 0.2)', color: '#f87171',
                                                        border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px',
                                                        cursor: 'pointer'
                                                    }} title="Sil / Reddet">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {filteredTemplates.length === 0 && (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
                                    <Search size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                    <p>Aradığınız kriterlere uygun şablon bulunamadı.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Hangi belge üzerinde çalışacaksınız?</h3>
                            <p style={{ color: '#94a3b8' }}>Seçtiğiniz tema (<b>{selectedTemplate.name}</b>) aşağıdaki belge türlerinden birine uygulanacak.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', width: '100%', maxWidth: '900px' }}>
                            {docTypes.map(doc => (
                                <div
                                    key={doc.id}
                                    onClick={() => onSelect(selectedTemplate, doc.id)}
                                    style={{
                                        background: 'rgba(30, 41, 59, 0.4)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px', padding: '2rem',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        textAlign: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                                        e.currentTarget.style.borderColor = selectedTemplate.previewColor;
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <FileText size={40} color={selectedTemplate.previewColor} />
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>{doc.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
