//Importing express module
const express = require('express');
//Creating an express application
const app = express();
//Setting the port
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Sample products data
let products = [{
    "id": 1,
    "name": "Product 1",
    "description": "This is a sample product",
    "price": 100,
    "quantity": 10
},
{
    "id": 2,
    "name": "Product 2",
    "description": "This is a sample product number 2",
    "price": 120,
    "quantity": 69
},
{
    "id": 3,
    "name": "Product 1",
    "description": "This is a sample product number 3",
    "price": 101,
    "quantity": 88
}];
// Current ID counter
let currentId = 4;

// Updated GET /products - Fetch all products with sorting (Optionally)
app.get('/products', (req, res) => {
    let sortedProducts = [...products];

    const { sortBy, order = 'asc' } = req.query;

    // Sorting logic
    if (sortBy === 'name' || sortBy === 'price') {
        sortedProducts.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return order === 'asc' ? -1 : 1;
            if (a[sortBy] > b[sortBy]) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    res.json(sortedProducts);
});

// GET /products/:id - Fetch a product by ID
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

// POST /products - Add a new product
app.post('/products', (req, res) => {
    const { name, description = '', price, quantity = 0 } = req.body;

    // Validation checks
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Name is required and must be a string' });
    }
    if (price == null || typeof price !== 'number') {
        return res.status(400).json({ message: 'Price is required and must be a number' });
    }

    const newProduct = { id: currentId++, name, description, price, quantity };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT /products/:id - Update an existing product
app.put('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, quantity } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price != null) product.price = price;
    if (quantity != null) product.quantity = quantity;

    res.json(product);
});

// DELETE /products/:id - Delete a product by ID
app.delete('/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Product not found' });
    products.splice(index, 1);
    res.status(200).json({message: 'Product Deleted'});
});

//Listening to the port 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});