import React, { useEffect } from 'react';
import { useUiStore, type ToastMessage } from './uiStore';

const ICON: Record<ToastMessage['kind'], string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
};

const KIND_COLOR: Record<ToastMessage['kind'], string> = {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
};

/**
 * Toast host — render once at the app root. Subscribes to uiStore.toasts and
 * auto-dismisses each toast after its TTL (default 4000ms).
 */
export const ToastHost: React.FC = () => {
    const toasts = useUiStore((s) => s.toasts);
    const dismiss = useUiStore((s) => s.dismissToast);

    useEffect(() => {
        const timers = toasts
            .filter((t) => (t.ttl ?? 4000) > 0)
            .map((t) => window.setTimeout(() => dismiss(t.id), t.ttl ?? 4000));
        return () => { timers.forEach(clearTimeout); };
    }, [toasts, dismiss]);

    if (toasts.length === 0) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                maxWidth: 360,
            }}
            aria-live="polite"
            aria-atomic="true"
        >
            {toasts.map((t) => (
                <div
                    key={t.id}
                    role="status"
                    onClick={() => dismiss(t.id)}
                    style={{
                        background: '#fff',
                        borderLeft: `4px solid ${KIND_COLOR[t.kind]}`,
                        borderRadius: 6,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        padding: '10px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                    }}
                >
                    <span style={{ fontSize: 18 }}>{ICON[t.kind]}</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                        {t.description && (
                            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                                {t.description}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
