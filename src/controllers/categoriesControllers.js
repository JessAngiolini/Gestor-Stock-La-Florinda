import db from "../database/db.js"


  //Mostrar todas las categorias
  export const getCategories = (req, res) => {
    db.all("SELECT * FROM categories", [], (err, rows) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json(rows);
    });
  };

  //Mostrar por ID 

  export const getCategoryById = (req, res, next) => {
    const { id } = req.params;
    db.get("SELECT * FROM categories WHERE id = ? ", [id], (err,row) => {
        if (err) {
            return next(err);
        }
        if(!row){
            return res.status(404).json({message:"Categoria no encontrada"});
        }
        res.json(row);
    });
  };

  //Crear categoria
  export const createCategory = (req, res) => {
    const { name } = req.body;
   
     // Verificar si el categories ya existe
  db.get("SELECT * FROM categories WHERE name = ?", [name], (err, row) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    if (row) {
        return res.status(400).json({ error: "La categoria ya existe." });
    }
    //Si no existe crea una nueva
    db.run("INSERT INTO categories (name) VALUES (?)", [name], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "Categoría creada con éxito",
        id: this.lastID, // Devuelve el ID de la categoría recién creada
      });
    });
  });
}

//Editar categoria
export const updateCategory = (req, res) => {
    const {id} = req.params;
    const {name} = req.body;

    db.run("UPDATE categories SET name = ? , WHERE id = ?", [name, id], function (err) {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({message: "Categoria actualizada"});
});
};

//Eliminar la categoria
export const deleteCategory = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM categories WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Categoria eliminada correctamente" });
    });
  };
  