export const transformXmlWithXslt = (xmlString: string, xsltString: string): string => {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        const xsltDoc = parser.parseFromString(xsltString, "application/xml");

        const processor = new XSLTProcessor();
        processor.importStylesheet(xsltDoc);

        const resultDoc = processor.transformToDocument(xmlDoc);
        const serializer = new XMLSerializer();
        return serializer.serializeToString(resultDoc);
    } catch (error) {
        console.error("XSLT Transformation Error:", error);
        return `<div>Hata: XSLT Dönüşümü başarısız oldu. <br/> ${error}</div>`;
    }
};
