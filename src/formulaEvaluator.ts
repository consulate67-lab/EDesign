export const evaluateFormula = (formula: string, context: Record<string, number>) => {
    try {
        // Replace placeholders like {Price} with values from context
        let expression = formula;
        Object.keys(context).forEach(key => {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            expression = expression.replace(regex, context[key].toString());
        });

        // Simple security: allow only numbers and basic operators
        if (/[^-+*/().0-9\s]/.test(expression)) {
            return 'Hata: Geçersiz Karakter';
        }

        // Use Function constructor for calculation (safer than eval if sanitized)
        return new Function(`return ${expression}`)();
    } catch (e) {
        return 'Hata';
    }
};
