import path from 'path';
import { readExcelFile, increasePrice } from '../utils/excelUtils.js';
import db from '../database/db.js'; 

// actualizar los precios según una palabra clave ingresada por el usuario
export const updatePricesByKeyword = (req, res) => {
  const { keyword, percentage } = req.body;

  if (!keyword || keyword.trim() === "") {
    return res.status(400).json({ error: "La palabra clave es obligatoria." });
  }

  const parsedPercentage = parseFloat(percentage);
  if (isNaN(parsedPercentage) || parsedPercentage < 0) {
    return res.status(400).json({ error: "El porcentaje debe ser un número válido y positivo." });
  }

  // Buscar productos que coincidan con la palabra clave (sin distinción de mayúsculas/minúsculas)
  db.all("SELECT * FROM products WHERE LOWER(name) LIKE LOWER(?)", [`%${keyword}%`], (err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (products.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos con esa palabra clave." });
    }

    // Actualizar los precios con el porcentaje ingresado
    const updatePromises = products.map(product => {
      const newPrice = (product.price * (1 + parsedPercentage / 100)).toFixed(2);
      
      return new Promise((resolve, reject) => {
        db.run(
          "UPDATE products SET price = ? WHERE id = ?",
          [newPrice, product.id],
          function (err) {
            if (err) reject(err);
            resolve();
          }
        );
      });
    });

    Promise.all(updatePromises)
      .then(() => res.json({ message: `Precios actualizados para ${products.length} productos.` }))
      .catch(error => res.status(500).json({ error: error.message }));
  });
};


// 🟢 Función para subir un Excel y actualizar precios con un porcentaje ingresado



export const uploadExcel = async (req, res) => {
  try {
    // Verificar si existe el archivo y el porcentaje
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "El archivo es obligatorio." });
    }
    if (!req.body.percentage) {
      return res.status(400).json({ error: "El porcentaje es obligatorio." });
    }

    const percentage = parseFloat(req.body.percentage);
    if (isNaN(percentage) || percentage < 0) {
      return res.status(400).json({ error: "El porcentaje debe ser un número válido y positivo." });
    }

    // Obtener la ruta del archivo subido
    const filePath = path.join('uploads', req.files.file[0].filename);
    const productsFromExcel = await readExcelFile(filePath);
    // Mostrar los productos leídos del archivo para verificar
    console.log("Productos procesados del archivo Excel:", productsFromExcel); 

    // Aplicar el aumento de precio
    const updatedProducts = increasePrice(productsFromExcel, percentage);
    console.log("Productos actualizados: ", updatedProducts);

    // Obtener los productos actuales de la base de datos
    db.all("SELECT * FROM products", [], (err, productsInDB) => {
        console.log("Productos encontrados en base de datos:", productsInDB)
      if (err) {
        return res.status(500).json({ error: "Error obteniendo productos de la base de datos." });
      }

      // Iterar sobre los productos del Excel y actualizar solo los que existan en la base de datos
      const updatePromises = updatedProducts.map(productFromExcel => {
        const productInDB = productsInDB.find(p => p.name === productFromExcel.name);
        
        if (productInDB && productInDB.price !== productFromExcel.price) {
          // Si el precio ha cambiado, actualizar el producto
          return new Promise((resolve, reject) => {
            db.run(
              "UPDATE products SET price = ? WHERE name = ?",
              [productFromExcel.price, productFromExcel.name],
              function (err) {
                if (err) reject(err);
                resolve();
              }
            );
          });
        }
      }).filter(Boolean); // Filtrar promesas nulas (productos no encontrados o no actualizados)

      // Esperar que todas las actualizaciones se completen
      Promise.all(updatePromises)
        .then(() => {
          res.status(200).json({ message: "Precios actualizados correctamente desde el Excel" });
        })
        .catch(error => {
          console.error("Error actualizando productos:", error);
          res.status(500).json({ error: "Error actualizando productos." });
        });
    });

  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({ error: "Error procesando el archivo" });
  }
  
};



// 🟢 Función para aumentar precios sin Excel, solo con un porcentaje
export const updatePrices = (req, res) => {
  const { percentage } = req.body;

  if (isNaN(percentage) || percentage < 0) {
    return res.status(400).json({ error: "El porcentaje debe ser un número válido y positivo." });
  }

  db.all("SELECT * FROM products", [], (err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const updatedProducts = increasePrice(products, percentage);

    const updatePromises = updatedProducts.map(product => {
      return new Promise((resolve, reject) => {
        db.run(
          "UPDATE products SET price = ? WHERE id = ?",
          [product.price, product.id],
          function (err) {
            if (err) reject(err);
            resolve();
          }
        );
      });
    });

    Promise.all(updatePromises)
      .then(() => res.json({ message: "Precios aumentados correctamente" }))
      .catch(error => res.status(500).json({ error: error.message }));
  });
};
