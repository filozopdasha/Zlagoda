import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './AddEmployeePageStyles.css';
import { format } from 'date-fns';

const EditEmployeePage = () => {
    const {idempl} = useParams()
    const navigate = useNavigate();

    // Table attributes
    const [formError, setFormError] = useState('');
    const [emplName, setName] = useState('');
    const [emplSurname, setSurname] = useState('');
    const [emplPatronymic, setPatronymic] = useState('');
    const [emplRole, setRole] = useState('');
    const [emplSalary, setSalary] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [dateOfStart, setDateOfStart] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emplCity, setCity] = useState('');
    const [emplStreet, setStreet] = useState('');
    const [zipCode, setZipCode] = useState('');

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch(`http://localhost:8081/get-employees?sortBy=${"id_employee"}&sortOrder=${"ASC"}`);
                if (!response.ok) {
                    throw new Error('Could not fetch employees');
                }
                const data = await response.json();
                let empl = data ? data.find(data => data.id_employee === idempl) : null;

                const Birth = format(new Date(empl.date_of_birth), 'yyyy-MM-dd');
                const Start = format(new Date(empl.date_of_start), 'yyyy-MM-dd');
                setName(empl.empl_name);
                setSurname(empl.empl_surname);
                setPatronymic(empl.empl_patronymic);
                setRole(empl.empl_role);
                setSalary(empl.salary);
                setDateOfBirth(Birth);
                setDateOfStart(Start);
                setPhoneNumber(empl.phone_number);
                setCity(empl.city);
                setStreet(empl.street);
                setZipCode(empl.zip_code);
            }catch (error){
                console.error(error)
            }
        };
        fetchEmployee();
    }, [idempl]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emplName || !emplSurname || !emplPatronymic || !emplRole || !emplSalary || !dateOfBirth || !dateOfStart || !phoneNumber
        || !emplCity || !emplStreet || !zipCode) {
            setFormError("Please fill in all the fields correctly!");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8081/update-employee/${idempl}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    empl_name: emplName,
                    empl_surname: emplSurname,
                    empl_patronymic: emplPatronymic,
                    empl_role: emplRole,
                    salary: emplSalary,
                    date_of_birth: dateOfBirth,
                    date_of_start: dateOfStart,
                    phone_number: phoneNumber,
                    city: emplCity,
                    street: emplStreet,
                    zip_code: zipCode,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update employee');

            }

            navigate('/employees');
        } catch (error) {
            console.error('Error updating employee:', error.message);
        }
    };


    const handleCancel = () => {
        navigate('/employees');
    };

    return (
        <div className="add-employee-form-container">
            <div className="edit-employee-form">
                {formError && <p className="add-error-message">{formError}</p>}
                <h2 className="zlagoda-form">Zlagoda</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="empl_name">Employee Name:</label>
                    <input type="text"
                           id="empl_name"
                           value={emplName}
                           onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="empl_surname">Employee Surname:</label>
                    <input type="text"
                           id="empl_surname"
                           value={emplSurname}
                           onChange={(e) => setSurname(e.target.value)}
                    />
                    <label htmlFor="empl_patronymic">Employee Patronymic:</label>
                    <input type="text"
                           id="empl_patronymic"
                           value={emplPatronymic}
                           onChange={(e) => setPatronymic(e.target.value)}
                    />
                    <label htmlFor="empl_role">Employee Role:</label>
                    <input type="text"
                           id="empl_role"
                           value={emplRole}
                           onChange={(e) => setRole(e.target.value)}
                    />
                    <label htmlFor="salary">Salary:</label>
                    <input type="text"
                           id="salary"
                           value={emplSalary}
                           onChange={(e) => setSalary(e.target.value)}
                    />
                    <label htmlFor="date_of_birth">Date of Birth:</label>
                    <input type="date"
                           id="date_of_birth"
                           value={dateOfBirth}
                           onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                    <label htmlFor="date_of_start">Date of Start:</label>
                    <input type="date"
                           id="date_of_start"
                           value={dateOfStart}
                           onChange={(e) => setDateOfStart(e.target.value)}
                    />
                    <label htmlFor="phone_number">Phone Number:</label>
                    <input type="text"
                           id="phone_number"
                           value={phoneNumber}
                           onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <label htmlFor="city">City:</label>
                    <input type="text"
                           id="city"
                           value={emplCity}
                           onChange={(e) => setCity(e.target.value)}
                    />
                    <label htmlFor="street">Street:</label>
                    <input type="text"
                           id="street"
                           value={emplStreet}
                           onChange={(e) => setStreet(e.target.value)}
                    />
                    <label htmlFor="zip_code">Zip Code:</label>
                    <input type="text"
                           id="zip_code"
                           value={zipCode}
                           onChange={(e) => setZipCode(e.target.value)}
                    />
                    <div className="action-buttons">
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="submit">Edit employee</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEmployeePage;