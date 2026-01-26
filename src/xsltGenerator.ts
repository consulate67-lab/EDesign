import type { DesignState } from './types.ts';

export const generateXSLT = (state: DesignState, docType: string = 'fatura'): string => {
  const elementsXsl = state.elements.map(el => {
    let content = '';
    if (el.type === 'text') {
      content = `<span>${el.content}</span>`;
    } else if (el.type === 'formula') {
      content = `<strong><xsl:value-of select="${el.content}"/></strong>`;
    } else if (el.type === 'table') {
      content = `
        <table id="lineTable" style="width:100%; border-collapse:collapse; margin-top:10px;">
          <thead>
            <tr style="background-color:#f0f0f0;">
              <th style="border:1px solid #666; padding:5px;">Sıra No</th>
              <th style="border:1px solid #666; padding:5px;">Mal/Hizmet Cinsi</th>
              <th style="border:1px solid #666; padding:5px;">Miktar</th>
              <th style="border:1px solid #666; padding:5px;">Birim Fiyat</th>
              <th style="border:1px solid #666; padding:5px;">Tutar</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="//cac:InvoiceLine">
              <tr>
                <td style="border:1px solid #666; padding:5px; text-align:center;"><xsl:value-of select="cbc:ID"/></td>
                <td style="border:1px solid #666; padding:5px;"><xsl:value-of select="cac:Item/cbc:Name"/></td>
                <td style="border:1px solid #666; padding:5px; text-align:right;"><xsl:value-of select="cbc:InvoicedQuantity"/></td>
                <td style="border:1px solid #666; padding:5px; text-align:right;"><xsl:value-of select="cac:Price/cbc:PriceAmount"/></td>
                <td style="border:1px solid #666; padding:5px; text-align:right;"><xsl:value-of select="cbc:LineExtensionAmount"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      `;
    }

    return `
      <div style="position:absolute; left:${el.x}px; top:${el.y}px;">
        ${content}
      </div>
    `;
  }).join('');

  const docTitle = docType === 'arsiv' ? 'e-Arşiv Fatura' :
    docType === 'mikro' ? 'Mikro İhracat Faturası' :
      docType === 'net' ? 'İnternet Satış Faturası' :
        docType === 'yolcu' ? 'Yolcu Beraber İhracat' :
          docType === 'ihracat' ? 'e-İhracat Faturası' : 'e-Fatura';

  return `<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
                xmlns:n1="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
    <xsl:output method="html" indent="yes" encoding="UTF-8" />
    <xsl:template match="/">
        <html>
            <head>
                <style type="text/css">
                    body { font-family: 'Tahoma', sans-serif; font-size: 11px; color: #333; width: 750px; }
                    #main-container { border-top: 2px solid #000099; padding-top: 10px; position: relative; min-height: 1000px; }
                    #header-table { width: 100%; border-bottom: 2px solid #000099; padding-bottom: 20px; margin-bottom: 20px; }
                    .company-name { font-size: 16px; font-weight: bold; color: #000; }
                    .property-label { font-weight: bold; width: 80px; display: inline-block; }
                </style>
            </head>
            <body>
                <div id="main-container">
                    <table id="header-table">
                        <tr>
                            <td style="width:150px; vertical-align:top;">
                                ${state.logoUrl ? `<img src="${state.logoUrl}" style="max-width:150px;" />` : ''}
                            </td>
                            <td style="vertical-align:top; padding-left:20px;">
                                <div class="company-name">${state.companyName}</div>
                                <div style={{marginTop: '10px'}}>
                                    <div><span class="property-label">ADRES</span>: Ankara, Türkiye</div>
                                    <div><span class="property-label">VKN</span>: 1234567890</div>
                                </div>
                            </td>
                            <td style="width:200px; text-align:right; vertical-align:top;">
                                <h1 style="margin:0; font-size:24px;">${docTitle}</h1>
                            </td>
                        </tr>
                    </table>
                    
                    ${elementsXsl}
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>`;
};
