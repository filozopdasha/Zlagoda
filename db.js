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

