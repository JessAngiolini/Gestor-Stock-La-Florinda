import db from "../database/db.js";

// Función para registrar una compra mayorista y aumentar el stock
export const purchaseWholesale = (req, res) => {
    const { productId, quantity } = req.body;
  
    if (!productId || !quantity) {
      return res.status(400).json({ error: "Faltan datos: producto o cantidad" });
    }
  
    // Asegurarse de que la cantidad es un número
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ error: "Cantidad inválida" });
    }
  
    // Obtener el stock actual
    db.get("SELECT quantity FROM products WHERE id = ?", [productId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Error al obtener el stock actual." });
      }
      if (!row) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
  
      const newQuantity = row.quantity + parsedQuantity; // Sumar correctamente
  
      // Actualizar el stock en la base de datos
      db.run("UPDATE products SET quantity = ? WHERE id = ?", [newQuantity, productId], function (err) {
        if (err) {
          return res.status(500).json({ error: "Error al actualizar el stock." });
        }
        res.json({ message: "Stock actualizado correctamente", newQuantity });
      });
    });
  };
  
