import React, { useState, useEffect, useRef } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { ChevronLeft, Save, Type, Table as LucideTable, Sigma, Image as ImageIcon, Ruler, Layout, Settings, Upload, Move, ShieldCheck, X, Sparkles, Square, Circle, Minus, Undo, Copy, QrCode, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Box } from 'lucide-react';
import { DraggableElement } from './DraggableElement.tsx';
import { mergeDesignWithXslt } from './xsltMerger.ts';
import { transformXmlWithXslt } from './xsltTransformer.ts';
import { instrumentXslt, selectionScript } from './xsltInstrumenter.ts';
import { api } from './api';
import { PaymentModal } from './PaymentModal.tsx';
import type { DesignElement, DesignState, TableCell, XsltElementOverride } from './types.ts';

interface ProfessionalDesignerProps {
    template: string;
    customContent?: string;
    docName: string;
    moduleId: string;
    onBack: () => void;
}

export const ProfessionalDesigner: React.FC<ProfessionalDesignerProps> = ({ template, customContent, docName, moduleId, onBack }) => {
    const [state, setState] = useState<DesignState>({
        elements: [],
        xsltOverrides: [],
        companyName: 'Örnek Firma A.Ş.',
        logoUrl: '',
        selectedId: null,
        selectedXsltElement: null,
    });
    const [backgroundHtml, setBackgroundHtml] = useState('');
    const [previewHtml, setPreviewHtml] = useState('');
    const [originalXslt, setOriginalXslt] = useState('');
    const [selectedDbField, setSelectedDbField] = useState<{ path: string, value: string } | null>(null);
    const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [availableNumericFields, setAvailableNumericFields] = useState<{ path: string, name: string, value: string }[]>([]);
    const [history, setHistory] = useState<DesignState[]>([]);

    const saveHistory = () => {
        setHistory(prev => [...prev.slice(-49), JSON.parse(JSON.stringify(state))]);
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const lastState = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        setState(lastState);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
    const PREVIEW_SCALE = 0.7;
    const SNAP_SIZE = 5;
    useEffect(() => {
        const loadData = async () => {
            try {
                let text = '';

                if (customContent) {
                    console.log('📂 Loading Custom XSLT content...');
                    text = customContent;
                } else {
                    console.log('📂 Loading XSLT template:', template);
                    const xsltRes = await fetch(`./${template}`);

                    if (!xsltRes.ok) {
                        const msg = `Tasarım dosyası yüklenemedi (${template}). Sunucuda dosya bulunamadı.`;
                        console.error('❌ XSLT fetch failed:', xsltRes.status, xsltRes.statusText);
                        setLoadError(msg);
                        return;
                    }
                    text = await xsltRes.text();
                }

                // Instrument ONCE
                const instrumented = instrumentXslt(text);

                console.log('✅ XSLT loaded & instrumented.');
                setOriginalXslt(instrumented);

                refreshPreview(instrumented, state);

            } catch (err) {
                console.error("❌ Initial load error:", err);
            }
        };
        loadData();
    }, [template, customContent]);

    // Helper to clean styles for inner elements (removes positioning)
    const cleanStyle = (style?: React.CSSProperties): React.CSSProperties => {
        if (!style) return {};
        const { position, left, top, right, bottom, ...rest } = style as any;
        return rest;
    };

    // Map module IDs to their corresponding XML files
    const getXmlFile = (moduleId: string): string => {
        const xmlMap: Record<string, string> = {
            'fatura': 'e-fatura-detail.xml',
            'arsiv': 'e-arsiv-detail.xml',
            'mikro': 'e-arsiv-detail.xml',
            'net': 'e-ticaret-detail.xml',
            'yolcu': 'e-fatura-detail.xml',
            'ihracat': 'e-ihracat-detail.xml',
        };
        return xmlMap[moduleId] || 'e-fatura-detail.xml';
    };

    const isTableElement = (type?: string) => type === 'table' || type === 'td' || type === 'tr' || type === 'th';

    const extractNumericFields = (xmlText: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'text/xml');
        const fields: { path: string, name: string, value: string }[] = [];

        const traverse = (node: Node, path: string = '') => {
            if (node.nodeType === 1) { // Element
                const el = node as Element;
                const currentPath = path ? `${path}/${el.tagName}` : el.tagName;

                if (el.children.length === 0) {
                    const val = el.textContent?.trim() || '';
                    // Numeric check: digits, dots, commas, minus
                    if (val && /^[\d.,\-]+$/.test(val)) {
                        fields.push({
                            path: currentPath,
                            name: el.tagName,
                            value: val
                        });
                    }
                } else {
                    Array.from(el.childNodes).forEach(child => traverse(child, currentPath));
                }
            }
        };

        traverse(doc.documentElement);
        return fields;
    };

    const xmlCache = useRef<string | null>(null);

    const refreshPreview = async (xslt: string, currentState: DesignState) => {
        try {
            let xmlText = xmlCache.current;
            if (!xmlText) {
                const xmlFile = getXmlFile(moduleId);
                console.log('🔄 Loading XML file:', xmlFile);
                const xmlRes = await fetch(`./examples/${xmlFile}`);

                if (!xmlRes.ok) {
                    console.error('❌ XML fetch failed:', xmlRes.status, xmlRes.statusText);
                    return;
                }
                xmlText = await xmlRes.text();
                xmlCache.current = xmlText;

                // Extract numeric fields once XML is loaded
                const numericFields = extractNumericFields(xmlText);
                setAvailableNumericFields(numericFields);
            }
            console.log('✅ XML loaded, length:', xmlText.length);

            // NOTE: We do NOT instrument here anymore. The passed `xslt` is already instrumented.

            console.log('🎨 Transforming for background...');
            let bgHtml = transformXmlWithXslt(xmlText, xslt);

            // Inject selection script into generated HTML
            if (bgHtml.includes('</body>')) {
                bgHtml = bgHtml.replace('</body>', selectionScript + '</body>');
            } else {
                bgHtml += selectionScript;
            }

            console.log('✅ Background HTML generated, length:', bgHtml.length);
            console.log('Background HTML preview:', bgHtml.substring(0, 500));
            setBackgroundHtml(bgHtml);

            console.log('🎨 Transforming for preview...');
            const mergedXslt = mergeDesignWithXslt(xslt, currentState);
            const finalHtml = transformXmlWithXslt(xmlText, mergedXslt);
            console.log('✅ Preview HTML generated, length:', finalHtml.length);
            setPreviewHtml(finalHtml);
        } catch (err) {
            console.error("❌ Preview refresh error:", err);
        }
    };


    useEffect(() => {
        xmlCache.current = null;
    }, [moduleId]);

    useEffect(() => {
        if (originalXslt) {
            refreshPreview(originalXslt, state);
        }
    }, [state, originalXslt]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'XSLT_FIELD_CLICKED') {
                setSelectedDbField({ path: event.data.path, value: event.data.value });
            } else if (event.data?.type === 'XSLT_ELEMENT_CLICKED') {
                console.log('🖱️ XSLT Element Clicked:', event.data);
                // User clicked on an existing XSLT element (logo, table, db field)
                const { elementId, elementType, shapeType, path, currentStyles, rect, innerText, isDynamic, tableData, rowCount, colCount } = event.data;

                // Find existing override or create new one
                const existingOverride = state.xsltOverrides.find(o => o.elementId === elementId);

                const xsltElement: XsltElementOverride = existingOverride || {
                    elementId,
                    elementType: elementType as any, // Cast to any to accept 'tr', 'td' etc.
                    shapeType, // NEW
                    path: (elementType === 'table' || elementType === 'tr') ? `[${elementType.toUpperCase()} YAPISI]` : path,
                    content: innerText,
                    isDynamic,
                    tableData,
                    rowCount,
                    colCount,
                    x: rect?.x || 0,
                    y: rect?.y || 0,
                    width: rect?.width,
                    height: rect?.height,
                    styleOverrides: {
                        fontSize: currentStyles.fontSize,
                        color: currentStyles.color,
                        backgroundColor: currentStyles.backgroundColor === 'rgba(0, 0, 0, 0)' ? 'transparent' : currentStyles.backgroundColor,
                        fontWeight: currentStyles.fontWeight,
                        fontStyle: currentStyles.fontStyle,
                        fontFamily: currentStyles.fontFamily,
                        position: 'absolute' as any,
                        left: `${rect?.x || 0}px`,
                        top: `${rect?.y || 0}px`,
                        width: `${rect?.width}px`,
                        border: currentStyles.border,
                        borderRadius: currentStyles.borderRadius
                    }
                };

                setState(prev => ({
                    ...prev,
                    selectedXsltElement: xsltElement,
                    selectedId: null // Deselect user-added elements
                }));
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [state.xsltOverrides]);

    const addElement = (type: DesignElement['type'], initialContent: string = '') => {
        saveHistory();
        let tableData: TableCell[][] | undefined;
        let colWidths: number[] | undefined;
        let rowHeights: number[] | undefined;

        const baseStyle: React.CSSProperties = {
            fontSize: '12px',
            color: '#000000',
            backgroundColor: 'transparent'
        };

        if (type === 'table') {
            tableData = [
                [{ content: 'Sütun 1' }, { content: 'Sütun 2' }],
                [{ content: 'Veri 1' }, { content: 'Veri 2' }]
            ];
            colWidths = [150, 150];
            rowHeights = [30, 30];
        }

        if (type === 'image') {
            baseStyle.width = '120px';
            baseStyle.height = '60px';
        }

        if (type === 'shape') {
            baseStyle.width = '120px';
            baseStyle.height = initialContent === 'line' ? '2px' : '100px';
            baseStyle.border = initialContent === 'line' ? 'none' : '1px solid #000';
            if (initialContent === 'line') {
                baseStyle.backgroundColor = '#000000';
            }
        }

        const newElement: DesignElement = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            x: 50,
            y: 50,
            content: initialContent || (type === 'text' ? 'Yeni Metin' : type === 'formula' ? 'Fiyat * Adet' : type === 'image' ? '' : ''),
            shapeType: (type === 'shape') ? (initialContent as any || 'rect') : undefined,
            style: baseStyle,
            rows: type === 'table' ? 2 : undefined,
            cols: type === 'table' ? 2 : undefined,
            colWidths,
            rowHeights,
            tableData
        };
        setState(prev => ({ ...prev, elements: [...prev.elements, newElement], selectedId: newElement.id }));
        setNotification({ message: `${type === 'shape' ? 'Şekil' : 'Nesne'} başarıyla eklendi.`, type: 'success' });
    };

    const addShape = (shapeType: 'rect' | 'circle' | 'line') => {
        addElement('shape', shapeType);
    };

    const duplicateElement = () => {
        if (!state.selectedId && !state.selectedXsltElement) return;
        saveHistory();

        if (state.selectedId) {
            const el = state.elements.find(e => e.id === state.selectedId);
            if (el) {
                const newEl: DesignElement = {
                    ...JSON.parse(JSON.stringify(el)),
                    id: Math.random().toString(36).substr(2, 9),
                    x: el.x + 20,
                    y: el.y + 20
                };
                setState(prev => ({ ...prev, elements: [...prev.elements, newEl], selectedId: newEl.id }));
            }
        } else if (state.selectedXsltElement) {
            const override = state.selectedXsltElement;
            const newEl: DesignElement = {
                id: Math.random().toString(36).substr(2, 9),
                type: (override.elementType === 'image') ? 'image' : (override.elementType as any === 'table' ? 'table' : 'text'),
                x: (override.x || 0) + 20,
                y: (override.y || 0) + 20,
                content: override.content || '',
                binding: override.isDynamic ? override.path : undefined,
                style: { ...override.styleOverrides, position: 'absolute' as any },
                tableData: override.tableData,
                rows: override.rowCount,
                cols: override.colCount
            };
            setState(prev => ({ ...prev, elements: [...prev.elements, newEl], selectedId: newEl.id, selectedXsltElement: null }));
        }
        setNotification({ message: 'Nesne kopyalandı.', type: 'success' });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        saveHistory();

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            if (selectedElement && selectedElement.type === 'image') {
                setState(prev => ({
                    ...prev,
                    elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, content: base64 } : el)
                }));
            } else {
                addElement('image', base64);
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };


    const handleDragMove = (event: DragEndEvent) => {
        const { active, delta } = event;
        // Check if it is an XSLT element (starts with table-, img-, etc and has overrides)
        const override = state.xsltOverrides.find(o => o.elementId === active.id);
        if (override) {
            const newX = (override.x || 0) + (delta.x / PREVIEW_SCALE);
            const newY = (override.y || 0) + (delta.y / PREVIEW_SCALE);

            // Live update via postMessage
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                    type: 'UPDATE_ELEMENT_STYLE',
                    elementId: active.id,
                    style: {
                        left: `${newX}px`,
                        top: `${newY}px`,
                        position: 'absolute' as any
                    }
                }, '*');
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        if (active) {
            const dx = delta.x / PREVIEW_SCALE;
            const dy = delta.y / PREVIEW_SCALE;

            // Check if it is an XSLT element
            const overrideIndex = state.xsltOverrides.findIndex(o => o.elementId === active.id);
            if (overrideIndex >= 0) {
                saveHistory();
                setState(prev => {
                    const overrides = [...prev.xsltOverrides];
                    const current = overrides[overrideIndex];
                    let newX = (current.x || 0) + dx;
                    let newY = (current.y || 0) + dy;

                    // Snap to grid
                    newX = Math.round(newX / SNAP_SIZE) * SNAP_SIZE;
                    newY = Math.round(newY / SNAP_SIZE) * SNAP_SIZE;

                    overrides[overrideIndex] = {
                        ...current,
                        x: newX,
                        y: newY,
                        styleOverrides: {
                            ...current.styleOverrides,
                            left: `${newX}px`,
                            top: `${newY}px`,
                            position: 'absolute' as any
                        }
                    };

                    return { ...prev, xsltOverrides: overrides };
                });
            } else {
                saveHistory();
                setState(prev => ({
                    ...prev,
                    elements: prev.elements.map(el => {
                        if (el.id === active.id) {
                            let newX = el.x + dx;
                            let newY = el.y + dy;
                            // Snap
                            newX = Math.round(newX / SNAP_SIZE) * SNAP_SIZE;
                            newY = Math.round(newY / SNAP_SIZE) * SNAP_SIZE;
                            return { ...el, x: newX, y: newY };
                        }
                        return el;
                    })
                }));
            }
        }
    };

    // Keyboard support for moving objects
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!state.selectedId && !state.selectedXsltElement) return;
            // Don't move if typing in an input
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

            const isArrow = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code);
            if (!isArrow) return;

            e.preventDefault();
            const step = e.shiftKey ? 10 : 1;
            const moveX = e.code === 'ArrowLeft' ? -step : e.code === 'ArrowRight' ? step : 0;
            const moveY = e.code === 'ArrowUp' ? -step : e.code === 'ArrowDown' ? step : 0;

            if (state.selectedId) {
                setState(prev => ({
                    ...prev,
                    elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, x: el.x + moveX, y: el.y + moveY } : el)
                }));
            } else if (state.selectedXsltElement) {
                const elementId = state.selectedXsltElement.elementId;
                setState(prev => {
                    const overrides = [...prev.xsltOverrides];
                    const idx = overrides.findIndex(o => o.elementId === elementId);
                    if (idx >= 0) {
                        const updated = {
                            ...overrides[idx],
                            x: (overrides[idx].x || 0) + moveX,
                            y: (overrides[idx].y || 0) + moveY
                        };
                        updated.styleOverrides = { ...updated.styleOverrides, left: `${updated.x}px`, top: `${updated.y}px` };
                        overrides[idx] = updated;
                        return { ...prev, xsltOverrides: overrides, selectedXsltElement: updated };
                    }
                    return prev;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.selectedId, state.selectedXsltElement, state.xsltOverrides]);

    const selectedElement = state.elements.find(e => e.id === state.selectedId);

    const [userInfo, setUserInfo] = useState<{ credits: number, role: string, free_design_used: number } | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        api.getMe()
            .then(info => {
                setUserInfo(info);
                // Kredi sıfırsa otomatik ödeme modalını aç
                if (info.credits === 0 && info.role !== 'admin') {
                    setShowPaymentModal(true);
                }
            })
            .catch(err => {
                console.error('Kullanıcı bilgisi alınamadı:', err);
                setLoadError('Sunucu bağlantısı kurulamadı. Lütfen giriş yaptığınızdan emin olun ve sayfayı yenileyin.');
            });
    }, []);

    const handleSave = async () => {
        try {
            const res = await api.consumeCredit();
            if (res.success) {
                setUserInfo(prev => prev ? { ...prev, credits: res.credits } : null);

                const finalXslt = mergeDesignWithXslt(originalXslt, state);
                const blob = new Blob([finalXslt], { type: 'text/xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `MODIFIED_${template}`;
                a.click();

                setNotification({
                    message: `Tasarım başarıyla kaydedildi! Kalan Krediniz: ${res.credits}`,
                    type: 'success'
                });
            }
        } catch (err: any) {
            const isNoCredit = err.message.includes('Insufficient credits') || err.message.includes('krediniz bulunamadı') || err.message.includes('Yetersiz kredi');
            if (isNoCredit) {
                setShowPaymentModal(true);
            } else {
                setNotification({ message: 'Hata: ' + (err.message || 'İşlem başarısız.'), type: 'error' });
            }
        }
    };


    if (loadError) {
        return (
            <div style={{ height: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: '#f87171', fontSize: '1.2rem', fontWeight: 'bold' }}>⚠️ Yükleme Hatası</div>
                <div style={{ color: '#94a3b8', maxWidth: '500px' }}>{loadError}</div>
                <button onClick={onBack} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>Geri Dön</button>
            </div>
        );
    }

    if (!userInfo || !originalXslt) {
        return (
            <div style={{ height: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                <div style={{ color: '#94a3b8', fontSize: '1rem' }}>Tasarım Editörü Hazırlanıyor...</div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f172a', position: 'relative' }}>
            {/* Custom Notification Toast */}
            {notification && (
                <div style={{
                    position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '1rem 1.5rem', borderRadius: '16px', background: '#1e293b',
                    border: `1px solid ${notification.type === 'success' ? '#10b981' : '#f87171'}`,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
                    animation: 'slideDown 0.3s ease-out'
                }}>
                    <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: notification.type === 'success' ? '#10b98122' : '#f8717122'
                    }}>
                        {notification.type === 'success' ? (
                            <ShieldCheck size={18} color="#10b981" />
                        ) : (
                            <X size={18} color="#f87171" />
                        )}
                    </div>
                    <span style={{ color: 'white', fontWeight: '500', fontSize: '0.95rem' }}>{notification.message}</span>
                </div>
            )}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={(credits) => setUserInfo(prev => prev ? { ...prev, credits } : null)}
            />

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />

            <header style={{
                height: '56px', background: '#1e293b', borderBottom: '1px solid #334155',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layout size={18} color="#6366f1" />
                        <span style={{ fontWeight: 'bold' }}>{docName} Tasarımcısı</span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>({template})</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {userInfo && (
                        <div style={{ marginRight: '1rem', background: '#0f172a', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', color: userInfo.credits > 0 ? '#10b981' : '#f87171', border: '1px solid #334155' }}>
                            Kredi: <b>{userInfo.credits}</b> {userInfo.role === 'admin' && '(Admin)'}
                        </div>
                    )}
                    <button
                        onClick={handleUndo}
                        disabled={history.length === 0}
                        style={{
                            height: '36px', padding: '0 1rem', fontSize: '0.875rem',
                            background: 'transparent', border: '1px solid #334155',
                            color: history.length > 0 ? '#94a3b8' : '#334155', borderRadius: '8px',
                            cursor: history.length > 0 ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <Undo size={16} /> Geri Al
                    </button>
                    <button onClick={handleSave} className="btn-primary" style={{ height: '36px', padding: '0 1rem', fontSize: '0.875rem' }}>
                        <Save size={16} style={{ marginRight: '6px' }} /> Kaydet / XSLT Oluştur
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <aside style={{ width: '260px', background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', zIndex: 5 }}>
                    <div style={{ padding: '0.75rem', background: '#0f172a', borderBottom: '1px solid #334155' }}>
                        <label style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>NESNE KÜTÜPHANESİ</label>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                            <button onClick={() => addElement('text')} title="Metin" style={{ flex: 1, height: '40px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Type size={20} />
                            </button>
                            <button onClick={() => addElement('table')} title="Tablo" style={{ flex: 1, height: '40px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LucideTable size={20} />
                            </button>
                            <button onClick={() => addElement('formula')} title="Formül" style={{ flex: 1, height: '40px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sigma size={20} />
                            </button>
                            <button onClick={() => fileInputRef.current?.click()} title="Resim Ekle (Dosyadan)" style={{ flex: 1, height: '40px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={20} />
                            </button>
                            <button onClick={() => addElement('qrcode')} title="QR Kodu Ekle" style={{ flex: 1, height: '40px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <QrCode size={20} />
                            </button>
                        </div>
                        <label style={{ fontSize: '0.65rem', color: '#64748b', margin: '8px 0', display: 'block', fontWeight: 'bold' }}>ŞEKİLLER</label>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                            <button onClick={() => addShape('rect')} title="Dikdörtgen" style={{ flex: 1, height: '40px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Square size={20} />
                            </button>
                            <button onClick={() => addShape('circle')} title="Daire" style={{ flex: 1, height: '40px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Circle size={20} />
                            </button>
                            <button onClick={() => addShape('line')} title="Çizgi" style={{ flex: 1, height: '40px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Minus size={20} />
                            </button>
                        </div>
                    </div>

                    <div style={{ padding: '0.75rem', background: '#0f172a', borderBottom: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Ruler size={16} color="#6366f1" />
                                <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>Özellik Denetçisi</span>
                            </div>
                            {(state.selectedId || state.selectedXsltElement) && (
                                <button
                                    onClick={duplicateElement}
                                    title="Seçili Nesneyi Kopyala"
                                    style={{
                                        background: '#1e293b', border: '1px solid #334155',
                                        color: '#10b981', borderRadius: '4px', padding: '4px 8px',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                                        fontSize: '0.65rem'
                                    }}
                                >
                                    <Copy size={12} /> Kopyala
                                </button>
                            )}
                        </div>
                        {state.selectedId ? (
                            <div style={{ padding: '4px 8px', background: '#6366f122', borderRadius: '4px', border: '1px solid #6366f144', marginTop: '4px' }}>
                                <span style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Seçili Nesne</span>
                                <span style={{ fontSize: '0.75rem', color: 'white' }}>{state.elements.find(e => e.id === state.selectedId)?.type.toUpperCase()}</span>
                            </div>
                        ) : state.selectedXsltElement ? (
                            <div style={{ padding: '4px 8px', background: state.selectedXsltElement.isDynamic ? '#10b98122' : '#6366f122', borderRadius: '4px', border: `1px solid ${state.selectedXsltElement.isDynamic ? '#10b98144' : '#6366f144'}`, marginTop: '4px' }}>
                                <span style={{ fontSize: '0.6rem', color: state.selectedXsltElement.isDynamic ? '#34d399' : '#818cf8', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
                                    {state.selectedXsltElement.isDynamic ? 'Veri Alanı (XPATH)' : 'Tablon / Şablon Nesnesi'}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>
                                    {state.selectedXsltElement.isDynamic && state.selectedXsltElement.path ?
                                        state.selectedXsltElement.path.split('/').pop() :
                                        (state.selectedXsltElement.elementType === 'table' ? 'Tablo Nesnesi' :
                                            state.selectedXsltElement.elementType === 'tr' ? 'Tablo Satırı' :
                                                (state.selectedXsltElement.elementType === 'td' || state.selectedXsltElement.elementType === 'th') ? 'Tablo Hücresi' :
                                                    'Şablon Alanı')}
                                </span>
                            </div>
                        ) : null}
                    </div>

                    <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
                        {selectedDbField ? (
                            <div style={{ background: '#6366f122', padding: '1rem', border: '1px solid #6366f1', borderRadius: '8px', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 'bold' }}>SİSTEM ALANI</span>
                                <h4 style={{ margin: '4px 0', fontSize: '0.9rem', color: 'white' }}>{selectedDbField.path.split('/').pop()}</h4>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', wordBreak: 'break-all', marginBottom: '8px' }}>{selectedDbField.path}</div>
                                {state.selectedId && (
                                    <button
                                        onClick={() => {
                                            setState(prev => ({
                                                ...prev,
                                                elements: prev.elements.map(el =>
                                                    el.id === state.selectedId ? { ...el, binding: selectedDbField.path } : el
                                                )
                                            }));
                                            setSelectedDbField(null);
                                        }}
                                        style={{ width: '100%', padding: '6px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                    >
                                        Seçili Nesneye Bağla
                                    </button>
                                )}
                            </div>
                        ) : null}

                        {selectedElement ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {selectedElement.type === 'image' ? (
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Görsel Kaynağı (Base64)</label>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                            >
                                                <Upload size={14} /> Görsel Değiştir
                                            </button>
                                        </div>
                                        <div style={{ marginTop: '8px', padding: '4px', background: '#020617', borderRadius: '4px', textAlign: 'center' }}>
                                            <img src={selectedElement.content} style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }} alt="Preview" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{selectedElement.type === 'text' ? 'Metin' : selectedElement.type === 'formula' ? 'Formül' : 'İçerik'}</label>
                                        <input
                                            className="input-field"
                                            style={{ background: '#020617', border: '1px solid #334155', color: 'white', width: '100%', padding: '8px', borderRadius: '4px', fontSize: '0.85rem' }}
                                            value={selectedElement.content}
                                            onChange={(e) => setState(prev => ({
                                                ...prev,
                                                elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, content: e.target.value } : el)
                                            }))}
                                        />

                                        {selectedElement.type === 'formula' && (
                                            <div style={{ marginTop: '1rem', background: '#0f172a', padding: '0.75rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                                                <label style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>FORMÜL OLUŞTURUCU</label>

                                                {['+', '-', '*', '/', '(', ')', 'sum'].map(op => (
                                                    <button
                                                        key={op}
                                                        onClick={() => {
                                                            setState(prev => ({
                                                                ...prev,
                                                                elements: prev.elements.map(el => {
                                                                    if (el.id !== state.selectedId) return el;
                                                                    let add = op === 'sum' ? 'sum( ' : ` ${op} `;
                                                                    return { ...el, content: el.content + add };
                                                                })
                                                            }));
                                                        }}
                                                        style={{ padding: '6px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.65rem' }}
                                                    >{op.toUpperCase()}</button>
                                                ))}

                                                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    {availableNumericFields.length > 0 ? availableNumericFields.map(f => (
                                                        <button
                                                            key={f.path}
                                                            onClick={() => {
                                                                // Use safe path for XSL formula (handles Turkish number format)
                                                                setState(prev => ({
                                                                    ...prev,
                                                                    elements: prev.elements.map(el => {
                                                                        if (el.id !== state.selectedId) return el;
                                                                        const safePath = `number(translate(translate(//${f.path}, '.', ''), ',', '.'))`;
                                                                        return { ...el, content: el.content + safePath };
                                                                    })
                                                                }));
                                                            }}
                                                            style={{ textAlign: 'left', padding: '6px 10px', background: '#020617', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}
                                                        >
                                                            <span style={{ color: '#818cf8' }}>{f.name}</span>
                                                            <span style={{ opacity: 0.5 }}>{f.value}</span>
                                                        </button>
                                                    )) : (
                                                        <div style={{ padding: '1rem', textAlign: 'center', color: '#475569', fontSize: '0.7rem' }}>Sayısal alan bulunamadı.</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {selectedElement.binding && (
                                            <div style={{ marginTop: '4px', fontSize: '0.7rem', color: '#6366f1', background: '#eef2ff22', padding: '4px', borderRadius: '4px' }}>
                                                🔗 {selectedElement.binding}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <Move size={14} color="#6366f1" />
                                        <label style={{ fontSize: '0.75rem', color: 'white', fontWeight: 'bold' }}>Boyutlar & Konum</label>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.65rem', color: '#64748b' }}>Genişlik (px)</label>
                                            <input
                                                type="number"
                                                className="input-field"
                                                style={{ background: '#020617', border: '2px solid #6366f188', color: 'white', width: '100%', padding: '6px', borderRadius: '4px' }}
                                                value={parseInt(selectedElement.style?.width as string) || 0}
                                                onChange={(e) => {
                                                    const val = e.target.value ? `${e.target.value}px` : undefined;
                                                    setState(prev => ({
                                                        ...prev,
                                                        elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, width: val } } : el)
                                                    }));
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.65rem', color: '#64748b' }}>Yükseklik (px)</label>
                                            <input
                                                type="number"
                                                className="input-field"
                                                style={{ background: '#020617', border: '2px solid #6366f188', color: 'white', width: '100%', padding: '6px', borderRadius: '4px' }}
                                                value={parseInt(selectedElement.style?.height as string) || 0}
                                                onChange={(e) => {
                                                    const val = e.target.value ? `${e.target.value}px` : undefined;
                                                    setState(prev => ({
                                                        ...prev,
                                                        elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, height: val } } : el)
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.65rem', color: '#64748b' }}>Sol Uzaklık (X)</label>
                                            <input type="number" className="input-field" style={{ background: '#020617', border: '1px solid #334155', color: 'white', width: '100%', padding: '4px' }} value={Math.round(selectedElement.x)} onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setState(prev => ({ ...prev, elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, x: val } : el) }));
                                            }} />
                                        </div>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.65rem', color: '#64748b' }}>Üst Uzaklık (Y)</label>
                                            <input type="number" className="input-field" style={{ background: '#020617', border: '1px solid #334155', color: 'white', width: '100%', padding: '4px' }} value={Math.round(selectedElement.y)} onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setState(prev => ({ ...prev, elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, y: val } : el) }));
                                            }} />
                                        </div>
                                    </div>

                                    {selectedElement.type !== 'image' && (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.65rem', color: '#64748b' }}>Yazı Boyutu (px)</label>
                                                    <input
                                                        type="number"
                                                        className="input-field"
                                                        style={{ background: '#020617', border: '1px solid #334155', color: 'white', width: '100%', padding: '6px' }}
                                                        value={parseInt(selectedElement.style?.fontSize as string) || 12}
                                                        onChange={(e) => {
                                                            const fontSize = `${e.target.value}px`;
                                                            setState(prev => ({
                                                                ...prev,
                                                                elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, fontSize } } : el)
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group" style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
                                                    <button
                                                        onClick={() => {
                                                            const isBold = selectedElement.style?.fontWeight === 'bold';
                                                            setState(prev => ({
                                                                ...prev,
                                                                elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, fontWeight: isBold ? 'normal' : 'bold' } } : el)
                                                            }));
                                                        }}
                                                        style={{ flex: 1, height: '32px', background: selectedElement.style?.fontWeight === 'bold' ? '#6366f1' : '#020617', border: '1px solid #334155', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                    >B</button>
                                                    <button
                                                        onClick={() => {
                                                            const isItalic = selectedElement.style?.fontStyle === 'italic';
                                                            setState(prev => ({
                                                                ...prev,
                                                                elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, fontStyle: isItalic ? 'normal' : 'italic' } } : el)
                                                            }));
                                                        }}
                                                        style={{ flex: 1, height: '32px', background: selectedElement.style?.fontStyle === 'italic' ? '#6366f1' : '#020617', border: '1px solid #334155', color: 'white', borderRadius: '4px', cursor: 'pointer', fontStyle: 'italic' }}
                                                    >I</button>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.65rem', color: '#64748b' }}>Yazı Rengi</label>
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        <input
                                                            type="color"
                                                            style={{ width: '30px', height: '30px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                            value={selectedElement.style?.color as string || '#000000'}
                                                            onChange={(e) => {
                                                                const color = e.target.value;
                                                                setState(prev => ({
                                                                    ...prev,
                                                                    elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, color } } : el)
                                                                }));
                                                            }}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="input-field"
                                                            style={{ flex: 1, background: '#020617', border: '1px solid #334155', color: 'white', padding: '4px', fontSize: '0.75rem' }}
                                                            value={selectedElement.style?.color as string || '#000000'}
                                                            onChange={(e) => {
                                                                const color = e.target.value;
                                                                setState(prev => ({
                                                                    ...prev,
                                                                    elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, color } } : el)
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.65rem', color: '#64748b' }}>Zemin Rengi</label>
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        <input
                                                            type="color"
                                                            style={{ width: '30px', height: '30px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                            value={selectedElement.style?.backgroundColor === 'transparent' ? '#ffffff' : selectedElement.style?.backgroundColor as string || '#ffffff'}
                                                            onChange={(e) => {
                                                                const backgroundColor = e.target.value;
                                                                setState(prev => ({
                                                                    ...prev,
                                                                    elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, backgroundColor } } : el)
                                                                }));
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => setState(prev => ({ ...prev, elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, backgroundColor: 'transparent' } } : el) }))}
                                                            style={{ flex: 1, background: selectedElement.style?.backgroundColor === 'transparent' ? '#6366f1' : '#020617', border: '1px solid #334155', color: 'white', borderRadius: '4px', fontSize: '0.65rem', cursor: 'pointer' }}
                                                        >Şeffaf</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {selectedElement.type === 'table' && (
                                    <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem' }}>
                                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', display: 'block' }}>Tablo Yapısı (Satır/Sütun Sayısı)</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.1rem', marginBottom: '1rem' }}>
                                            <div className="form-group">
                                                <label style={{ fontSize: '0.65rem', color: '#64748b' }}>Satır</label>
                                                <input
                                                    type="number"
                                                    className="input-field"
                                                    style={{ background: '#020617', border: '1px solid #334155', color: 'white', width: '100%', padding: '4px' }}
                                                    value={selectedElement.rows || 0}
                                                    onChange={(e) => {
                                                        const rows = parseInt(e.target.value);
                                                        setState(prev => ({
                                                            ...prev,
                                                            elements: prev.elements.map(el => {
                                                                if (el.id !== state.selectedId) return el;
                                                                let newData = [...(el.tableData || [])];
                                                                let newHeights = [...(el.rowHeights || [])];
                                                                if (rows > newData.length) {
                                                                    for (let i = newData.length; i < rows; i++) {
                                                                        newData.push(new Array(el.cols || 2).fill({ content: '' }));
                                                                        newHeights.push(30);
                                                                    }
                                                                } else {
                                                                    newData = newData.slice(0, rows);
                                                                    newHeights = newHeights.slice(0, rows);
                                                                }
                                                                return { ...el, rows, tableData: newData, rowHeights: newHeights };
                                                            })
                                                        }));
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label style={{ fontSize: '0.65rem', color: '#64748b' }}>Sütun</label>
                                                <input
                                                    type="number"
                                                    className="input-field"
                                                    style={{ background: '#020617', border: '1px solid #334155', color: 'white', width: '100%', padding: '4px' }}
                                                    value={selectedElement.cols || 0}
                                                    onChange={(e) => {
                                                        const cols = parseInt(e.target.value);
                                                        setState(prev => ({
                                                            ...prev,
                                                            elements: prev.elements.map(el => {
                                                                if (el.id !== state.selectedId) return el;
                                                                let newData = (el.tableData || []).map(row => {
                                                                    let newRow = [...row];
                                                                    if (cols > newRow.length) {
                                                                        for (let i = newRow.length; i < cols; i++) newRow.push({ content: '' });
                                                                    } else {
                                                                        newRow = newRow.slice(0, cols);
                                                                    }
                                                                    return newRow;
                                                                });
                                                                let newWidths = [...(el.colWidths || [])];
                                                                if (cols > newWidths.length) {
                                                                    for (let i = newWidths.length; i < cols; i++) newWidths.push(100);
                                                                } else {
                                                                    newWidths = newWidths.slice(0, cols);
                                                                }
                                                                return { ...el, cols, tableData: newData, colWidths: newWidths };
                                                            })
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', display: 'block' }}>Hücre Bazlı Genişlik/Yükseklik</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #334155', padding: '6px', borderRadius: '4px', background: '#0f172a' }}>
                                                <label style={{ fontSize: '0.6rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Sütun Genişlik (px)</label>
                                                {selectedElement.colWidths?.map((w, i) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                        <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Kol {i + 1}:</span>
                                                        <input
                                                            type="number"
                                                            style={{ width: '55px', background: '#020617', border: '1px solid #6366f144', color: 'white', fontSize: '0.7rem', padding: '2px' }}
                                                            value={w}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value) || 0;
                                                                setState(prev => ({
                                                                    ...prev,
                                                                    elements: prev.elements.map(el => {
                                                                        if (el.id !== state.selectedId || !el.colWidths) return el;
                                                                        const newWidths = [...el.colWidths];
                                                                        newWidths[i] = val;
                                                                        return { ...el, colWidths: newWidths };
                                                                    })
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #334155', padding: '6px', borderRadius: '4px', background: '#0f172a' }}>
                                                <label style={{ fontSize: '0.6rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Satır Yükseklik (px)</label>
                                                {selectedElement.rowHeights?.map((h, i) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                        <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Sat {i + 1}:</span>
                                                        <input
                                                            type="number"
                                                            style={{ width: '55px', background: '#020617', border: '1px solid #6366f144', color: 'white', fontSize: '0.7rem', padding: '2px' }}
                                                            value={h}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value) || 0;
                                                                setState(prev => ({
                                                                    ...prev,
                                                                    elements: prev.elements.map(el => {
                                                                        if (el.id !== state.selectedId || !el.rowHeights) return el;
                                                                        const newHeights = [...el.rowHeights];
                                                                        newHeights[i] = val;
                                                                        return { ...el, rowHeights: newHeights };
                                                                    })
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ border: '1px solid #334155', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                                            <div style={{ background: '#0f172a', padding: '4px', fontSize: '0.7rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#94a3b8' }}>Hücre Verileri</span>
                                                {selectedCell && <span style={{ color: '#6366f1' }}>Seçili: S{selectedCell.row + 1} K{selectedCell.col + 1}</span>}
                                            </div>
                                            <div style={{ maxHeight: '180px', overflow: 'auto', background: '#020617' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                                                    <tbody>
                                                        {selectedElement.tableData?.map((row, ri) => (
                                                            <tr key={ri}>
                                                                {row.map((cell, ci) => {
                                                                    const isActive = selectedCell?.row === ri && selectedCell?.col === ci;
                                                                    return (
                                                                        <td
                                                                            key={ci}
                                                                            style={{
                                                                                padding: '1px',
                                                                                border: isActive ? '1px solid #6366f1' : '1px solid #1e293b',
                                                                                background: isActive ? '#6366f122' : 'transparent'
                                                                            }}
                                                                            onClick={() => setSelectedCell({ row: ri, col: ci })}
                                                                        >
                                                                            <input
                                                                                style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', padding: '2px', outline: 'none' }}
                                                                                value={cell.content}
                                                                                title={cell.binding ? `Bağlı: ${cell.binding}` : 'Veri girin veya sistemden alan seçin'}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    setState(prev => ({
                                                                                        ...prev,
                                                                                        elements: prev.elements.map(el => {
                                                                                            if (el.id !== state.selectedId || !el.tableData) return el;
                                                                                            const newData = [...el.tableData];
                                                                                            newData[ri] = [...newData[ri]];
                                                                                            newData[ri][ci] = { ...newData[ri][ci], content: val };
                                                                                            return { ...el, tableData: newData };
                                                                                        })
                                                                                    }));
                                                                                }}
                                                                            />
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setState(prev => ({ ...prev, elements: prev.elements.filter(e => e.id !== state.selectedId), selectedId: null }))}
                                    style={{ marginTop: '1rem', padding: '0.5rem', background: '#450a0a', color: '#f87171', border: '1px solid #7f1d1d', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                >
                                    Nesneyi Sil
                                </button>
                            </div>
                        ) : state.selectedXsltElement ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                {/* Header Section */}
                                <div className="property-section" style={{ borderColor: isTableElement(state.selectedXsltElement.elementType) ? '#6366f1' : '#10b981', background: isTableElement(state.selectedXsltElement.elementType) ? '#6366f111' : '#10b98111' }}>
                                    <div className="property-section-header" style={{ background: isTableElement(state.selectedXsltElement.elementType) ? '#6366f122' : '#10b98122', color: isTableElement(state.selectedXsltElement.elementType) ? '#818cf8' : '#34d399' }}>
                                        <ShieldCheck size={12} /> Seçili Sabit Bileşen
                                    </div>
                                    <div className="property-section-body">
                                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                                            {state.selectedXsltElement.shapeType ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    {state.selectedXsltElement.shapeType === 'rect' ? <Square size={14} /> : state.selectedXsltElement.shapeType === 'circle' ? <Circle size={14} /> : <Minus size={14} />}
                                                    {state.selectedXsltElement.shapeType === 'rect' ? 'Dikdörtgen' : state.selectedXsltElement.shapeType === 'circle' ? 'Daire / Elips' : 'Çizgi'} Şekli
                                                </span>
                                            ) : (
                                                state.selectedXsltElement.elementType === 'table' ? 'Tablo Yapısı' :
                                                    state.selectedXsltElement.isDynamic ? `Veri Alanı: ${state.selectedXsltElement.path?.split('/').pop()}` :
                                                        'Statik Metin / Alan'
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', wordBreak: 'break-all', opacity: 0.7 }}>
                                            {state.selectedXsltElement.path || 'XSLT Elementi'}
                                        </div>

                                        {state.selectedXsltElement.elementType === 'table' && state.selectedXsltElement.tableData && (
                                            <button
                                                onClick={() => {
                                                    const current = state.selectedXsltElement!;
                                                    const updatedXslt = { ...current, styleOverrides: { ...current.styleOverrides, opacity: 0, pointerEvents: 'none' as any } };
                                                    if (iframeRef.current?.contentWindow) {
                                                        iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: current.elementId, style: updatedXslt.styleOverrides }, '*');
                                                    }
                                                    const newElement: DesignElement = {
                                                        id: Math.random().toString(36).substr(2, 9),
                                                        type: 'table',
                                                        x: current.x || 50,
                                                        y: current.y || 50,
                                                        content: '',
                                                        style: { fontSize: '12px', color: '#000000', width: current.width ? `${current.width}px` : '300px', position: 'absolute' as any },
                                                        rows: current.rowCount || 2,
                                                        cols: current.colCount || 2,
                                                        colWidths: current.colCount ? Array(current.colCount).fill(100) : [150, 150],
                                                        rowHeights: current.rowCount ? Array(current.rowCount).fill(30) : [30, 30],
                                                        tableData: current.tableData
                                                    };
                                                    setState(prev => ({ ...prev, xsltOverrides: [...prev.xsltOverrides.filter(o => o.elementId !== updatedXslt.elementId), updatedXslt], elements: [...prev.elements, newElement], selectedXsltElement: null, selectedId: newElement.id }));
                                                    setNotification({ message: 'Tablo düzenlenebilir nesneye dönüştürüldü!', type: 'success' });
                                                }}
                                                className="btn-primary"
                                                style={{ width: '100%', marginTop: '10px', fontSize: '0.7rem', padding: '6px' }}
                                            >
                                                <Sparkles size={14} /> Düzenlenebilir Yapıya Çevir
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem' }}>
                                    {/* Text Content Editor for non-image AND non-structural elements */}
                                    {state.selectedXsltElement.elementType !== 'image' &&
                                        state.selectedXsltElement.elementType !== 'table' &&
                                        state.selectedXsltElement.elementType !== 'tr' &&
                                        !state.selectedXsltElement.isDynamic && (
                                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                    <Type size={14} color="#10b981" />
                                                    <label style={{ fontSize: '0.75rem', color: 'white', fontWeight: 'bold' }}>İçerik Düzenle</label>
                                                </div>
                                                <textarea
                                                    className="input-field"
                                                    style={{ background: '#020617', border: '1px solid #10b98144', color: 'white', width: '100%', padding: '6px', minHeight: '60px', borderRadius: '4px', fontSize: '0.75rem' }}
                                                    value={state.selectedXsltElement.content || ''}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                    onChange={(e) => {
                                                        const newContent = e.target.value;
                                                        setState(prev => {
                                                            const updated = { ...prev.selectedXsltElement!, content: newContent };
                                                            const overrideIndex = prev.xsltOverrides.findIndex(o => o.elementId === updated.elementId);
                                                            const newOverrides = [...prev.xsltOverrides];
                                                            if (overrideIndex >= 0) newOverrides[overrideIndex] = updated;
                                                            else newOverrides.push(updated);

                                                            // Update live preview content
                                                            if (iframeRef.current?.contentWindow) {
                                                                iframeRef.current.contentWindow.postMessage({
                                                                    type: 'UPDATE_ELEMENT_CONTENT',
                                                                    elementId: updated.elementId,
                                                                    content: newContent
                                                                }, '*');
                                                            }

                                                            return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                        });
                                                    }}
                                                />
                                                <p style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '4px' }}>
                                                    Sabit metinleri buradan değiştirebilirsiniz.
                                                </p>
                                            </div>
                                        )}

                                    {/* XSLT Dimensions Section */}
                                    <div className="property-section">
                                        <div className="property-section-header">
                                            <Move size={12} /> Boyutlar & Konum
                                        </div>
                                        <div className="property-section-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            <div className="form-group">
                                                <label style={{ fontSize: '0.6rem', color: '#64748b' }}>Soldan (X)</label>
                                                <input type="number" className="input-field" style={{ padding: '4px' }} value={Math.round(parseInt(state.selectedXsltElement.styleOverrides.left as string) || 0)} onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 0;
                                                    setState(prev => {
                                                        const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, left: `${val}px`, position: 'absolute' as any } };
                                                        const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                        if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                        if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                        return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                    });
                                                }} />
                                            </div>
                                            <div className="form-group">
                                                <label style={{ fontSize: '0.6rem', color: '#64748b' }}>Üstten (Y)</label>
                                                <input type="number" className="input-field" style={{ padding: '4px' }} value={Math.round(parseInt(state.selectedXsltElement.styleOverrides.top as string) || 0)} onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 0;
                                                    setState(prev => {
                                                        const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, top: `${val}px`, position: 'absolute' as any } };
                                                        const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                        if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                        if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                        return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                    });
                                                }} />
                                            </div>
                                        </div>
                                    </div>


                                    <label style={{ fontSize: '0.75rem', color: 'white', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Stil Özellikleri</label>

                                    {state.selectedXsltElement.elementType === 'image' && (
                                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                                            <label style={{ fontSize: '0.65rem', color: '#64748b' }}>Resim İşlemleri</label>
                                            <button
                                                onClick={() => {
                                                    // Trigger file input for replacement
                                                    // We reuse the main file input but need a way to know we are replacing an XSLT element
                                                    // For simplicity, we can just click it and handle the logic in handleFileChange if we flag it, 
                                                    // OR we can create a specific handler here.
                                                    // Let's use a temporary flag or a separate ref.
                                                    // Actually, we can just use the existing fileInputRef and handle logic in 'onChange' if we know the context.
                                                    // BUT handleFileChange is bound to `selectedId`.
                                                    // Let's create a specialized hidden input for this or handle it manually.

                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e) => {
                                                        const file = (e.target as HTMLInputElement).files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = (evt) => {
                                                                const base64 = evt.target?.result as string;

                                                                // 1. Hide the original XSLT element
                                                                setState(prev => {
                                                                    const updated = {
                                                                        ...prev.selectedXsltElement!,
                                                                        styleOverrides: {
                                                                            ...prev.selectedXsltElement!.styleOverrides,
                                                                            opacity: 0, // Hide it
                                                                            pointerEvents: 'none' as const
                                                                        }
                                                                    };
                                                                    const overrideIndex = prev.xsltOverrides.findIndex(o => o.elementId === updated.elementId);
                                                                    const newOverrides = [...prev.xsltOverrides];
                                                                    if (overrideIndex >= 0) newOverrides[overrideIndex] = updated;
                                                                    else newOverrides.push(updated);

                                                                    // Update live preview to hide it
                                                                    if (iframeRef.current?.contentWindow) {
                                                                        iframeRef.current.contentWindow.postMessage({
                                                                            type: 'UPDATE_ELEMENT_STYLE',
                                                                            elementId: updated.elementId,
                                                                            style: updated.styleOverrides
                                                                        }, '*');
                                                                    }

                                                                    // 2. Add new image element on top
                                                                    const newEl: DesignElement = {
                                                                        id: Math.random().toString(36).substr(2, 9),
                                                                        type: 'image',
                                                                        x: updated.x || 0,
                                                                        y: updated.y || 0,
                                                                        content: base64,
                                                                        style: {
                                                                            width: updated.width ? `${updated.width}px` : '100px',
                                                                            height: updated.height ? `${updated.height}px` : '100px',
                                                                            position: 'absolute' as any
                                                                        }
                                                                    };

                                                                    return {
                                                                        ...prev,
                                                                        xsltOverrides: newOverrides,
                                                                        elements: [...prev.elements, newEl],
                                                                        selectedXsltElement: null, // Deselect XSLT
                                                                        selectedId: newEl.id // Select new element
                                                                    };
                                                                });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    };
                                                    input.click();
                                                }}
                                                style={{ width: '100%', padding: '8px', background: '#eab308', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                                            >
                                                <Upload size={14} style={{ marginRight: '4px' }} /> Resmi Değiştir (Yeni Yükle)
                                            </button>
                                            <p style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '4px' }}>
                                                Mevcut resmi gizler ve yerine yüklediğiniz resmi ekler.
                                            </p>
                                        </div>
                                    )}

                                    {state.selectedXsltElement.elementType !== 'image' && (
                                        <>
                                            <div className="property-section">
                                                <div className="property-section-header">
                                                    <Type size={12} /> Yazı Tipi
                                                </div>
                                                <div className="property-section-body">
                                                    <select
                                                        className="input-field"
                                                        style={{ width: '100%' }}
                                                        value={state.selectedXsltElement.styleOverrides.fontFamily || ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setState(prev => {
                                                                const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, fontFamily: val } };
                                                                const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                            });
                                                        }}
                                                    >
                                                        <option value="">Varsayılan</option>
                                                        <option value="Arial, sans-serif">Arial</option>
                                                        <option value="'Times New Roman', serif">Times New Roman</option>
                                                        <option value="'Courier New', monospace">Courier New</option>
                                                        <option value="Georgia, serif">Georgia</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="property-section">
                                                <div className="property-section-header">
                                                    <Type size={12} /> Stil Ayarları
                                                </div>
                                                <div className="property-section-body">
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                        <div className="form-group">
                                                            <label style={{ fontSize: '0.6rem', color: '#64748b' }}>Boyut</label>
                                                            <input type="text" className="input-field" style={{ padding: '4px' }} value={state.selectedXsltElement.styleOverrides.fontSize || '12px'} onChange={(e) => {
                                                                const val = e.target.value;
                                                                setState(prev => {
                                                                    const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, fontSize: val } };
                                                                    const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                    if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                    return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                                });
                                                            }} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label style={{ fontSize: '0.6rem', color: '#64748b' }}>Düzen</label>
                                                            <div className="toolbar-group">
                                                                <button onClick={() => {
                                                                    const isBold = state.selectedXsltElement?.styleOverrides.fontWeight === 'bold';
                                                                    setState(prev => {
                                                                        const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, fontWeight: isBold ? 'normal' : 'bold' } };
                                                                        const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                        if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                        if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                        return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                                    });
                                                                }} className={`toolbar-btn ${state.selectedXsltElement.styleOverrides.fontWeight === 'bold' ? 'active' : ''}`}><Bold size={14} /></button>
                                                                <button onClick={() => {
                                                                    const isItalicActual = state.selectedXsltElement?.styleOverrides.fontStyle === 'italic';
                                                                    setState(prev => {
                                                                        const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, fontStyle: isItalicActual ? 'normal' : 'italic' } };
                                                                        const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                        if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                        if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                        return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                                    });
                                                                }} className={`toolbar-btn ${state.selectedXsltElement.styleOverrides.fontStyle === 'italic' ? 'active' : ''}`}><Italic size={14} /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="property-section">
                                                <div className="property-section-header">
                                                    <Sparkles size={12} /> Renkler
                                                </div>
                                                <div className="property-section-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.6rem', color: '#64748b' }}>Metin</label>
                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                            <input type="color" style={{ width: '24px', height: '24px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} value={state.selectedXsltElement.styleOverrides.color as string || '#000000'} onChange={(e) => {
                                                                const val = e.target.value;
                                                                setState(prev => {
                                                                    const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, color: val } };
                                                                    const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                    if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                    return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                                });
                                                            }} />
                                                            <input type="text" className="input-field" style={{ flex: 1, padding: '2px', fontSize: '0.65rem' }} value={state.selectedXsltElement.styleOverrides.color as string || '#000000'} onChange={(e) => {
                                                                const val = e.target.value;
                                                                setState(prev => {
                                                                    const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, color: val } };
                                                                    const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                    if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                    return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                                });
                                                            }} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.6rem', color: '#64748b' }}>Zemin</label>
                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                            <input type="color" style={{ width: '24px', height: '24px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} value={state.selectedXsltElement.styleOverrides.backgroundColor === 'transparent' ? '#ffffff' : state.selectedXsltElement.styleOverrides.backgroundColor as string || '#ffffff'} onChange={(e) => {
                                                                const val = e.target.value;
                                                                setState(prev => {
                                                                    const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, backgroundColor: val } };
                                                                    const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                    if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                    return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                                });
                                                            }} />
                                                            <button onClick={() => {
                                                                setState(prev => {
                                                                    const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, backgroundColor: 'transparent' } };
                                                                    const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                    if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                    return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                                });
                                                            }} style={{ flex: 1, background: state.selectedXsltElement.styleOverrides.backgroundColor === 'transparent' ? '#6366f1' : '#1e293b', border: '1px solid #334155', color: 'white', fontSize: '0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Şeffaf</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {state.selectedXsltElement.elementType === 'table' && (
                                                <div className="property-section">
                                                    <div className="property-section-header">
                                                        <Box size={12} /> Kenarlıklar
                                                    </div>
                                                    <div className="property-section-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                        <button onClick={() => {
                                                            setState(prev => {
                                                                const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, border: '1px solid black' } };
                                                                const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                            });
                                                        }} className="btn-secondary" style={{ fontSize: '0.6rem', padding: '4px' }}>Kenarlık Ekle</button>
                                                        <button onClick={() => {
                                                            setState(prev => {
                                                                const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, border: 'none' } };
                                                                const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                            });
                                                        }} className="btn-secondary" style={{ fontSize: '0.6rem', padding: '4px' }}>Temizle</button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '1rem' }}>
                                        <button
                                            onClick={() => {
                                                if (!state.selectedXsltElement) return;
                                                const updated = { ...state.selectedXsltElement, styleOverrides: { ...state.selectedXsltElement.styleOverrides, display: 'none' } };
                                                setState(prev => {
                                                    const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                    if (!newOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: { display: 'none' } }, '*');
                                                    return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                });
                                                setNotification({ message: 'Nesne gizlendi.', type: 'success' });
                                            }}
                                            style={{ flex: 1, padding: '8px', background: '#ce2c2c22', color: '#f87171', border: '1px solid #7f1d1d', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}
                                        >
                                            Gizle
                                        </button>
                                        <button
                                            onClick={() => setState(prev => ({ ...prev, selectedXsltElement: null, xsltOverrides: prev.xsltOverrides.filter(o => o.elementId !== prev.selectedXsltElement?.elementId) }))}
                                            style={{ flex: 1, padding: '8px', background: '#334155', color: '#94a3b8', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem' }}
                                        >
                                            Sıfırla
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>
                                <Settings size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                <p style={{ fontSize: '0.875rem' }}>Lütfen düzenlemek için bir nesne veya XSLT elementi seçin.</p>
                                <p style={{ fontSize: '0.7rem', marginTop: '8px', color: '#475569' }}>Taslak üzerindeki logo, tablo veya alanlara tıklayarak stillerini değiştirebilirsiniz.</p>
                            </div>
                        )}
                    </div>
                </aside>

                <main
                    style={{ flex: 1, background: '#020617', display: 'flex', overflow: 'hidden', position: 'relative' }}
                >
                    <div
                        style={{ flex: 1, overflow: 'auto', padding: '1rem', borderRight: '1px solid #334155' }}
                        onClick={() => { setState(prev => ({ ...prev, selectedId: null })); setSelectedCell(null); }}
                    >
                        <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
                            <div
                                style={{
                                    width: '210mm', minHeight: '297mm', background: 'white', margin: '0 auto', position: 'relative',
                                    boxShadow: '0 0 20px rgba(0,0,0,0.5)', overflow: 'hidden',
                                    transform: `scale(${PREVIEW_SCALE})`, transformOrigin: 'top center',
                                    backgroundImage: 'linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)',
                                    backgroundSize: '20px 20px',
                                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                }}
                            >
                                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                                    <iframe
                                        ref={iframeRef}
                                        srcDoc={backgroundHtml}
                                        style={{ width: '100%', height: '100%', border: 'none', opacity: 1 }}
                                        title="Design Backdrop"
                                    />
                                </div>

                                <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', pointerEvents: 'none' }}>
                                    {/* Enable pointer events only for children */}
                                    {state.selectedXsltElement && state.selectedXsltElement.x !== undefined && (
                                        <DraggableElement
                                            key={state.selectedXsltElement.elementId}
                                            element={{
                                                id: state.selectedXsltElement.elementId,
                                                type: 'text', // Dummy type
                                                x: state.selectedXsltElement.x || 0,
                                                y: state.selectedXsltElement.y || 0,
                                                content: '',
                                                style: {
                                                    width: state.selectedXsltElement.width ? `${state.selectedXsltElement.width}px` : undefined,
                                                    height: state.selectedXsltElement.height ? `${state.selectedXsltElement.height}px` : undefined,
                                                }
                                            }}
                                            isSelected={true}
                                            onClick={() => { }}
                                        />
                                    )}

                                    {state.elements.map(el => (
                                        <DraggableElement
                                            key={el.id} element={el} isSelected={state.selectedId === el.id}
                                            onClick={() => { setState(prev => ({ ...prev, selectedId: el.id })); setSelectedDbField(null); }}
                                        >
                                            {el.type === 'text' && (
                                                <div style={{ ...cleanStyle(el.style), whiteSpace: el.style?.width ? 'normal' : 'nowrap', overflow: 'hidden', wordBreak: 'break-word' }}>
                                                    {el.binding ? (
                                                        <span style={{ color: '#6366f1', background: '#eef2ff', padding: '0 4px', borderRadius: '2px', border: '1px dashed #6366f1' }}>
                                                            {el.binding.split('/').pop()}
                                                        </span>
                                                    ) : el.content}
                                                </div>
                                            )}
                                            {el.type === 'formula' && (
                                                <span style={{ ...cleanStyle(el.style), fontWeight: 'bold', color: '#6366f1', background: '#eef2ff', padding: '2px', border: '1px solid #6366f1' }}>
                                                    {el.content}
                                                </span>
                                            )}
                                            {el.type === 'image' && (
                                                <img src={el.content} alt="User element" style={{ width: '100%', height: '100%', objectFit: 'contain', ...cleanStyle(el.style) }} />
                                            )}
                                            {el.type === 'shape' && (
                                                <div style={{
                                                    ...cleanStyle(el.style),
                                                    width: '100%',
                                                    border: el.shapeType === 'line' ? 'none' : (el.style?.border || '1px solid #000'),
                                                    borderRadius: el.shapeType === 'circle' ? '50%' : '0',
                                                    backgroundColor: el.shapeType === 'line' ? (el.style?.backgroundColor || '#000') : (el.style?.backgroundColor || 'transparent'),
                                                    height: el.shapeType === 'line' ? (el.style?.height || '2px') : '100%'
                                                }} />
                                            )}
                                            {el.type === 'qrcode' && (
                                                <div style={{ ...cleanStyle(el.style), width: '100%', height: '100%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(el.content || 'QR-CODE')}`}
                                                        alt="QR Code"
                                                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                    />
                                                </div>
                                            )}
                                            {el.type === 'table' && el.tableData && (
                                                <table style={{
                                                    border: '1px solid #ccc',
                                                    borderCollapse: 'collapse',
                                                    tableLayout: 'fixed',
                                                    width: el.colWidths?.reduce((a, b) => a + b, 0) || 'auto',
                                                    ...cleanStyle(el.style)
                                                }}>
                                                    <tbody>
                                                        {el.tableData.map((row, ri) => (
                                                            <tr key={ri} style={{ height: (el.rowHeights && el.rowHeights[ri]) ? `${el.rowHeights[ri]}px` : 'auto' }}>
                                                                {row.map((cell, ci) => {
                                                                    const isCellSelected = selectedCell?.row === ri && selectedCell?.col === ci;
                                                                    return (
                                                                        <td
                                                                            key={ci}
                                                                            style={{
                                                                                border: '1px solid #ccc',
                                                                                padding: '4px',
                                                                                width: (el.colWidths && el.colWidths[ci]) ? `${el.colWidths[ci]}px` : 'auto',
                                                                                overflow: 'hidden',
                                                                                wordBreak: 'break-all',
                                                                                backgroundColor: isCellSelected ? '#6366f122' : 'transparent',
                                                                                ...cleanStyle(el.style),
                                                                                ...cleanStyle(cell.style)
                                                                            }}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setSelectedCell({ row: ri, col: ci });
                                                                                setState(prev => ({ ...prev, selectedId: el.id }));
                                                                            }}
                                                                        >
                                                                            {cell.binding ? (
                                                                                <span style={{ color: '#6366f1', fontSize: '10px' }}>{cell.binding.split('/').pop()}</span>
                                                                            ) : (
                                                                                <span style={{ fontSize: '10px' }}>{cell.content}</span>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </DraggableElement>
                                    ))}
                                </div>
                            </div>
                        </DndContext>
                    </div>

                    <div style={{ flex: 1, overflow: 'auto', background: '#f1f5f9', padding: '1rem' }}>
                        <div style={{ margin: '0 auto', width: '210mm', minHeight: '297mm', background: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.1)', transform: 'scale(0.7)', transformOrigin: 'top center' }}>
                            <iframe srcDoc={previewHtml} style={{ width: '100%', height: '100%', border: 'none', minHeight: '297mm' }} title="Live Preview" />
                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
};
