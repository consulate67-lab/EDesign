export interface StandardField {
    name: string;
    path: string;
    description?: string;
    isNumeric: boolean;
}

export const standardUBLFields: StandardField[] = [
    // Fatura Genel Bilgileri
    { name: 'Fatura Numarası', path: 'Invoice/ID', isNumeric: false },
    { name: 'Fatura Tarihi', path: 'Invoice/IssueDate', isNumeric: false },
    { name: 'Fatura Saati', path: 'Invoice/IssueTime', isNumeric: false },
    { name: 'Fatura Tipi', path: 'Invoice/InvoiceTypeCode', isNumeric: false },
    { name: 'Fatura Senaryosu', path: 'Invoice/ProfileID', isNumeric: false },
    { name: 'Para Birimi', path: 'Invoice/DocumentCurrencyCode', isNumeric: false },
    { name: 'Fatura Notu', path: 'Invoice/Note', isNumeric: false },
    { name: 'UUID', path: 'Invoice/UUID', isNumeric: false },

    // Gönderici Bilgileri (Supplier)
    { name: 'Gönderici Adı/Unvanı', path: 'Invoice/AccountingSupplierParty/Party/PartyName/Name', isNumeric: false },
    { name: 'Gönderici VKN/TCKN', path: 'Invoice/AccountingSupplierParty/Party/PartyIdentification/ID', isNumeric: false },
    { name: 'Gönderici Vergi Dairesi', path: 'Invoice/AccountingSupplierParty/Party/PartyTaxScheme/TaxScheme/Name', isNumeric: false },
    { name: 'Gönderici Web Sitesi', path: 'Invoice/AccountingSupplierParty/Party/WebsiteURI', isNumeric: false },
    { name: 'Gönderici E-Posta', path: 'Invoice/AccountingSupplierParty/Party/Contact/ElectronicMail', isNumeric: false },
    { name: 'Gönderici Telefon', path: 'Invoice/AccountingSupplierParty/Party/Contact/Telephone', isNumeric: false },
    { name: 'Gönderici İl', path: 'Invoice/AccountingSupplierParty/Party/PostalAddress/CityName', isNumeric: false },
    { name: 'Gönderici İlçe', path: 'Invoice/AccountingSupplierParty/Party/PostalAddress/CitySubdivisionName', isNumeric: false },
    { name: 'Gönderici Cadde/Sokak', path: 'Invoice/AccountingSupplierParty/Party/PostalAddress/StreetName', isNumeric: false },
    { name: 'Gönderici Kapı No', path: 'Invoice/AccountingSupplierParty/Party/PostalAddress/BuildingNumber', isNumeric: false },

    // Alıcı Bilgileri (Customer)
    { name: 'Alıcı Adı/Unvanı', path: 'Invoice/AccountingCustomerParty/Party/PartyName/Name', isNumeric: false },
    { name: 'Alıcı Şahıs Adı', path: 'Invoice/AccountingCustomerParty/Party/Person/FirstName', isNumeric: false },
    { name: 'Alıcı Şahıs Soyadı', path: 'Invoice/AccountingCustomerParty/Party/Person/FamilyName', isNumeric: false },
    { name: 'Alıcı VKN/TCKN', path: 'Invoice/AccountingCustomerParty/Party/PartyIdentification/ID', isNumeric: false },
    { name: 'Alıcı Vergi Dairesi', path: 'Invoice/AccountingCustomerParty/Party/PartyTaxScheme/TaxScheme/Name', isNumeric: false },
    { name: 'Alıcı E-Posta', path: 'Invoice/AccountingCustomerParty/Party/Contact/ElectronicMail', isNumeric: false },
    { name: 'Alıcı Telefon', path: 'Invoice/AccountingCustomerParty/Party/Contact/Telephone', isNumeric: false },
    { name: 'Alıcı İl', path: 'Invoice/AccountingCustomerParty/Party/PostalAddress/CityName', isNumeric: false },
    { name: 'Alıcı İlçe', path: 'Invoice/AccountingCustomerParty/Party/PostalAddress/CitySubdivisionName', isNumeric: false },
    { name: 'Alıcı Adres', path: 'Invoice/AccountingCustomerParty/Party/PostalAddress/StreetName', isNumeric: false },

    // Toplamlar (MonetaryTotals)
    { name: 'Mal Hizmet Toplam Tutarı', path: 'Invoice/LegalMonetaryTotal/LineExtensionAmount', isNumeric: true },
    { name: 'Vergi Hariç Toplam', path: 'Invoice/LegalMonetaryTotal/TaxExclusiveAmount', isNumeric: true },
    { name: 'Vergi Dahil Toplam', path: 'Invoice/LegalMonetaryTotal/TaxInclusiveAmount', isNumeric: true },
    { name: 'Ödenecek Tutar', path: 'Invoice/LegalMonetaryTotal/PayableAmount', isNumeric: true },
    { name: 'Toplam İskonto', path: 'Invoice/LegalMonetaryTotal/AllowanceTotalAmount', isNumeric: true },

    // İrsaliye Bilgileri (DespatchDocumentReference)
    { name: 'İrsaliye No', path: 'Invoice/DespatchDocumentReference/ID', isNumeric: false },
    { name: 'İrsaliye Tarihi', path: 'Invoice/DespatchDocumentReference/IssueDate', isNumeric: false },

    // Sipariş Bilgileri (OrderReference)
    { name: 'Sipariş No', path: 'Invoice/OrderReference/ID', isNumeric: false },
    { name: 'Sipariş Tarihi', path: 'Invoice/OrderReference/IssueDate', isNumeric: false },
];
