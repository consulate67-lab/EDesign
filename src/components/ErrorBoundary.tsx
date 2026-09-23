import React from 'react';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Catches uncaught React errors anywhere in the subtree and renders a fallback
 * UI instead of white-screening the whole app. Logs to console in DEV only.
 */
export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        if (import.meta.env.DEV) {
            console.error('[ErrorBoundary]', error, info.componentStack);
        }
        // Production: forward to a real error reporting service here.
    }

    reset = () => this.setState({ hasError: false, error: null });

    render(): React.ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div
                    role="alert"
                    style={{
                        padding: 32,
                        margin: 32,
                        border: '1px solid #fecaca',
                        background: '#fef2f2',
                        borderRadius: 8,
                        fontFamily: 'system-ui, sans-serif',
                    }}
                >
                    <h2 style={{ margin: '0 0 8px', color: '#991b1b' }}>
                        Beklenmeyen bir hata oluştu
                    </h2>
                    <p style={{ margin: '0 0 12px', color: '#7f1d1d' }}>
                        {this.state.error?.message ?? 'Bilinmeyen hata'}
                    </p>
                    <button
                        type="button"
                        onClick={this.reset}
                        style={{
                            padding: '8px 16px',
                            background: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                        }}
                    >
                        Tekrar Dene
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
