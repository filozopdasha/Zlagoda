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

