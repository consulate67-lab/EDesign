export interface XSLTTemplate {
    id: string;
    name: string;
    description: string;
    category: 'e-Fatura' | 'e-Arşiv' | 'e-İrsaliye' | 'Diğer';
    fileName: string;
    previewColor: string;
    thumbnail?: string;
}

export const xsltTemplates: XSLTTemplate[] = [
    // --- e-Fatura ---
    {
        id: 'efatura-gib',
        name: 'Resmi e-Fatura (GİB)',
        description: 'Gelir İdaresi Başkanlığı standartlarına uygun, resmi ve klasik fatura tasarımı.',
        category: 'e-Fatura',
        fileName: 'Classic_Corporate.xslt',
        previewColor: '#64748b'
    },
    {
        id: 'efatura-modern',
        name: 'Modern e-Fatura',
        description: 'Mavi tonlarında, yuvarlatılmış hatlar ve modern tipografi içeren profesyonel tasarım.',
        category: 'e-Fatura',
        fileName: 'Modern_1.0_Fatura.xslt',
        previewColor: '#3b82f6'
    },
    {
        id: 'efatura-gold',
        name: 'Kurumsal e-Fatura',
        description: 'Şık ve ağırbaşlı bir görünüm için özelleştirilmiş kurumsal şablon.',
        category: 'e-Fatura',
        fileName: 'Classic_Corporate.xslt',
        previewColor: '#f59e0b'
    },

    // --- e-Arşiv ---
    {
        id: 'earsiv-std',
        name: 'Standart e-Arşiv',
        description: 'e-Arşiv faturaları için klasik, yazıcı dostu format.',
        category: 'e-Arşiv',
        fileName: 'Classic_Corporate.xslt',
        previewColor: '#475569'
    },
    {
        id: 'earsiv-clean',
        name: 'Eko e-Arşiv (Yeşil)',
        description: 'Dijital gönderimler için optimize edilmiş, hafif ve çevreci e-arşiv tasarımı.',
        category: 'e-Arşiv',
        fileName: 'Modern_1.0_Fatura.xslt',
        previewColor: '#10b981'
    },
    {
        id: 'earsiv-creative',
        name: 'Yaratıcı e-Arşiv (Mor)',
        description: 'Dikkat çekici renkler kullanan modern e-Arşiv şablonu.',
        category: 'e-Arşiv',
        fileName: 'Modern_1.0_Fatura.xslt',
        previewColor: '#8b5cf6'
    },

    // --- e-İrsaliye ---
    {
        id: 'irsaliye-std',
        name: 'Standart İrsaliye (Örnek)',
        description: 'Sevkiyat süreçleri için uygun, sade irsaliye şablonu.',
        category: 'e-İrsaliye',
        fileName: 'irsaliye.xslt',
        previewColor: '#f97316'
    },

    // --- Diğer ---
    {
        id: 'smm-std',
        name: 'Serbest Meslek Makbuzu',
        description: 'Serbest meslek erbabı için uygun makbuz formatı.',
        category: 'Diğer',
        fileName: 'Classic_Corporate.xslt',
        previewColor: '#0ea5e9'
    },
    {
        id: 'blank',
        name: 'Boş Şablon',
        description: 'Sıfırdan tasarım yapmak için temiz altyapı.',
        category: 'Diğer',
        fileName: 'Modern_1.0_Fatura.xslt',
        previewColor: '#94a3b8'
    }
];
