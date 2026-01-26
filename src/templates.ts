export interface XSLTTemplate {
    id: string;
    name: string;
    description: string;
    category: 'Genel' | 'Modern' | 'Klasik' | 'Kurumsal';
    fileName: string;
    previewColor: string;
    thumbnail?: string;
}

export const xsltTemplates: XSLTTemplate[] = [
    {
        id: 'gib-standard',
        name: 'GİB Standart',
        description: 'Gelir İdaresi Başkanlığı resmi formatı. Resmi ve sade görünüm.',
        category: 'Klasik',
        fileName: 'Antrepo_Fatura.xslt',
        previewColor: '#64748b'
    },
    {
        id: 'modern-blue',
        name: 'Modern Safir',
        description: 'Mavi tonlarında, yuvarlatılmış hatlar ve modern tipografi içeren profesyonel tasarım.',
        category: 'Modern',
        fileName: 'Antrepo_Net.xslt',
        previewColor: '#3b82f6'
    },
    {
        id: 'corporate-gold',
        name: 'Kurumsal Altın',
        description: 'Şık ve ağırbaşlı bir görünüm için altın/turuncu detaylar içeren kurumsal tasarım.',
        category: 'Kurumsal',
        fileName: 'Antrepo_Arsiv-mikro.xslt',
        previewColor: '#f59e0b'
    },
    {
        id: 'clean-green',
        name: 'Eko Yeşil',
        description: 'Hafif ve çevreci bir görünüm sunan yeşil tonlu temiz e-arşiv tasarımı.',
        category: 'Modern',
        fileName: 'antrepo_arsiv.xslt',
        previewColor: '#10b981'
    },
    {
        id: 'minimal-dark',
        name: 'Minimal Karbon',
        description: 'Siyah ve gri tonlarında oldukça sade ve profesyonel bir tercih.',
        category: 'Klasik',
        fileName: 'Antrepo_Yolcu.xslt',
        previewColor: '#1e293b'
    },
    {
        id: 'expert-purple',
        name: 'Uzman Mor',
        description: 'Yaratıcı ve dikkat çekici, mor vurgulu modern tasarım.',
        category: 'Modern',
        fileName: 'Antrepo_Ihracat.xslt',
        previewColor: '#8b5cf6'
    }
];
