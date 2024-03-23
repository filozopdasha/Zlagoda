import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import './AddEmployeePageStyles.css';

const AddEmployeePage = () => {
    const navigate = useNavigate();
    const [fetchError, setFetchError] = useState(null);
    const [categoryArray, setCategoryArray] = useState(null);
    const [formError, setFormError] = useState('');

    // Table attributes
    const [id, setId] = useState('');
  //  const [category, setCategory] = useState('');
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
 //   const [characteristics, setCharacteristics] = useState('');
  //  const [manufacturer, setManufacturer] = useState('');
    //const [formError, setFormError] = useState('');

    useEffect(() => {
        const fetchCategory = async () => {
            let query = supabase.from('Category').select();
            const { data, error } = await query;
            if (error) {
                setFetchError('Could not fetch the categories');
                setCategoryArray(null);
                console.log(error);
            }
            if (data) {
                setCategoryArray(data);
                setFetchError(null);
                console.log(data);
            }
        };

        fetchCategory();
    }, []);

    useEffect(() => {
        const fetchMaxId = async () => {
            const { data, error } = await supabase
                .from('Employee')
                .select('id_employee', { count: 'exact' })
                .order('id_employee', { ascending: false })
                .limit(1);

            if (error) {
                console.error('Error fetching max id:', error.message);
                return;
            }

            const maxId = data.length > 0 ? data[0].id_employee : 0;
            setId(maxId + 1);
        };

        fetchMaxId();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id ||  !emplName || !emplSurname || !emplPatronymic || !emplRole || !emplSalary || !dateOfBirth || !dateOfStart || !phoneNumber || !emplCity || !emplStreet || !zipCode) {
            setFormError("Please fill in all the fields correctly!");
            return;
        }

        const { data, error } = await supabase
            .from("Employee")
            .insert([{ id_employee:id, empl_name:emplName, empl_surname:emplSurname, empl_patronymic:emplPatronymic, empl_role:emplRole, salary:emplSalary, date_of_birth:dateOfBirth
            , date_of_start:dateOfStart, phone_number:phoneNumber, city:emplCity, street:emplStreet, zip_code:zipCode}]);

        if (error) {
            console.error('Error inserting employee:', error.message);
            setFormError("An error occurred while adding the employee. Please try again.");
            return;
        }

        navigate('/employees')
        console.log('Employee added successfully:', data);
    };

    const handleCancel = () => {
        navigate('/employees');
    };

    return (
        <div className="add-empoyee-form-container">
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
                        <button type="submit">Add employee</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeePage;
