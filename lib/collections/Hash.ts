export function HashCode(obj: any): number {
    if (typeof obj !== 'object' || obj === null) {
        // Non-object values (e.g., strings, numbers) are hashed directly
        return hashString(String(obj));
    }

    const keys = Object.keys(obj).sort();
    let hash = 0;

    for (const key of keys) {
        const value = obj[key];
        hash += hashString(key);

        if (typeof value === 'object' && value !== null) {
            // Recursively hash nested objects
            hash += HashCode(value);
        } else {
            if (typeof value === "number") {
                hash += value;
            } else {
                // Hash non-object values directly
                hash += hashString(String(value));
            }
        }
    }

    return hash;
}

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
}