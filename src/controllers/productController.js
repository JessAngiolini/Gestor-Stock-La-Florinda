import db from "../database/db.js";

// Obtener todos los productos
export const getProducts = (req, res) => {
 
   db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log(rows);
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
// Editar un producto
export const updateProduct = (req, res) => {
  const { id } = req.params;  // Se obtiene el ID de la ruta
  const { name, price, quantity } = req.body;  // Se obtienen los datos del producto

  // Verificar si los parámetros necesarios están presentes
  if (!name || !price || !quantity ) {
    return res.status(400).json({ error: "Faltan datos para actualizar el producto" });
  }

  // Actualizar el producto en la base de datos
  db.run(
    "UPDATE products SET name = ?, quantity = ?, price = ? WHERE id = ?",
    [name, quantity, price, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json({ message: "Producto actualizado correctamente" });
    }
  );
};


// Eliminar un producto
// Eliminar un producto
export const deleteProduct = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID de producto requerido" });
  }

  db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
    if (err) {
      console.error("Error al eliminar producto:", err);
      return res.status(500).json({ error: "Error al eliminar el producto" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado correctamente" });
  });
};


//Encuentra producto buscado por el usuario
export const searchProduct = (req, res) => {
  const { query } = req.params;

  db.all(
    "SELECT * FROM products WHERE name LIKE ?",
    [`%${query}%`],
    (err, rows) => {
      if (err) {
        console.error("❌ Error al buscar productos:", err.message);
        return res.status(500).json({ error: "Error al buscar productos" });
      }

      res.json(rows);
    }
  );
};

// Eliminar openDatabase, ya que ya estás usando la instancia db
export const updatePrices = async (req, res) => {
  try {
    const { keyword, percentage } = req.body;
    if (!keyword || !percentage) {
      return res.status(400).json({ error: "Faltan datos: palabra clave o porcentaje." });
    }

    db.all(
      "SELECT id, name, price FROM products WHERE name LIKE ?",
      [`%${keyword}%`],
      async (err, products) => {
        if (err) {
          console.error("❌ Error al buscar productos:", err.message);
          return res.status(500).json({ error: "Error al buscar productos" });
        }

        if (products.length === 0) {
          return res.status(404).json({ error: "No se encontraron productos con esa palabra clave." });
        }

        const updatePromises = products.map((product) => {
          const newPrice = product.price + (product.price * (percentage / 100));
          return new Promise((resolve, reject) => {
            db.run("UPDATE products SET price = ? WHERE id = ?", [newPrice, product.id], function (err) {
              if (err) reject(err);
              else resolve();
            });
          });
        });

        try {
          await Promise.all(updatePromises);
          res.json({ message: "Precios actualizados correctamente", updatedProducts: products });
        } catch (updateErr) {
          console.error("❌ Error al actualizar los precios:", updateErr.message);
          res.status(500).json({ error: "Error al actualizar los precios." });
        }
      }
    );
  } catch (error) {
    console.error("Error al actualizar precios:", error.message || error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


//Venta compra
export const updateProductStock = async (req, res) => {
  const { id, newQuantity } = req.body;

  if (!id || newQuantity === undefined) { //validacion de ID
    return res.status(400).json({ error: "ID y nueva cantidad son obligatorios." });
  }

  db.run("UPDATE products SET quantity = ? WHERE id = ?", [newQuantity, id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error al actualizar el stock." });
    }
    res.json({ success: true, message: "Stock actualizado correctamente." });
  });
};
