export const settings = {
    MONGODB_URI: process.env.mongoURI || 'mongodb://0.0.0.0.:27017',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN || "qwerty",
}