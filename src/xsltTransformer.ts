export const transformXmlWithXslt = (xmlString: string, xsltString: string): string => {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        const xsltDoc = parser.parseFromString(xsltString, "application/xml");

        const processor = new XSLTProcessor();
        processor.importStylesheet(xsltDoc);

        let resultDoc = processor.transformToDocument(xmlDoc);

        const serializer = new XMLSerializer();

        if (!resultDoc) {
            // Fallback: try to transform to fragment
            console.warn('transformToDocument returned null, trying transformToFragment...');
            const resultFragment = processor.transformToFragment(xmlDoc, document);
            if (resultFragment) {
                return serializer.serializeToString(resultFragment);
            }
            throw new Error('XSLT transformation produced null result.');
        }

        return serializer.serializeToString(resultDoc);
    } catch (error) {
        console.error("XSLT Transformation Error:", error);
        // Log the first 200 chars of XSLT for debug
        console.log("Failed XSLT (start):", xsltString.substring(0, 500));
        return `<div>Hata: XSLT Dönüşümü başarısız oldu. <br/> ${error}</div>`;
    }
};
