const express = require('express');
const cors = require("cors");
const pgp = require('pg-promise')();
const app = express();
const cn = {
    connectionString: 'postgres://postgres.gibrraeunbjmtjlbwjkq:bqBT.fH2iFR%+$v@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
};
const db = pgp(cn);

app.use(cors());
app.use(express.json());


/*
* *
* *
* *
* *
* *
* *
methods
* *
* *
* *
* *
* *
* *
 */

/**
 * EMPLOYEES************************************************************************************************************
 */
app.get('/get-employees', (req, res) =>{
    const { sortBy, sortOrder } = req.query;
    const orderBy = `${sortBy} ${sortOrder}`;
    db.any(`SELECT * FROM "Employee" ORDER BY ${orderBy};`)
        .then(result =>{
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error:error.message});
        });
});
app.get('/get-single-employee/:id', (req, res) =>{
    const employeeId = req.params.id;
    db.any('SELECT * FROM "Employee" WHERE id_employee = $1;', [employeeId])
        .then(result =>{
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error:error.message});
        });
});
app.delete('/delete-employee/:id', (req, res) => {
    const employeeId = req.params.id;
    db.any('DELETE FROM "Employee" WHERE id_employee = $1;', [employeeId])
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});
app.put('/update-employee/:id', (req, res) => {
    const employeeId = req.params.id;
    const { empl_name, empl_surname, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code } = req.body;

    db.none('UPDATE "Employee" SET empl_name = $1, empl_surname = $2, empl_patronymic = $3, empl_role = $4, salary = $5, date_of_birth = $6, date_of_start = $7, phone_number = $8, city = $9, street = $10, zip_code = $11 WHERE id_employee = $12;',
        [empl_name, empl_surname, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code, employeeId])
        .then(() => {
            res.json({ message: 'Employee updated successfully' });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});
app.get('/get-max-employee-id', (req, res) => {
    db.one('SELECT MAX(id_employee) AS maxId FROM "Employee";')
        .then((result) => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error fetching max id' });
        });
});
app.post('/add-employee', async (req, res) => {
    try {
        const { id_employee, empl_name, password, empl_surname, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code } = req.body;
        if (!id_employee || !empl_name || !empl_surname || !password || !empl_patronymic || !empl_role || !salary || !date_of_birth || !date_of_start || !phone_number || !city || !street || !zip_code) {
            throw new Error('Please provide all required fields');
        }
        await db.none('INSERT INTO "Employee" (id_employee, empl_name, password, empl_surname, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);',
            [id_employee, empl_name, password, empl_surname, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code]);

        res.json({ message: 'Employee added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding employee: ' + error.message });
    }
});

/**
 * CATEGORIES***********************************************************************************************************
 */
app.get('/get-category', (req, res) =>{
    const { sortBy, sortOrder } = req.query;
    const orderBy = `${sortBy} ${sortOrder}`;
    db.any(`SELECT * FROM "Category" ORDER BY ${orderBy};`)
        .then(result =>{
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error:error.message});
        });
});
app.get('/get-single-category/:id', (req, res) =>{
    const categoryNumber = req.params.id;
    db.any('SELECT * FROM "Category" WHERE category_number = $1;', [categoryNumber])
        .then(result =>{
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error:error.message});
        });
});
app.delete('/delete-category/:id', (req, res) => {
    const categoryNumber = req.params.id;
    db.any('DELETE FROM "Category" WHERE category_number = $1;', [categoryNumber])
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});
app.put('/update-category/:id', (req, res) => {
    const categoryNumber = req.params.id;
    const { category_number, category_name } = req.body;
    db.none('UPDATE "Category" SET category_number = $1, category_name = $2 WHERE category_number = $3;',
        [category_number, category_name, categoryNumber])
        .then(() => {
            res.json({ message: 'Category updated successfully' });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});
app.post('/add-category', async (req, res) => {
    try {
        const { category_number, category_name } = req.body;
        await db.none('INSERT INTO "Category" (category_number, category_name) VALUES ($1, $2);',
            [category_number, category_name]);

        res.json({ message: 'Category added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding category: ' + error.message });
    }
});
app.get('/get-max-category-number', (req, res) => {
    db.any('SELECT category_number FROM "Category";')
        .then((result) => {
            res.json(result);
        })
        .catch(error => {
            console.error('Error fetching max category number:', error.message);
            res.status(500).json({ error: 'Error fetching max category number' });
        });
});
app.get('/get-products/:categoryNumber', (req, res) =>{
    const { sortBy, sortOrder } = req.query;
    const { categoryNumber } = req.params;
    const orderBy = `${sortBy} ${sortOrder}`;
    db.any(`SELECT * FROM "Product" WHERE category_number = $1 ORDER BY ${orderBy};`, [categoryNumber])
        .then(result =>{
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error:error.message});
        });
});

