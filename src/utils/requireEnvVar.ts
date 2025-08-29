export const requireEnvVar = (key: string, defaultValue?: string) => {
    const value = process.env[key] || defaultValue;

    if (!value) {
        const jwtSuggestion = key.startsWith('JWT')
            ? " Run 'npm run generate-keys' to generate JWT keys and add them to your .env file."
            : '';
        throw new Error(`Missing required environment variable: ${key}. ${jwtSuggestion}`);
    }

    return value;
};
