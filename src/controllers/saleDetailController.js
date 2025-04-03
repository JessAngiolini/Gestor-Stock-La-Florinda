import db from "../database/db.js"; // Importar la conexión a la base de datos

// Obtener todas las ventas ordenadas por fecha
export const getAllSales = async (req, res) => {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM sales ORDER BY date DESC", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        res.status(500).json({ error: "Error al obtener ventas" });
    }
};



// Obtener ventas por rango de fechas
export const getSalesByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: "Debes proporcionar startDate y endDate" });
    }

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM sales WHERE date BETWEEN ? AND ? ORDER BY date DESC",
                [startDate, endDate], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener ventas por fecha:", error);
        res.status(500).json({ error: "Error al obtener ventas por fecha" });
    }
};
