import React, { useState } from 'react';
import { ChevronLeft, CreditCard, ShieldCheck, X } from 'lucide-react';
import { api } from './api';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newCredits: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [paymentState, setPaymentState] = useState<{ step: 'packages' | 'form', amount?: number, isPaying?: boolean }>({ step: 'packages' });

    if (!isOpen) return null;

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentState.amount) return;

        setPaymentState(prev => ({ ...prev, isPaying: true }));
        await new Promise(r => setTimeout(r, 1500)); // Simulate delay

        try {
            const res = await api.addCredits(paymentState.amount);
            if (res.success) {
                onSuccess(res.credits);
                onClose();
                setPaymentState({ step: 'packages' });
                alert('Ödeme Başarılı! Bakiyeniz güncellendi.');
            }
        } catch (err: any) {
            alert('Ödeme Hatası: ' + err.message);
            setPaymentState(prev => ({ ...prev, isPaying: false }));
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
            padding: '2rem'
        }}>
            <div style={{
                background: '#1e293b',
                padding: '3rem',
                borderRadius: '2rem',
                border: '1px solid #334155',
                maxWidth: '800px', // Enlarged as requested
                width: '100%',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                    <X size={28} />
                </button>

                {!paymentState.step || paymentState.step === 'packages' ? (
                    <>
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ width: '64px', height: '64px', background: '#10b98122', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <CreditCard size={32} color="#10b981" />
                            </div>
                            <h2 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '2rem', fontWeight: '800' }}>Tasarım Paketi Seçin</h2>
                            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Devam etmek için size uygun paketi seçerek kredi yükleyin.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                            <button onClick={() => setPaymentState({ step: 'form', amount: 2500, isPaying: false })} style={{ background: '#0f172a', border: '1px solid #334155', padding: '2rem 1.5rem', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="hover:border-indigo-500">
                                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.4rem' }}>10 Tasarım</span>
                                <span style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>2.500 ₺</span>
                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Tasarım Başı 250 ₺</span>
                            </button>
                            <button onClick={() => setPaymentState({ step: 'form', amount: 10000, isPaying: false })} style={{ background: '#1e1b4b', border: '1px solid #6366f1', padding: '2rem 1.5rem', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#6366f1', color: 'white', fontSize: '0.8rem', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>ÖNERİLEN</div>
                                <span style={{ color: '#818cf8', fontWeight: 'bold', fontSize: '1.4rem' }}>50 Tasarım</span>
                                <span style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>10.000 ₺</span>
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Tasarım Başı 200 ₺</span>
                            </button>
                            <button onClick={() => setPaymentState({ step: 'form', amount: 15000, isPaying: false })} style={{ background: '#0f172a', border: '1px solid #334155', padding: '2rem 1.5rem', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="hover:border-indigo-500">
                                <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '1.4rem' }}>100 Tasarım</span>
                                <span style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>15.000 ₺</span>
                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Tasarım Başı 150 ₺</span>
                            </button>
                        </div>

                        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', fontSize: '1rem' }}>
                            İşlemi İptal Et
                        </button>
                    </>
                ) : (
                    <>
                        <div style={{ marginBottom: '3rem', textAlign: 'left' }}>
                            <button onClick={() => setPaymentState(prev => ({ ...prev, step: 'packages' }))} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', fontSize: '1rem' }}>
                                <ChevronLeft size={20} /> Paketlere Dön
                            </button>
                            <h2 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '2rem', fontWeight: '800' }}>Ödeme Bilgileri</h2>
                            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                                <span style={{ color: '#10b981', fontWeight: 'bold' }}>{paymentState.amount?.toLocaleString('tr-TR')} ₺</span> tutarındaki ödemeniz için kart bilgilerinizi giriniz.
                            </p>
                        </div>

                        <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="form-group" style={{ textAlign: 'left' }}>
                                <label style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.6rem', display: 'block' }}>KART NUMARASI</label>
                                <input type="text" placeholder="0000 0000 0000 0000" className="input-field" required style={{ width: '100%', background: 'rgba(15, 23, 42, 0.5)', padding: '16px', fontSize: '1.1rem' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group" style={{ textAlign: 'left' }}>
                                    <label style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.6rem', display: 'block' }}>KART SAHİBİ (AD SOYAD)</label>
                                    <input type="text" placeholder="Ad Soyad" className="input-field" required style={{ width: '100%', background: 'rgba(15, 23, 42, 0.5)', padding: '16px', fontSize: '1.1rem' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group" style={{ textAlign: 'left' }}>
                                        <label style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.6rem', display: 'block' }}>SKT</label>
                                        <input type="text" placeholder="AA/YY" className="input-field" required style={{ width: '100%', background: 'rgba(15, 23, 42, 0.5)', padding: '16px', fontSize: '1.1rem' }} />
                                    </div>
                                    <div className="form-group" style={{ textAlign: 'left' }}>
                                        <label style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.6rem', display: 'block' }}>CVC</label>
                                        <input type="text" placeholder="***" className="input-field" required style={{ width: '100%', background: 'rgba(15, 23, 42, 0.5)', padding: '16px', fontSize: '1.1rem' }} />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" style={{ marginTop: '2rem', padding: '1.25rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                {paymentState.isPaying ? 'İşleniyor...' : <>🔒 Güvenli Öde ({paymentState.amount?.toLocaleString('tr-TR')} ₺)</>}
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#64748b', fontSize: '0.9rem' }}>
                                <ShieldCheck size={18} />
                                <span>256-bit SSL şifreleme ile ödemeniz güvendedir.</span>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};
