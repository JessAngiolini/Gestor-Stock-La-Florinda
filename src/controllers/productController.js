import db from "../database/db.js";


// Obtener todos los productos
export const getProducts = (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Obtener un producto por ID
export const getProductById = (req, res, next) => {
  const { id } = req.params;
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
    if (err) {
      return next(err);
    }
    if (!row) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(row);
  });
};

// Agregar un producto
export const addProduct = (req, res) => {

  const { name, quantity, price, category_id } = req.body;

  // Verificar si el producto ya existe
  db.get("SELECT * FROM products WHERE name = ?", [name], (err, row) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    if (row) {
        return res.status(400).json({ error: "El producto ya existe." });
    }

    // Insertar el producto si no existe
    db.run(
        "INSERT INTO products (name, quantity, price, category_id) VALUES (?, ?, ?, ?)",
        [name, quantity, price, category_id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, name, quantity, price, category_id });
        }
    );
});
};
// Editar un producto
export const updateProduct = (req, res) => {
  
  const { id } = req.params;
  const { name, quantity, category_id } = req.body;
  
  db.run("UPDATE products SET name = ?, quantity = ? , price = ? , category_id = ? , WHERE id = ?", [name, quantity, category_id, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Producto actualizado correctamente" });
  });
};

// Eliminar un producto
export const deleteProduct = (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Producto eliminado correctamente" });
  });
};