/**
 * PRODUCTS*************************************************************************************************************
 */
app.get('/get-products', (req, res) =>{
    const { sortBy, sortOrder } = req.query;
    const orderBy = `${sortBy} ${sortOrder}`;
    db.any(`SELECT * FROM "Product" ORDER BY ${orderBy};`)
        .then(result =>{
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error:error.message});
        });
});
app.get('/get-single-product/:id', (req, res) =>{
    const idProd = req.params.id;
    db.any('SELECT * FROM "Product" WHERE id_product = $1;', [idProd])
        .then(result =>{
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error:error.message});
        });
});
app.delete('/delete-product/:id', (req, res) => {
    const idProd = req.params.id;
    db.any('DELETE FROM "Product" WHERE id_product = $1;', [idProd])
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});
app.put('/update-product/:id', (req, res) => {
    const productId = req.params.id;
    const { category_number, product_name, characteristics, manufacturer } = req.body;

    db.none('UPDATE "Product" SET category_number = $1, product_name = $2, characteristics = $3, manufacturer = $4 WHERE id_product = $5;',
        [category_number, product_name, characteristics, manufacturer, productId])
        .then(() => {
            res.json({ message: 'Product updated successfully' });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});
app.post('/add-product', async (req, res) => {
    try {
        const { id_product, category_number, product_name, characteristics, manufacturer } = req.body;
        await db.none('INSERT INTO "Product" (id_product, category_number, product_name, characteristics, manufacturer) VALUES ($1, $2, $3, $4, $5);',
            [id_product, category_number, product_name, characteristics, manufacturer]);

        res.json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding product: ' + error.message });
    }
});
app.get('/get-products-id', (req, res) => {
    db.any('SELECT id_product FROM "Product";')
        .then((result) => {
            res.json(result);
        })
        .catch(error => {
            console.error('Error fetching ids:', error.message);
            res.status(500).json({ error: 'Error fetching ids' });
        });
});

/**
 * CHECKS*************************************************************************************************************
 */
app.get('/get-checks', (req, res) =>{
    const { sortBy, sortOrder } = req.query;
    const orderBy = `${sortBy} ${sortOrder}`;
    db.any(`SELECT * FROM "Check" ORDER BY ${orderBy};`)
        .then(result =>{
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error:error.message});
        });
});
app.get('/get-sales/:id', (req, res) => {
    const checkNum = req.params.id;
    db.any('SELECT * FROM ((("Store_Product" INNER JOIN "Sale" ON "Store_Product".upc = "Sale".upc) INNER JOIN "Product" ON "Product".id_product = "Store_Product".id_product) INNER JOIN "Check" ON "Check".check_number = "Sale".check_number) LEFT JOIN "Customer_Card" ON "Customer_Card".card_number = "Check".card_number WHERE "Check".check_number = $1;', [checkNum])
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

app.get('/get-checks-by-cashier-period', async (req, res) => {
    const { cashierId, startDate, endDate, sortBy, sortOrder } = req.query; // Change parameter names to match frontend
    const orderBy = `${sortBy} ${sortOrder}`;
    try {
        const query = `SELECT * FROM "Check" WHERE id_employee = $1 AND DATE(print_date) BETWEEN $2 AND $3 ORDER BY ${orderBy};`;
        const checks = await db.any(query, [cashierId, startDate, endDate]);
        res.json(checks);
    } catch (error) {
        console.error('Database Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.get('/get-checks-by-cashier', async (req, res) => {
    const { cashierId, sortBy, sortOrder } = req.query;
    const orderBy = `${sortBy} ${sortOrder}`;
    try {
        const query = `SELECT * FROM "Check" WHERE id_employee = $1 ORDER BY ${orderBy};`;
        const checks = await db.any(query, [cashierId]);
        res.json(checks);
    } catch (error) {
        console.error('Database Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.get('/get-checks-by-period', async (req, res) => {
    const { startDate, endDate, sortBy, sortOrder } = req.query;
    const orderBy = `${sortBy} ${sortOrder}`;
    try {
        const query = `SELECT * FROM "Check" WHERE print_date BETWEEN $1 AND $2 ORDER BY ${orderBy};`;
        const checks = await db.any(query, [startDate, endDate]);
        res.json(checks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/delete-check/:id', (req, res) => {
    const idCheck = req.params.id;
    db.any('DELETE FROM "Check" WHERE check_number = $1;', [idCheck])
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});
app.post('/add-check', async (req, res) => {
    try {
        const { check_number, id_employee, card_number } = req.body;
        const query = card_number ? 'INSERT INTO "Check" (check_number, id_employee, card_number) VALUES ($1, $2, $3);' :
            'INSERT INTO "Check" (check_number, id_employee) VALUES ($1, $2);';

        const params = card_number ? [check_number, id_employee, card_number] :
            [check_number, id_employee];

        await db.none(query, params);

        res.json({ message: 'Check added successfully' });
    } catch (error) {
        console.error('Error adding check:', error.message); // Log error message
        res.status(500).json({ error: 'Error adding check: ' + error.message });
    }
});
app.post('/add-sale', async (req, res) => {
    try {
        const { check_number, UPC, product_number } = req.body;
        await db.none('INSERT INTO "Sale" (check_number, upc, product_number) VALUES ($1, $2, $3);',
            [check_number, UPC, product_number]);
        res.json({ message: 'Sale added successfully' });
    } catch (error) {
        console.error('Error adding sale:', error.message); // Log error message
        res.status(500).json({ error: 'Error adding sale: ' + error.message });
    }
});

app.get('/get-max-check-number', async (req, res) => {
    try {
        const maxCheckNumber = await db.one('SELECT MAX(check_number) AS maxCheckNumber FROM "Check";');
        res.json(maxCheckNumber);
    } catch (error) {
        console.error('Error fetching max check number:', error.message); // Log error message
        res.status(500).json({ error: 'Error fetching max check number' });
    }
});
app.get('/get-upc-options', async (req, res) => {
    try {
        const upcs = await db.any('SELECT upc, upc_prom, product_name  FROM "Store_Product" INNER JOIN public."Product" P on "Store_Product".id_product = P.id_product;');
        res.json(upcs);
    } catch (error) {
        console.error('Error fetching upc number:', error.message);
        res.status(500).json({ error: 'Error fetching upc number' });
    }
});

/**
 * CARDS*************************************************************************************************************
 */
app.get('/get-customer-cards', async (req, res) => {
    try {
        const upcs = await db.any('SELECT *  FROM "Customer_Card";');
        res.json(upcs);
    } catch (error) {
        console.error('Error fetching cards:', error.message);
        res.status(500).json({ error: 'Error fetching cards' });
    }
});

/**
 * CUSTOMER CARDS***********************************************************************************************************
 */
app.get('/get-card', (req, res) =>{
    const { sortBy, sortOrder } = req.query;
    const orderBy = `${sortBy} ${sortOrder}`;
    db.any(`SELECT * FROM "Customer_Card" ORDER BY ${orderBy};`)
        .then(result =>{
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error:error.message});
        });
});
app.get('/get-single-card/:id', (req, res) =>{
    const cardNumber = req.params.id;
    db.any('SELECT * FROM "Customer_Card" WHERE card_number = $1;', [cardNumber])
        .then(result =>{
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error:error.message});
        });
});
app.delete('/delete-card/:id', (req, res) => {
    const cardNumber = req.params.id;
    db.any('DELETE FROM "Customer_Card" WHERE card_number = $1;', [cardNumber])
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});
app.put('/update-card/:id', (req, res) => {
    const cardId = req.params.id;
    const { card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent } = req.body;
    db.none('UPDATE "Customer_Card" SET card_number = $1, cust_surname = $2, cust_name = $3, cust_patronymic = $4, phone_number = $5, city = $6, street = $7, zip_code = $8, percent = $9 WHERE card_number = $10;',
        [card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent, cardId]) // Changed cardNumber to cardId
        .then(() => {
            res.json({ message: 'Card updated successfully' });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

app.post('/add-card', async (req, res) => {
    try {
        console.log('Received request to add a new card:', req.body);

        const { card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent } = req.body;
        console.log('Inserting card into database...');

        await db.none('INSERT INTO "Customer_Card" (card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent]);

        console.log('Card added successfully');
        res.json({ message: 'Card added successfully' });
    } catch (error) {
        console.error('Error adding card:', error.message);
        res.status(500).json({ error: 'An error occurred while adding a new customer card. Please try again.' });
    }
});

app.get('/get-max-card-number', (req, res) => {
    db.any('SELECT card_number FROM "Customer_Card";')
        .then((result) => {
            res.json(result);
        })
        .catch(error => {
            console.error('Error fetching max card number:', error.message);
            res.status(500).json({ error: 'Error fetching max card number' });
        });
});
app.get('/get-card-info/:id', (req, res) =>{
    const  cardNumber  = req.params.id;
    db.one(`SELECT * FROM "Customer_Card" WHERE card_number = $1;`, [cardNumber])
        .then(result =>{
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error:error.message});
        });
});



/**
 * STORE PRODUCTS***********************************************************************************************************
 */
app.get('/get-store-products', (req, res) => {
    const { sortBy, sortOrder } = req.query;
    const orderBy = `${sortBy} ${sortOrder}`;
    db.any(`SELECT p.*, sp.upc, sp.upc_prom, sp.selling_price, sp.promotional_product, sp.products_number FROM "Product" p INNER JOIN "Store_Product" sp ON p.id_product = sp.id_product ORDER BY ${orderBy};`)
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});



app.get('/get-store-product-sales/:upc', (req, res) => {
    const upc = req.params.upc;
    db.any('SELECT * FROM (("Sale" INNER JOIN "Store_Product" ON "Sale".upc = "Store_Product".upc) INNER JOIN "Product" ON "Store_Product".id_product = "Product".id_product) WHERE "Store_Product".upc = $1;', [upc])
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});
app.delete('/delete-store-product/:id', (req, res) => {
    const idProd = req.params.id;
    db.any('DELETE FROM "Store_Product" WHERE id_product = $1;', [idProd])
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            console.error('Error deleting product:', error.message);
            res.status(500).json({ error: error.message });
        });
});

app.put('/update-store-products/:id', (req, res) => {
    const productUpc = req.params.id;
    const { upc, selling_price, promotional_product, products_number } = req.body;

    let upc_prom = null;

    if (promotional_product === 'false') {
        upc_prom = null;
    } else {
        upc_prom = req.body.upc_prom;
    }

    const updateQuery = 'UPDATE "Store_Product" SET upc = $1, upc_prom = $2, selling_price = $3, promotional_product = $4, products_number = $5 WHERE upc = $6;';
    const queryParams = [upc, upc_prom, selling_price, promotional_product, products_number, productUpc];

    db.none(updateQuery, queryParams)
        .then(() => {
            res.json({ message: 'Store product updated successfully' });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

app.get('/get-all-upc-by-product-id/:id', (req, res) => {
    const productId = req.params.id;
    db.any('SELECT upc FROM "Store_Product" WHERE id_product = $1', [productId])
        .then(upcList => {
            const upcOptions = upcList.map(upc => upc.upc);
            res.json(upcOptions);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});


app.get('/get-all-upc', (req, res) => {
    db.any('SELECT DISTINCT upc FROM "Store_Product"')
        .then(upcList => {
            const upcOptions = upcList.map(upc => upc.upc);
            res.json(upcOptions);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});
app.get('/get-all-product-ids', (req, res) => {
    db.any('SELECT id_product FROM "Product"')
        .then(productIds => {
            res.json(productIds);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});
app.post('/add-store-product', (req, res) => {
    const { productId, upc, upcProm, sellingPrice, promotionalProduct, productsNumber } = req.body;

    let upc_prom = null;

    if (promotionalProduct === 'false') {
        upc_prom = null;
    } else {
        upc_prom = upcProm;
    }

    const insertQuery = 'INSERT INTO "Store_Product" (id_product, upc, upc_prom, selling_price, promotional_product, products_number) VALUES ($1, $2, $3, $4, $5, $6);';
    const queryParams = [productId, upc, upc_prom, sellingPrice, promotionalProduct, productsNumber];

    db.none(insertQuery, queryParams)
        .then(() => {
            res.json({ message: 'Store product added successfully' });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});


app.get('/get-store-products-by-date-period', (req, res) => {
    const { startDate, endDate } = req.query;

    db.any(`
        SELECT
            p.*, sp.upc, sp.upc_prom, sp.selling_price, sp.promotional_product, sp.products_number,
            c.print_date
        FROM
            "Product" p
        INNER JOIN
            "Store_Product" sp ON p.id_product = sp.id_product
        INNER JOIN
            "Sale" s ON sp.upc = s.upc
        INNER JOIN
                
            "Check" c ON s.check_number = c.check_number
        WHERE
           DATE(c.print_date )>= $1 AND DATE(c.print_date) <= $2
    `, [startDate, endDate])
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});














/*
* *
* *
* *
* *
* *
* *
port
* *
* *
* *
* *
* *
* *
 */
const PORT = 8081
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
