import "dotenv/config"

export const config = {
    db: {PORT: process.env.PORT, url: process.env.DB_URL},
    jwt: {accessSecret: process.env.JWT_ACCESS_SECRET, refreshSecret: process.env.JWT_REFRESH_SECRET}
} 