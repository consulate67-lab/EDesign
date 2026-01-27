import React, { useState, useEffect, useRef } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { ChevronLeft, Save, Type, Table as LucideTable, Sigma, Image as ImageIcon, Ruler, Layout, Settings, Upload, Move, ShieldCheck, X, Sparkles, Square, Circle, Minus, Plus, Undo, Copy, QrCode, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Box, Download, Check, Facebook, Instagram, Twitter, Linkedin, Youtube, ZoomIn, ZoomOut } from 'lucide-react';
import { DraggableElement } from './DraggableElement.tsx';
import { mergeDesignWithXslt } from './xsltMerger.ts';
import { transformXmlWithXslt } from './xsltTransformer.ts';
import { instrumentXslt, selectionScript } from './xsltInstrumenter.ts';
import { api } from './api';
import { PaymentModal } from './PaymentModal.tsx';
import type { DesignElement, DesignState, TableCell, XsltElementOverride } from './types.ts';
import { standardUBLFields } from './standardFields.ts';

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
    // New state for "Click-to-Place" functionality
    const [placingMode, setPlacingMode] = useState<{ type: DesignElement['type'], content?: string, shapeType?: 'rect' | 'circle' | 'line', clonedElement?: DesignElement, binding?: string, format?: string } | null>(null);

    // New state for "Add Field" modal
    const [showFieldModal, setShowFieldModal] = useState(false);
    const [allXmlFields, setAllXmlFields] = useState<{ path: string, name: string, value: string, isNumeric: boolean }[]>([]);

    // Zoom States
    const [designZoom, setDesignZoom] = useState(0.65); // Default zoom for Design Canvas
    const [previewZoom, setPreviewZoom] = useState(0.7); // Default zoom for Live Preview


    const saveHistory = () => {
        setHistory(prev => [...prev, JSON.parse(JSON.stringify(state))]);
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const lastState = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        setState(lastState);
        setNotification({ message: 'İşlem geri alındı.', type: 'success' });
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
    const PREVIEW_SCALE = 0.7;
    const SNAP_SIZE = 5;
    useEffect(() => {
        const loadData = async () => {
            // Load user info (credits)
            try {
                const me = await api.getMe();
                setUserInfo(me);
            } catch (error) {
                console.error('Failed to load user info', error);
            }

            try {
                // Reset state when a new template is loaded to prevent old overrides from affecting new design
                setState({
                    elements: [],
                    xsltOverrides: [],
                    companyName: 'Örnek Firma A.Ş.',
                    logoUrl: '',
                    selectedId: null,
                    selectedXsltElement: null,
                });

                let text = '';

                if (customContent) {
                    console.log('📂 Loading Custom XSLT content...');
                    text = customContent;
                } else {
                    console.log('📂 Loading XSLT template:', template);
                    // Use absolute-ish path for reliable fetching
                    const xsltRes = await fetch(`./${template.replace(/^\.\//, '')}`);

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

            } catch (err) {
                console.error("❌ Initial load error:", err);
            }
        };
        // Reset cache when template changes
        xmlCache.current = null;

        // Check for Theme Color passed via customContent
        if (moduleId === 'library' && customContent && customContent.startsWith('#')) {
            console.log('🎨 Theme Color Detected:', customContent);
            setState(prev => ({ ...prev, themeColor: customContent }));
        }

        loadData();
    }, [template, customContent, moduleId]);

    // Helper to clean styles for inner elements (removes positioning)
    const cleanStyle = (style?: React.CSSProperties): React.CSSProperties => {
        if (!style) return {};
        const { position, left, top, right, bottom, ...rest } = style as any;
        return rest;
    };

    // Map module IDs to their corresponding XML files
    const getXmlFile = (moduleId: string): string => {
        // If it's from library, we try to guess based on template filename
        if (moduleId === 'library' || moduleId === 'custom') {
            const temp = template.toLowerCase();
            if (temp.includes('arsiv') || temp.includes('mikro')) return 'e-arsiv-detail.xml';
            if (temp.includes('net') || temp.includes('ticaret')) return 'e-ticaret-detail.xml';
            if (temp.includes('ihracat')) return 'e-ihracat-detail.xml';
            if (temp.includes('fatura')) return 'e-fatura-detail.xml';
            // Default based on template naming convention if possible
            return 'e-fatura-detail.xml';
        }

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
        const fields: { path: string, name: string, value: string, isNumeric: boolean }[] = [];

        const traverse = (node: Node, path: string = '') => {
            if (node.nodeType === 1) { // Element
                const el = node as Element;
                const currentPath = path ? `${path}/${el.tagName}` : el.tagName;

                // Capture ALL leaf nodes, not just numeric ones for the "Add Field" list
                if (el.children.length === 0) {
                    const val = el.textContent?.trim() || '';
                    const isNum = val && /^[\d.,\-]+$/.test(val);

                    fields.push({
                        path: currentPath,
                        name: el.tagName,
                        value: val,
                        isNumeric: !!isNum
                    });
                } else {
                    Array.from(el.childNodes).forEach(child => traverse(child, currentPath));
                }
            }
        };

        traverse(doc.documentElement);
        // Remove duplicates based on path
        const uniqueFields = fields.filter((v, i, a) => a.findIndex(t => t.path === v.path) === i);
        return uniqueFields;
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
                const allFields = extractNumericFields(xmlText);
                setAllXmlFields(allFields);
                // Backward compatibility for the numeric dropdown
                setAvailableNumericFields(allFields.filter(f => f.isNumeric));
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

    // Updated addElement to support specific coordinates
    const addElement = (type: DesignElement['type'], initialContent: string = '', x: number = 50, y: number = 50, w?: number, h?: number) => {

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
            // If specific width provided, distribute it; otherwise default
            const defaultW = w ? w / 2 : 150;
            colWidths = [defaultW, defaultW];
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
            x: x,
            y: y,
            content: initialContent || (type === 'text' ? 'Yeni Metin' : type === 'formula' ? 'Fiyat * Adet' : type === 'image' ? '' : ''),
            shapeType: (type === 'shape') ? (initialContent as any || 'rect') : undefined,
            style: baseStyle,
            rows: type === 'table' ? 2 : undefined,
            cols: type === 'table' ? 2 : undefined,
            colWidths,
            rowHeights,
            tableData
        };
        saveHistory();
        setState(prev => ({ ...prev, elements: [...prev.elements, newElement], selectedId: newElement.id }));
        setNotification({ message: `${type === 'shape' ? 'Şekil' : 'Nesne'} başarıyla eklendi.`, type: 'success' });
        setPlacingMode(null); // Reset placing mode
    };

    const initiateAddElement = (type: DesignElement['type'], content: string = '', shapeType?: 'rect' | 'circle' | 'line') => {
        setPlacingMode({ type, content, shapeType });
        setNotification({ message: 'Eklenecek konumu seçin...', type: 'success' });
    };

    const addShape = (shapeType: 'rect' | 'circle' | 'line') => {
        initiateAddElement('shape', shapeType, shapeType);
    };

    const duplicateElement = () => {
        if (!state.selectedId && !state.selectedXsltElement) return;
        saveHistory();

        if (state.selectedId) {
            const el = state.elements.find(e => e.id === state.selectedId);
            if (el) {
                const newEl: DesignElement = {
                    ...JSON.parse(JSON.stringify(el)),
                    id: Math.random().toString(36).substr(2, 9)
                };
                // Instead of immediately adding, initiate placement
                setPlacingMode({ type: newEl.type, clonedElement: newEl });
                setNotification({ message: 'Kopyalanan nesneyi yerleştirmek için tıklayın...', type: 'success' });
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
                initiateAddElement('image', base64);
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

    const handleDownload = async () => {
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
                    message: `Tasarım başarıyla indirildi! Kalan Krediniz: ${res.credits}`,
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

    const handleLocalSave = () => {
        setNotification({ message: 'Tasarım durumu kaydedildi (Checkpoint).', type: 'success' });
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

            {/* Field Selection Modal */}
            {showFieldModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '500px', maxHeight: '80vh', background: '#1e293b', borderRadius: '16px', display: 'flex', flexDirection: 'column', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>XML Veri Alanı Ekle</h3>
                            <button onClick={() => setShowFieldModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                {(() => {
                                    const mergedFields = [
                                        ...allXmlFields,
                                        ...standardUBLFields
                                            .filter(sf => !allXmlFields.some(af => af.path === sf.path))
                                            .map(sf => ({ name: sf.name, path: sf.path, value: '(Standart Alan)', isNumeric: sf.isNumeric }))
                                    ];

                                    return mergedFields.length > 0 ? (
                                        mergedFields.map((field, idx) => (
                                            <div key={idx} style={{ background: '#0f172a', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #334155' }}>
                                                <div style={{ overflow: 'hidden' }}>
                                                    <div style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 'bold' }}>{field.name}</div>
                                                    <div style={{ color: '#64748b', fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{field.path}</div>
                                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px' }}>Örnek: <span style={{ color: '#e2e8f0' }}>{field.value}</span></div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setShowFieldModal(false);
                                                        setPlacingMode({
                                                            type: 'text',
                                                            content: `{${field.name}}`, // Show simplified binding name in UI
                                                            binding: field.path, // Store full path
                                                            format: field.isNumeric ? 'number' : undefined // Default format if numeric
                                                        });
                                                        setNotification({ message: 'Alanı yerleştirmek için tıklayın...', type: 'success' });
                                                    }}
                                                    style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                                                >
                                                    Ekle
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>Yüklü XML bulunamadı veya ayrıştırılamadı.</div>
                                    )
                                })()}
                            </div>
                        </div>

                        {/* Numeric Formatting Options */}
                        {selectedElement && selectedElement.binding && (selectedElement.format || allXmlFields.find(f => f.path === selectedElement.binding)?.isNumeric) && (
                            <div className="property-section" style={{ marginTop: '1rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '12px', padding: '10px' }}>
                                <label style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Sayısal Biçimlendirme</label>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>Format Türü</label>
                                        <select
                                            className="input-field"
                                            style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '4px', fontSize: '0.75rem', borderRadius: '4px' }}
                                            value={selectedElement.format || 'number'}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setState(prev => ({
                                                    ...prev,
                                                    elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, format: val } : el)
                                                }));
                                            }}
                                        >
                                            <option value="number">Standart Sayı (1.234,56)</option>
                                            <option value="currency">Para Birimi (₺1.234,56)</option>
                                            <option value="percentage">Yüzde (%12)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>Ondalık Basamak</label>
                                        <input
                                            type="number" min="0" max="4"
                                            className="input-field"
                                            style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '4px', fontSize: '0.75rem', borderRadius: '4px' }}
                                            value={selectedElement.decimals !== undefined ? selectedElement.decimals : 2}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setState(prev => ({
                                                    ...prev,
                                                    elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, decimals: val } : el)
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />

            <header style={{
                height: '72px', background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', padding: '0 1.5rem', zIndex: 10, gap: '1rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                    <button onClick={onBack} title="Geri Dön" style={{ width: '44px', height: '44px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ChevronLeft size={22} />
                    </button>
                    <div style={{ width: '1px', height: '28px', background: '#334155', flexShrink: 0 }}></div>

                    <button
                        onClick={handleUndo}
                        disabled={history.length === 0}
                        title="Son İşlemi Geri Al"
                        style={{
                            height: '44px', padding: '0 1.25rem', fontSize: '0.85rem',
                            background: history.length > 0 ? 'rgba(129, 140, 248, 0.1)' : 'rgba(30, 41, 59, 0.2)',
                            border: '1px solid',
                            borderColor: history.length > 0 ? 'rgba(129, 140, 248, 0.3)' : 'rgba(255,255,255,0.05)',
                            color: history.length > 0 ? '#a5b4fc' : '#475569', borderRadius: '12px',
                            cursor: history.length > 0 ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                            fontWeight: '600'
                        }}
                    >
                        <Undo size={18} /> Geri Al
                    </button>

                    <button onClick={handleLocalSave} style={{
                        height: '44px', padding: '0 1.25rem', background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(255,255,255,0.1)', color: 'white',
                        borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex',
                        alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                        <Save size={18} /> Kaydet
                    </button>

                    <button onClick={handleDownload} style={{
                        height: '44px', padding: '0 1.5rem', fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: 'white', border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 8px 20px -6px rgba(99, 102, 241, 0.6)', whiteSpace: 'nowrap',
                        cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s'
                    }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <Download size={20} /> XSLT İndir
                    </button>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
                    <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '100%', overflow: 'hidden' }}>
                        <Layout size={20} color="#818cf8" />
                        <span style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{docName}</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>{template}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0, paddingRight: '0.5rem' }}>

                </div>
            </header>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <aside style={{
                    width: '300px',
                    background: '#0f172a',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 5,
                    boxShadow: '10px 0 30px rgba(0,0,0,0.2)'
                }}>
                    {/* User Profile & Credits Section */}
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, transparent 100%)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)' }}>
                                <Settings size={18} />
                            </div>
                            <div>
                                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>Hesap Yönetimi</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>Tasarım Editörü</div>
                            </div>
                        </div>
                        {userInfo && (
                            <div
                                onClick={() => setShowPaymentModal(true)}
                                style={{
                                    background: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: '8px',
                                    border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <ShieldCheck size={14} color="#10b981" />
                                    <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '600' }}>Kredi</span>
                                </div>
                                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.85rem' }}>{userInfo.credits}</span>
                            </div>
                        )}
                    </div>
                    <div style={{ padding: '1.5rem', background: 'rgba(30, 41, 59, 0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ fontSize: '0.6rem', color: '#6366f1', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                            <Box size={14} /> NESNE KÜTÜPHANESİ
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
                            <button
                                onClick={() => setShowFieldModal(true)}
                                style={{ gridColumn: 'span 4', height: '36px', background: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <Sparkles size={16} /> XML Veri Alanı Ekle
                            </button>
                            {[
                                { id: 'text', icon: <Type size={20} />, label: 'Metin', action: () => initiateAddElement('text', 'Yeni Metin') },
                                { id: 'table', icon: <LucideTable size={20} />, label: 'Tablo', action: () => initiateAddElement('table') },
                                { id: 'formula', icon: <Sigma size={20} />, label: 'Formül', action: () => initiateAddElement('formula', 'Fiyat * Adet') },
                                { id: 'qrcode', icon: <QrCode size={20} />, label: 'QR', action: () => initiateAddElement('qrcode', 'QR-CODE') },
                                { id: 'image', icon: <ImageIcon size={20} />, label: 'Resim', action: () => fileInputRef.current?.click() }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={item.action}
                                    title={item.label}
                                    style={{
                                        height: '44px', background: 'rgba(30, 41, 59, 0.5)',
                                        border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8',
                                        borderRadius: '12px', cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = '#6366f1';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                                        e.currentTarget.style.color = '#94a3b8';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {item.icon}
                                </button>
                            ))}
                        </div>

                        <label style={{ fontSize: '0.6rem', color: '#6366f1', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                            ŞEKİLLER
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {[
                                { id: 'rect', icon: <Square size={18} />, action: () => addShape('rect') },
                                { id: 'circle', icon: <Circle size={18} />, action: () => addShape('circle') },
                                { id: 'line', icon: <Minus size={18} />, action: () => addShape('line') }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={item.action}
                                    style={{
                                        flex: 1, height: '36px', background: 'rgba(30, 41, 59, 0.5)',
                                        border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8',
                                        borderRadius: '10px', cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = '#6366f1';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.color = '#94a3b8';
                                    }}
                                >
                                    {item.icon}
                                </button>
                            ))}
                        </div>

                        <label style={{ fontSize: '0.6rem', color: '#6366f1', marginTop: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                            SOSYAL MEDYA
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                            {[
                                { id: 'instagram', icon: <Instagram size={20} color="#E1306C" />, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E1306C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>` },
                                { id: 'facebook', icon: <Facebook size={20} color="#1877F2" />, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>` },
                                { id: 'twitter', icon: <Twitter size={20} color="#ffffff" />, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>` },
                                { id: 'linkedin', icon: <Linkedin size={20} color="#0A66C2" />, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>` },
                                { id: 'youtube', icon: <Youtube size={20} color="#FF0000" />, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>` }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        initiateAddElement('image', `data:image/svg+xml;base64,${btoa(item.svg)}`);
                                    }}
                                    style={{
                                        width: '100%', height: '36px', background: 'rgba(30, 41, 59, 0.5)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '10px', cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = '#6366f1';
                                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                                    }}
                                >
                                    {item.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '24px', height: '24px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sigma size={14} color="#818cf8" />
                                </div>
                                <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Özellikler</span>
                            </div>
                            {(state.selectedId || state.selectedXsltElement) && (
                                <button
                                    onClick={duplicateElement}
                                    title="Kopyala"
                                    style={{
                                        background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
                                        color: '#10b981', borderRadius: '8px', padding: '4px 10px',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                        fontSize: '0.65rem', fontWeight: 'bold', transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
                                >
                                    <Copy size={12} /> Kopyala
                                </button>
                            )}
                        </div>

                        {state.selectedId ? (
                            <div style={{ padding: '10px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                <span style={{ fontSize: '0.6rem', color: '#818cf8', fontWeight: 'bold', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Seçili Bileşen</span>
                                <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 'bold' }}>{state.elements.find(e => e.id === state.selectedId)?.type.toUpperCase()}</span>
                            </div>
                        ) : state.selectedXsltElement ? (
                            <div style={{
                                padding: '10px',
                                background: state.selectedXsltElement.isDynamic ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                borderRadius: '12px',
                                border: `1px solid ${state.selectedXsltElement.isDynamic ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`
                            }}>
                                <span style={{ fontSize: '0.6rem', color: state.selectedXsltElement.isDynamic ? '#34d399' : '#818cf8', fontWeight: 'bold', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                                    {state.selectedXsltElement.isDynamic ? 'Veri Alanı (XPATH)' : 'Sabit Bileşen'}
                                </span>
                                <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 'bold', wordBreak: 'break-all' }}>
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

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>
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
                                    <>
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

                                        <div className="form-group" style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155', marginTop: '1rem' }}>
                                            <label style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Sparkles size={14} /> GÖRSEL EFEKTLERİ
                                            </label>

                                            {/* Opacity Control */}
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                    <label style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>Şeffaflık</label>
                                                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>%{Math.round((parseFloat(String(selectedElement.style?.opacity ?? '1'))) * 100)}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white', opacity: 0.2 }}></div>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="1"
                                                        step="0.01"
                                                        style={{ flex: 1, height: '4px', accentColor: '#6366f1', cursor: 'pointer' }}
                                                        value={selectedElement.style?.opacity ?? '1'}
                                                        onChange={(e) => {
                                                            const opacity = e.target.value;
                                                            setState(prev => ({
                                                                ...prev,
                                                                elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, opacity } } : el)
                                                            }));
                                                        }}
                                                    />
                                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white' }}></div>
                                                </div>
                                            </div>

                                            {/* Border Radius Control */}
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                    <label style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>Köşe Yuvarlama</label>
                                                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>{parseInt(String(selectedElement.style?.borderRadius || '0')) || 0}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    style={{ width: '100%', height: '4px', accentColor: '#6366f1', cursor: 'pointer' }}
                                                    value={parseInt(String(selectedElement.style?.borderRadius || '0'))}
                                                    onChange={(e) => {
                                                        const borderRadius = `${e.target.value}px`;
                                                        setState(prev => ({
                                                            ...prev,
                                                            elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, borderRadius } } : el)
                                                        }));
                                                    }}
                                                />
                                            </div>

                                            {/* Shadow Control (Checkbox) */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                                                onClick={() => {
                                                    const currentShadow = selectedElement.style?.boxShadow && selectedElement.style.boxShadow !== 'none';
                                                    const boxShadow = !currentShadow ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' : 'none';
                                                    setState(prev => ({
                                                        ...prev,
                                                        elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, boxShadow } } : el)
                                                    }));
                                                }}
                                            >
                                                <div style={{
                                                    width: '16px', height: '16px', borderRadius: '4px',
                                                    border: '1px solid #475569',
                                                    background: selectedElement.style?.boxShadow && selectedElement.style?.boxShadow !== 'none' ? '#6366f1' : 'transparent',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                                }}>
                                                    {selectedElement.style?.boxShadow && selectedElement.style?.boxShadow !== 'none' && <Check size={10} color="white" />}
                                                </div>
                                                <label style={{ fontSize: '0.7rem', color: '#cbd5e1', cursor: 'pointer', userSelect: 'none' }}>Gölge Ekle</label>
                                            </div>

                                            {/* Grayscale Control (Checkbox) */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                                                onClick={() => {
                                                    const currentFilter = selectedElement.style?.filter;
                                                    const isGrayscale = currentFilter && currentFilter.includes('grayscale(100%)');
                                                    const filter = isGrayscale ? 'none' : 'grayscale(100%)';
                                                    setState(prev => ({
                                                        ...prev,
                                                        elements: prev.elements.map(el => el.id === state.selectedId ? { ...el, style: { ...el.style, filter } } : el)
                                                    }));
                                                }}
                                            >
                                                <div style={{
                                                    width: '16px', height: '16px', borderRadius: '4px',
                                                    border: '1px solid #475569',
                                                    background: selectedElement.style?.filter && selectedElement.style.filter.includes('grayscale(100%)') ? '#6366f1' : 'transparent',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                                }}>
                                                    {selectedElement.style?.filter && selectedElement.style.filter.includes('grayscale(100%)') && <Check size={10} color="white" />}
                                                </div>
                                                <label style={{ fontSize: '0.7rem', color: '#cbd5e1', cursor: 'pointer', userSelect: 'none' }}>Siyah/Beyaz Yap</label>
                                            </div>
                                        </div>
                                    </>
                                ) : (<>
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
                                </>)}

                                <div className="dimensions-panel" style={{ borderTop: '1px solid #334155', paddingTop: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <Move size={16} color="#6366f1" />
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
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setSelectedCell({ row: ri, col: ci });
                                                                                setState(prev => ({ ...prev, selectedId: selectedElement.id }));
                                                                            }}
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
                                                        style: {
                                                            fontSize: '12px',
                                                            color: '#000000',
                                                            width: current.width ? `${current.width}px` : '100%',
                                                            position: 'absolute' as any
                                                        },
                                                        rows: current.rowCount || 2,
                                                        cols: current.colCount || 2,
                                                        colWidths: current.colCount
                                                            ? Array(current.colCount).fill((current.width ? current.width / current.colCount : 150))
                                                            : [150, 150],
                                                        rowHeights: current.rowCount
                                                            ? Array(current.rowCount).fill((current.height ? current.height / current.rowCount : 30))
                                                            : [30, 30],
                                                        tableData: current.tableData || Array(current.rowCount || 2).fill(Array(current.colCount || 2).fill({ content: '' }))
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
                                </div>

                                {/* XSLT Dimensions Section */}
                                <div className="property-section" style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <div className="property-section-header" style={{ padding: '0.6rem 1rem', background: 'rgba(30, 41, 59, 0.4)', fontSize: '0.65rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        <Move size={14} /> KONUM VE BOYUT
                                    </div>
                                    <div className="property-section-body" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>SOL (X)</label>
                                            <input type="number" className="input-field" style={{ width: '100%', height: '32px', borderRadius: '8px' }} value={Math.round(parseInt(state.selectedXsltElement.styleOverrides.left as string) || 0)}
                                                onMouseDown={() => saveHistory()}
                                                onChange={(e) => {
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
                                            <label style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>ÜST (Y)</label>
                                            <input type="number" className="input-field" style={{ width: '100%', height: '32px', borderRadius: '8px' }} value={Math.round(parseInt(state.selectedXsltElement.styleOverrides.top as string) || 0)}
                                                onMouseDown={() => saveHistory()}
                                                onChange={(e) => {
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



                                {(state.selectedXsltElement.elementType === 'image' || state.selectedXsltElement.elementType === 'img') && (
                                    <div className="property-section" style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
                                        <div className="property-section-header" style={{ padding: '0.6rem 1rem', background: 'rgba(30, 41, 59, 0.4)', fontSize: '0.65rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            <Sparkles size={14} /> GÖRSEL EFEKTLERİ
                                        </div>
                                        <div className="property-section-body" style={{ padding: '1rem' }}>
                                            {/* Opacity Control */}
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                    <label style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>Şeffaflık</label>
                                                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>%{Math.round((parseFloat(state.selectedXsltElement.styleOverrides.opacity as string || '1')) * 100)}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white', opacity: 0.2 }}></div>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="1"
                                                        step="0.01"
                                                        style={{ flex: 1, height: '4px', accentColor: '#6366f1', cursor: 'pointer' }}
                                                        value={state.selectedXsltElement.styleOverrides.opacity !== undefined ? state.selectedXsltElement.styleOverrides.opacity : '1'}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setState(prev => {
                                                                const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, opacity: val } };
                                                                const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                            });
                                                        }}
                                                    />
                                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white' }}></div>
                                                </div>
                                            </div>

                                            {/* Border Radius Control */}
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                    <label style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>Köşe Yuvarlama</label>
                                                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>{parseInt(state.selectedXsltElement.styleOverrides.borderRadius as string || '0')}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    style={{ width: '100%', height: '4px', accentColor: '#6366f1', cursor: 'pointer' }}
                                                    value={parseInt(state.selectedXsltElement.styleOverrides.borderRadius as string || '0')}
                                                    onChange={(e) => {
                                                        const val = `${e.target.value}px`;
                                                        setState(prev => {
                                                            const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, borderRadius: val } };
                                                            const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                            if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                            if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                            return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                        });
                                                    }}
                                                />
                                            </div>

                                            {/* Shadow Control (Checkbox) */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                                                onClick={() => {
                                                    const currentShadow = state.selectedXsltElement?.styleOverrides.boxShadow && state.selectedXsltElement.styleOverrides.boxShadow !== 'none';
                                                    const val = !currentShadow ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' : 'none';
                                                    setState(prev => {
                                                        const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, boxShadow: val } };
                                                        const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                        if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                        if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                        return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                    });
                                                }}
                                            >
                                                <div style={{
                                                    width: '16px', height: '16px', borderRadius: '4px',
                                                    border: '1px solid #475569',
                                                    background: state.selectedXsltElement?.styleOverrides.boxShadow && state.selectedXsltElement.styleOverrides.boxShadow !== 'none' ? '#6366f1' : 'transparent',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                                }}>
                                                    {state.selectedXsltElement?.styleOverrides.boxShadow && state.selectedXsltElement.styleOverrides.boxShadow !== 'none' && <Check size={10} color="white" />}
                                                </div>
                                                <label style={{ fontSize: '0.7rem', color: '#cbd5e1', cursor: 'pointer', userSelect: 'none' }}>Gölge Ekle</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {state.selectedXsltElement.elementType !== 'image' && state.selectedXsltElement.elementType !== 'img' && (
                                    <>
                                        <div className="property-section" style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
                                            <div className="property-section-header" style={{ padding: '0.6rem 1rem', background: 'rgba(30, 41, 59, 0.4)', fontSize: '0.65rem', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                <Type size={14} /> METİN STİLİ
                                            </div>
                                            <div className="property-section-body" style={{ padding: '1rem' }}>
                                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                                    <label style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', marginBottom: '6px', display: 'block', letterSpacing: '0.5px' }}>Yazı Tipi</label>
                                                    <select
                                                        className="input-field"
                                                        style={{ width: '100%', height: '38px', borderRadius: '10px', fontSize: '0.8rem' }}
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

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', marginBottom: '6px', display: 'block', letterSpacing: '0.5px' }}>Boyut</label>
                                                        <input type="text" className="input-field"
                                                            style={{ width: '100%', height: '36px', borderRadius: '8px', fontSize: '0.8rem', textAlign: 'center' }}
                                                            value={state.selectedXsltElement.styleOverrides.fontSize || '12px'}
                                                            onMouseDown={() => saveHistory()}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setState(prev => {
                                                                    const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, fontSize: val } };
                                                                    const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                    if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                    return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', marginBottom: '6px', display: 'block', letterSpacing: '0.5px' }}>Format</label>
                                                        <div className="toolbar-group" style={{ height: '36px', borderRadius: '8px', padding: '2px' }}>
                                                            <button onClick={() => {
                                                                const isBold = state.selectedXsltElement?.styleOverrides.fontWeight === 'bold';
                                                                saveHistory();
                                                                setState(prev => {
                                                                    const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, fontWeight: isBold ? 'normal' : 'bold' } };
                                                                    const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                    if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                    return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                                });
                                                            }} className={`toolbar-btn ${state.selectedXsltElement.styleOverrides.fontWeight === 'bold' ? 'active' : ''}`} style={{ borderRadius: '6px' }}><Bold size={14} /></button>
                                                            <button onClick={() => {
                                                                const isItalic = state.selectedXsltElement?.styleOverrides.fontStyle === 'italic';
                                                                saveHistory();
                                                                setState(prev => {
                                                                    const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, fontStyle: isItalic ? 'normal' : 'italic' } };
                                                                    const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                    if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                    return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                                });
                                                            }} className={`toolbar-btn ${state.selectedXsltElement.styleOverrides.fontStyle === 'italic' ? 'active' : ''}`} style={{ borderRadius: '6px' }}><Italic size={14} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="property-section" style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
                                            <div className="property-section-header" style={{ padding: '0.6rem 1rem', background: 'rgba(30, 41, 59, 0.4)', fontSize: '0.65rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                <Sparkles size={14} /> RENK VE GÖRÜNÜM
                                            </div>
                                            <div className="property-section-body" style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1rem' }}>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px', display: 'block' }}>Metin Rengi</label>
                                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                            <input type="color" style={{ width: '42px', height: '36px', padding: '2px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', cursor: 'pointer' }} value={state.selectedXsltElement.styleOverrides.color as string || '#000000'}
                                                                onMouseDown={() => saveHistory()}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setState(prev => {
                                                                        const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, color: val } };
                                                                        const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                        if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                        if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                        return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                                    });
                                                                }} />
                                                            <input type="text" className="input-field" style={{ flex: 1, height: '36px', fontSize: '0.75rem', textAlign: 'center', fontFamily: 'monospace' }} value={state.selectedXsltElement.styleOverrides.color as string || '#000000'}
                                                                onMouseDown={() => saveHistory()}
                                                                onChange={(e) => {
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
                                                        <label style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px', display: 'block' }}>Zemin Rengi</label>
                                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                            <input type="color" style={{ width: '42px', height: '36px', padding: '2px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', cursor: 'pointer' }} value={state.selectedXsltElement.styleOverrides.backgroundColor === 'transparent' ? '#ffffff' : state.selectedXsltElement.styleOverrides.backgroundColor as string || '#ffffff'}
                                                                onMouseDown={() => saveHistory()}
                                                                onChange={(e) => {
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
                                                                saveHistory();
                                                                setState(prev => {
                                                                    const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, backgroundColor: 'transparent' } };
                                                                    const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                                    if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                                    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                                    return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                                });
                                                            }} style={{ height: '36px', flex: 1, background: state.selectedXsltElement.styleOverrides.backgroundColor === 'transparent' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.5)', border: '1px solid', borderColor: state.selectedXsltElement.styleOverrides.backgroundColor === 'transparent' ? '#6366f1' : 'rgba(255,255,255,0.1)', color: state.selectedXsltElement.styleOverrides.backgroundColor === 'transparent' ? '#a5b4fc' : 'white', fontSize: '0.7rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>Şeffaf</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {state.selectedXsltElement.elementType === 'table' && (
                                            <div className="property-section" style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
                                                <div className="property-section-header" style={{ padding: '0.6rem 1rem', background: 'rgba(30, 41, 59, 0.4)', fontSize: '0.65rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    <Box size={14} /> KENARLIKLAR
                                                </div>
                                                <div className="property-section-body" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                    <button onClick={() => {
                                                        setState(prev => {
                                                            const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, border: '1px solid black' } };
                                                            const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                            if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                            if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                            return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                        });
                                                    }} style={{ height: '36px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', fontSize: '0.7rem', cursor: 'pointer' }}>Ekle</button>
                                                    <button onClick={() => {
                                                        setState(prev => {
                                                            const updated = { ...prev.selectedXsltElement!, styleOverrides: { ...prev.selectedXsltElement!.styleOverrides, border: 'none' } };
                                                            const newOverrides = prev.xsltOverrides.map(o => o.elementId === updated.elementId ? updated : o);
                                                            if (!prev.xsltOverrides.find(o => o.elementId === updated.elementId)) newOverrides.push(updated);
                                                            if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT_STYLE', elementId: updated.elementId, style: updated.styleOverrides }, '*');
                                                            return { ...prev, selectedXsltElement: updated, xsltOverrides: newOverrides };
                                                        });
                                                    }} style={{ height: '36px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#f87171', borderRadius: '8px', fontSize: '0.7rem', cursor: 'pointer' }}>Kaldır</button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '1rem' }}>
                                    <button
                                        onClick={() => {
                                            if (!state.selectedXsltElement) return;
                                            saveHistory();
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
                                        onClick={() => {
                                            saveHistory();
                                            setState(prev => ({ ...prev, selectedXsltElement: null, xsltOverrides: prev.xsltOverrides.filter(o => o.elementId !== prev.selectedXsltElement?.elementId) }));
                                        }}
                                        style={{ flex: 1, padding: '8px', background: '#334155', color: '#94a3b8', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem' }}
                                    >
                                        Sıfırla
                                    </button>
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
                                    transform: `scale(${designZoom})`, transformOrigin: 'top center',
                                    backgroundImage: 'linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)',
                                    backgroundSize: '20px 20px',
                                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                                    cursor: placingMode ? 'pointer' : (state.selectedId ? 'move' : 'default')
                                }}
                                onClick={(e) => {
                                    // If placingMode is NOT active, we handle click-to-move here. 
                                    // If placingMode IS active, the overlay (below) will handle it to ensure we capture clicks over iframe.
                                    if (!placingMode && state.selectedId) {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const clickX = (e.clientX - rect.left) / PREVIEW_SCALE;
                                        const clickY = (e.clientY - rect.top) / PREVIEW_SCALE;
                                        const snapX = Math.round(clickX / SNAP_SIZE) * SNAP_SIZE;
                                        const snapY = Math.round(clickY / SNAP_SIZE) * SNAP_SIZE;

                                        setState(prev => ({
                                            ...prev,
                                            elements: prev.elements.map(el => {
                                                if (el.id === state.selectedId) {
                                                    const width = parseInt(el.style?.width as string) || 100;
                                                    const height = parseInt(el.style?.height as string) || 30;
                                                    return { ...el, x: snapX - (width / 2), y: snapY - (height / 2) };
                                                }
                                                return el;
                                            })
                                        }));
                                    }
                                }}
                            >
                                {/* Overlay for Placing Mode to ensure clicks are captured over Iframe */}
                                {placingMode && (
                                    <div
                                        style={{
                                            position: 'absolute', inset: 0, zIndex: 100, cursor: 'pointer', // Hand cursor
                                            background: 'rgba(99, 102, 241, 0.1)' // Slight tint to indicate active mode
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const clickX = (e.clientX - rect.left) / PREVIEW_SCALE;
                                            const clickY = (e.clientY - rect.top) / PREVIEW_SCALE;
                                            const snapX = Math.round(clickX / SNAP_SIZE) * SNAP_SIZE;
                                            const snapY = Math.round(clickY / SNAP_SIZE) * SNAP_SIZE;

                                            if (placingMode.clonedElement) {
                                                const placedEl = { ...placingMode.clonedElement, x: snapX, y: snapY };
                                                setState(prev => ({ ...prev, elements: [...prev.elements, placedEl], selectedId: placedEl.id }));
                                                setNotification({ message: 'Kopya yerleştirildi.', type: 'success' });
                                                setPlacingMode(null);
                                            } else if (placingMode.type === 'shape' && placingMode.shapeType) {
                                                addElement('shape', placingMode.shapeType, snapX, snapY);
                                            } else {
                                                // Handle binding and format if present (from XML field adder)
                                                const { type, content, binding, format } = placingMode;
                                                const newEl: DesignElement = {
                                                    id: Math.random().toString(36).substr(2, 9),
                                                    type: type,
                                                    x: snapX,
                                                    y: snapY,
                                                    content: content || 'Yeni Metin',
                                                    style: { fontSize: '12px', color: '#000000', position: 'absolute' as any },
                                                    binding: binding,
                                                    format: format
                                                };
                                                setState(prev => ({ ...prev, elements: [...prev.elements, newEl], selectedId: newEl.id }));
                                                setNotification({ message: 'Alan başarıyla eklendi.', type: 'success' });
                                                setPlacingMode(null);
                                            }
                                            return;
                                        }}
                                    />
                                )}
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
                                            scale={PREVIEW_SCALE}
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
                                            scale={PREVIEW_SCALE}
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

                        {/* Design Canvas Zoom Controls */}
                        <div style={{
                            position: 'absolute', bottom: '20px', left: '20px',
                            background: '#1e293b', padding: '6px', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            zIndex: 100
                        }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); setDesignZoom(z => Math.max(0.2, z - 0.1)); }}
                                style={{
                                    background: '#334155', border: 'none', color: 'white',
                                    width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Minus size={16} />
                            </button>
                            <span style={{ color: 'white', fontSize: '0.8rem', minWidth: '36px', textAlign: 'center', userSelect: 'none' }}>
                                {Math.round(designZoom * 100)}%
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); setDesignZoom(z => Math.min(2.0, z + 0.1)); }}
                                style={{
                                    background: '#334155', border: 'none', color: 'white',
                                    width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflow: 'auto', background: '#f1f5f9', padding: '1rem', position: 'relative' }}>
                        <div style={{ margin: '0 auto', width: '210mm', minHeight: '297mm', background: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.1)', transform: `scale(${previewZoom})`, transformOrigin: 'top center' }}>
                            <iframe srcDoc={previewHtml} style={{ width: '100%', height: '100%', border: 'none', minHeight: '297mm' }} title="Live Preview" />
                        </div>

                        {/* Live Preview Zoom Controls */}
                        <div style={{
                            position: 'absolute', bottom: '20px', right: '20px',
                            background: '#1e293b', padding: '6px', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            zIndex: 100
                        }}>
                            <button
                                onClick={() => setPreviewZoom(z => Math.max(0.2, z - 0.1))}
                                style={{
                                    background: '#334155', border: 'none', color: 'white',
                                    width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Minus size={16} />
                            </button>
                            <span style={{ color: 'white', fontSize: '0.8rem', minWidth: '36px', textAlign: 'center', userSelect: 'none' }}>
                                {Math.round(previewZoom * 100)}%
                            </span>
                            <button
                                onClick={() => setPreviewZoom(z => Math.min(2.0, z + 0.1))}
                                style={{
                                    background: '#334155', border: 'none', color: 'white',
                                    width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
};
