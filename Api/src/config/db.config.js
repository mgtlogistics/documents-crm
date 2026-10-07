import mongoose from "mongoose";

const isProd = process.env.NODE_ENV === "production";
const MAX_ATTEMPTS = isProd ? 5 : Infinity;
const RETRY_DELAY_MS = 3000;

const connectionOptions = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    family: 4, // Evita que localhost resuelva a ::1 (IPv6)
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async () => {
    const uri = process.env.databaseUrl;
    if (!uri) {
        console.error("databaseUrl no está definida (revisa .env)");
        process.exit(1);
    }

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            await mongoose.connect(uri, connectionOptions);
            console.log("Connected to MongoDB!");
            return mongoose.connection;
        } catch (err) {
            console.error(`MongoDB intento ${attempt} falló: ${err.message}`);
            await sleep(RETRY_DELAY_MS);
        }
    }

    console.error("No se pudo conectar a MongoDB, cerrando.");
    process.exit(1);
};

mongoose.connection.on("disconnected", () => console.warn("MongoDB desconectado"));
mongoose.connection.on("reconnected", () => console.log("MongoDB reconectado"));

// Se inicia al importar (lo usa también seeder.js); await dbReady para esperar la conexión.
export const dbReady = connectDB();

export default mongoose.connection;
