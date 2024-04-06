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
    db.any('SELECT * FROM ((("Sale" INNER JOIN "Store_Product" ON "Sale".upc = "Store_Product".upc) INNER JOIN "Product" ON "Product".id_product = "Store_Product".id_product) INNER JOIN "Check" ON "Check".check_number = "Sale".check_number) LEFT JOIN "Customer_Card" ON "Customer_Card".card_number = "Check".card_number WHERE "Check".check_number = $1;', [checkNum])
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

