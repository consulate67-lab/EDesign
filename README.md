# eBelge Tasarımcı (EDesign)

Görsel e-belge tasarım platformu. XSLT tabanlı şablonları sürükle-bırak ile düzenleyip
UBL 2.1 formatında dışa aktaran React + TypeScript uygulaması.

## Stack

| Katman | Teknoloji |
|---|---|
| Frontend | React 19 + Vite 7 + TypeScript 5.9 (strict mode) |
| UI | Custom CSS + lucide-react icons + dnd-kit drag-drop |
| Backend | Express 5 + better-sqlite3 + JWT auth |
| Veri | SQLite (development), PostgreSQL (production plan) |
| Deploy | GitHub Pages (static) + Node server (API) |

## Komutlar

```bash
npm install              # Bağımlılıkları kur
npm run dev              # Vite dev server (localhost:5173)
npm run build            # Type-check + Vite build (dist/)
npm run preview          # Build'i lokal sun (localhost:4173/EDesign/)
npm run lint             # ESLint çalıştır
npm run deploy           # GitHub Pages'e push (gh-pages branch)

# Server (Express + SQLite)
node server/index.js     # API server (localhost:3002)
```

## Ortam Değişkenleri

`.env.example` dosyasını `.env` olarak kopyala ve doldur. Üretim için
`JWT_SECRET` zorunlu.

| Değişken | Varsayılan | Açıklama |
|---|---|---|
| `JWT_SECRET` | dev fallback | JWT imzalama anahtarı. Üretimde zorunlu. |
| `ALLOWED_ORIGINS` | `http://localhost:5173,...` | CORS izinli origin listesi (virgülle ayrılmış). |
| `PORT` | `3002` | Express server portu. |
| `NODE_ENV` | `development` | `production` ise güvensiz fallback'ler devre dışı kalır. |

## Proje Yapısı

```
D:\EIslemler
├── index.html                  # HTML entry (lang="tr")
├── vite.config.ts              # Vite config (base='/EDesign/')
├── tsconfig.*.json             # TypeScript strict mode
├── eslint.config.js            # ESLint flat config
├── .env.example                # Ortam değişkenleri şablonu
├── public/                     # Statik asset'ler + XSLT örnekleri
│   ├── *.xslt                  # Hazır tasarım şablonları
│   └── *-detail.xml            # Örnek UBL fatura verileri
├── server/                     # Express backend
│   ├── index.js                # Auth + kredi API'leri
│   ├── db.js                   # SQLite şema + migration
│   └── database.sqlite         # Geliştirme DB'si (gitignore hedefi)
├── src/
│   ├── main.tsx                # React entry
│   ├── App.tsx                 # View router (auth → selection → designer)
│   ├── Auth.tsx                # Login/register ekranı
│   ├── Selection.tsx           # Modül seçim ekranı
│   ├── TemplateGallery.tsx     # Şablon kütüphanesi + admin onayı
│   ├── PaymentModal.tsx        # Kredi paketi satın alma
│   ├── ProfessionalDesigner.tsx # Ana tasarım arayüzü (XSLT editörü)
│   ├── DraggableElement.tsx    # Sürüklenebilir element wrapper'ı
│   ├── api.ts                  # API client (DEV/PROD mock gating)
│   ├── types.ts                # TypeScript tip tanımları
│   ├── templates.ts            # Statik şablon kataloğu
│   ├── standardFields.ts       # UBL field kataloğu (TR)
│   ├── formulaEvaluator.ts     # Tasarım içi formül motoru
│   ├── xsltGenerator.ts        # Boş XSLT şablon üretici
│   ├── xsltInstrumenter.ts     # Editör için XSLT annotation
│   ├── xsltMerger.ts           # Tasarım + XSLT birleştirici
│   └── xsltTransformer.ts      # XML + XSLT → HTML dönüştürücü
└── .trash-2026-09-23/          # Trash: çıkarılan dead code
    ├── Designer2.tsx           # Eski tasarımcı prototipi
    └── TemplateEditor.tsx      # Eski editör prototipi
```

## Mimari Notlar

- **Mock Auth (DEV-only):** Tüm client-side mock verileri `import.meta.env.DEV`
  guard'ı arkasında. Üretim build'inde backend zorunlu.
- **Token Storage:** Auth token'ı `sessionStorage`'da (tab kapanınca silinir).
- **XSLT Editörü:** XSLT dosyaları runtime'da instrument edilip DOM `data-design-id`
  attribute'ları ile etiketlenir. Editör iframe içinde postMessage ile iletişir.
- **Namespace Handling:** Tasarım element'leri XSLT'ye `mergeDesignWithXslt`
  ile DOM tabanlı enjekte edilir (string replace değil).

## Geliştirme Yol Haritası

Aktif branch: `refactor/hardening-phase-1` (güvenlik düzeltmeleri)

| Faz | Konu | Durum |
|---|---|---|
| 0 | Plan + branch setup | ✅ |
| 1 | Kritik güvenlik düzeltmeleri | ✅ |
| 2 | Kod temizliği (dead code, deprecation) | ✅ |
| 3 | ProfessionalDesigner.tsx modüler refactor | ⏳ |
| 4 | State management (Zustand) | ⏳ |
| 5 | i18n altyapısı (react-i18next, TR/EN) | ⏳ |
| 6 | UX polish + ErrorBoundary | ⏳ |
| 7 | Performans + bundle optimization | ⏳ |
| 8 | Uluslararası scaffold (registry + i18n kataloğu) | ⏳ |

## Lisans

Özel mülk. Tüm hakları saklıdır.
