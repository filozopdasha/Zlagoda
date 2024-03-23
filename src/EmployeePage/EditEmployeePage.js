import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import './AddEmployeePageStyles.css';
import { format } from 'date-fns';

const EditEmployeePage = () => {
    const {idempl} = useParams()
    const navigate = useNavigate();

    // Table attributes
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
    const [formError, setFormError] = useState('');




    useEffect(() => {
        const fetchEmployee = async () => {
            const { data, error } = await supabase
                .from('Employee')
                .select('*')
                .eq('id_employee', idempl)
                .single();

            if (error) {
                console.error('Error fetching employee:', error.message);
                return;
            }
            if (data) {
                setName(data.empl_name);
                setSurname(data.empl_surname)
                setPatronymic(data.empl_patronymic)
                setRole(data.empl_role)
                setSalary(data.salary)
                setDateOfBirth(data.date_of_birth)
                setDateOfStart(data.date_of_start)
                setPhoneNumber(data.phone_number)
                setCity(data.city)
                setStreet(data.street)
                setZipCode(data.zip_code)

            }
        };

        fetchEmployee();
    }, [idempl]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emplName) {
            setFormError("Please fill in all the fields correctly!");
            return;
        }

        // Format date strings to 'YYYY-MM-DD' format
        const formattedDateOfBirth = format(new Date(dateOfBirth), 'yyyy-MM-dd');
        const formattedDateOfStart = format(new Date(dateOfStart), 'yyyy-MM-dd');

        const { data, error } = await supabase
            .from("Employee")
            .update({
                id_employee: idempl,
                empl_name: emplName,
                empl_surname: emplSurname,
                empl_patronymic: emplPatronymic,
                empl_role: emplRole,
                salary: emplSalary,
                date_of_birth: formattedDateOfBirth, // Use formatted date string
                date_of_start: formattedDateOfStart, // Use formatted date string
                phone_number: phoneNumber,
                city: emplCity,
                street: emplStreet,
                zip_code: zipCode
            })
            .eq('id_employee', idempl);

        if (error) {
            console.error('Error updating employee:', error.message);
            setFormError("An error occurred while updating employee. Please try again.");
            return;
        }

        navigate('/employees');
        console.log('Employee updated successfully:', data);
    };


    const handleCancel = () => {
        navigate('/employees');
    };

    return (
        <div className="add-employee-form-container">
            <div className="add-employee-form">
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
