import request from 'supertest';
import app from '../../server.js';
import db from '../../src/database/db.js';

describe('Product Routes', () => {
    // Test para obtener todos los productos
    it('should return all products', async () => {
      const response = await request(app).get('/api/products');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true); // Verifica que la respuesta sea un array
    });

    // Test para crear un nuevo producto
    it('should create a new product', async () => {
        const newProduct = { name: 'Producto Test', quantity: 10 };
        const response = await request(app).post('/api/products').send(newProduct);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id'); // Verifica que se haya generado un ID
        expect(response.body.name).toBe(newProduct.name); // Verifica el nombre del producto
        expect(response.body.quantity).toBe(newProduct.quantity); // Verifica la cantidad
    });

    // Test para obtener un producto por ID
    it('should return a product by ID', async () => {
        // Primero, creamos un producto para obtener su ID
        const newProduct = { name: 'Producto para Test', quantity: 5 };
        const createResponse = await request(app).post('/api/products').send(newProduct);
        const productId = createResponse.body.id;

        const response = await request(app).get(`/api/products/${productId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toBe(productId); // Verifica que el ID coincida
    });

    // Test para manejar un ID no existente
    it('should return 404 for non-existing product', async () => {
        const response = await request(app).get('/api/products/9999'); // ID que no existe
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Producto no encontrado');
    });

    afterAll(done => {
        // Cierra la conexión a la base de datos aquí
        db.close(); // Asegúrate de usar el método correcto para cerrar la conexión
        done();
    });
});


 
  
