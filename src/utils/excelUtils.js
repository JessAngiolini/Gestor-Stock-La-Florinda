//Funciones para leer y procesar Excel 

import ExcelJS from 'exceljs';


export const readExcelFile = async (filePath) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];
  
    let products = [];
    let headers = {};
  
    // Leer la segunda fila (encabezados) y mapear columnas
    worksheet.getRow(2).eachCell((cell, colNumber) => {
      const header = cell.value ? cell.value.toString().trim().toLowerCase() : '';
      console.log(`Encabezado encontrado: '${header}'`); // Verifica el valor del encabezado
  
      if (header.includes("descripción")) headers.name = colNumber;
      if (header.includes("precio")) headers.price = colNumber;
    });
  
    // Verificar que existan las columnas necesarias
    if (!headers.name || !headers.price) {
      throw new Error("El archivo Excel no tiene las columnas esperadas ('Descripción', 'Precio').");
    }
  
    // Leer las filas y mapear datos a partir de la tercera fila
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 2) { // Ignora las primeras dos filas
        const name = row.getCell(headers.name).value ? row.getCell(headers.name).value.trim() : '';
        const price = row.getCell(headers.price).value ? parseFloat(row.getCell(headers.price).value) : NaN;
        
        if (name && !isNaN(price)) {
          products.push({
            name,
            price,
          });
        } else {
     /*      console.log(`Fila ignorada - Nombre: '${name}', Precio: ${price}`); */
        }
      }
    });
  
    return products;
  };


export const increasePrice = (products, percentage) => {
    return products.map(product => ({
      ...product,
      price: parseFloat((product.price * (1 + percentage / 100)).toFixed(2)), // Convertir de nuevo a número
    }));
  };

