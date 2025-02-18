import mysql from "mysql2/promise";
import Trips from "../models/Trips.js";
import dotenv from "dotenv";

dotenv.config();

const mysqlConfig = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
};

export const migrateTrips = async (req, res) => {
    let mysqlConnection;
    try {
        // Проверяем параметры MySQL
        if (!mysqlConfig.host || !mysqlConfig.user || !mysqlConfig.password || !mysqlConfig.database) {
            throw new Error("Missing MySQL connection parameters.");
        }

        mysqlConnection = await mysql.createConnection(mysqlConfig);
        await mysqlConnection.ping();
        console.log("✅ MySQL connection established");

        // Загружаем заказы из MySQL
        const [rows] = await mysqlConnection.execute(
            "SELECT * FROM wp_tourmaster_order WHERE order_status != 'completed'"
        );
        console.log(`📥 Fetched ${rows.length} rows from MySQL`);

        if (rows.length === 0) {
            return res.status(200).json({ message: "No new data to migrate." });
        }

        // Формируем массив данных для MongoDB
        const trips = rows.map(row => ({
            order_id: row.id.toString(),
            travel_date: row.travel_date,
            traveller_amount: row.traveller_amount.toString(),
            coupon_code: row.coupon_code || "",
            order_status: row.order_status,
            total_price: row.total_price.toString(),
            currency: row.currency
        }));

        console.log("🔄 Checking for duplicates...");

        // Проверяем, какие ордера уже есть в MongoDB
        const existingTrips = await Trips.find({ order_id: { $in: trips.map(t => t.order_id) } });
        const existingIds = new Set(existingTrips.map(t => t.order_id));

        // Оставляем только новые заказы
        const newTrips = trips.filter(trip => !existingIds.has(trip.order_id));

        if (newTrips.length > 0) {
            await Trips.insertMany(newTrips);
            console.log(`✅ Inserted ${newTrips.length} new trips into MongoDB`);
        } else {
            console.log("⚠ No new trips to insert");
        }

        res.status(200).json({ message: "Data migrated successfully", inserted: newTrips.length });

    } catch (error) {
        console.error("❌ Error transferring data:", error);
        res.status(500).json({ error: "Error transferring data", details: error.message });
    } finally {
        if (mysqlConnection) {
            await mysqlConnection.end();
            console.log("🔌 MySQL connection closed");
        }
    }
};