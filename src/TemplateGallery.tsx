import React, { useState } from 'react';
import { X, Search, Filter, Check, Layout, Sparkles } from 'lucide-react';
import { xsltTemplates, XSLTTemplate } from './templates';

interface TemplateGalleryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: XSLTTemplate) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('Hepsi');

    if (!isOpen) return null;

    const categories = ['Hepsi', ...new Set(xsltTemplates.map(t => t.category))];

    const filteredTemplates = xsltTemplates.filter(t => {
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
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'white' }}>Tasarım Kütüphanesi</h2>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Türkiye standartlarında profesyonel XSLT şablonları</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Filters & Search */}
                <div style={{ padding: '1rem 2rem', background: 'rgba(15, 23, 42, 0.2)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                        <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Tasarım ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px', padding: '0.75rem 1rem 0.75rem 2.5rem', color: 'white', outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
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
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
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
                            onClick={() => onSelect(template)}
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
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 1rem 0', lineHeight: '1.4' }}>{template.description}</p>
                                <button className="btn-primary" style={{ marginTop: 'auto', width: '100%', padding: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Sparkles size={14} /> Şablonu Kullan
                                </button>
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
            </div>
        </div>
    );
};
