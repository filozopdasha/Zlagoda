import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import './EmployeePageStyles.css';
import MenuBar from "../MenuBar/MenuBar";
import { NavLink, useNavigate } from "react-router-dom";

const EmployeePage = () => {
    const navigate = useNavigate();

    const [fetchError, setFetchError] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("id_employee");
    const [sortOrder, setSortOrder] = useState("asc");
    const [showPopup, setShowPopup] = useState(false);
    const [popupEmployee, setPopupEmployee] = useState(null);
    const [showCashiers, setShowCashiers] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            let query = supabase.from('Employee').select();
            if (sortBy) query = query.order(sortBy, { ascending: sortOrder === "asc" });
            const { data, error } = await query;
            if (error) {
                setFetchError('Could not fetch the employees');
                setEmployee(null);
                console.log(error);
            }
            if (data) {
                console.log(data);
                setEmployee(data);
                setFetchError(null);
                console.log(data);
            }
        };

        fetchEmployee();
    }, [sortBy, sortOrder, showCashiers]);

    const handleDeleteEmployee = async (employeeId) => {
        const {data, error} = await supabase
            .from("Employee")
            .delete()
            .eq('id_employee', employeeId)
            .select();

        if(error){
            console.log(error);
        }
        if(data){
            console.log(data);
            setEmployee(prevEmployee => {
                return prevEmployee.filter(pr => pr.id_employee !== employeeId);
            });
        }
    };

    const handleEditEmployee = async (employeeId) => {
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setSortBy("empl_surname");
    };

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(columnName);
            setSortOrder("asc");
        }
    };

    const handlePopup = async (employeeId) => {
        setShowPopup(true);
        const { data, error } = await supabase
            .from('Employee')
            .select('*')
            .eq('id_employee', employeeId)
            .single();
        if (error) {
            console.error('Error fetching employee details:', error.message);
            return;
        }
        setPopupEmployee(data);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setPopupEmployee(null);
    };

    const handleToggleCashiers = () => {
        setShowCashiers(prevState => !prevState);
    };
    const showAllButtonText = showCashiers ? "Show All" : "Show Cashiers";


    let filteredEmployee = employee ? employee.filter(employee =>
        (showCashiers ? employee.empl_role === "Cashier" : true) &&
        (employee.empl_surname.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
            employee.category_number === parseInt(searchQuery))
    ) : [];


    return (
        <div className="employees page">
            <MenuBar/>
            {fetchError && (<p>{fetchError}</p>)}
            <input
                type="text"
                placeholder="Search employee by surname..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-bar-employee"
            />
            <div className="add-employee-container">
                <button className="add-employee-button">
                    <NavLink to="/add-employee" className="add-employee-text">Add Employee</NavLink>
                </button>
                <button className="toggle-cashiers-button add-employee-button" onClick={handleToggleCashiers}>
                    {showAllButtonText}
                </button>
            </div>


            {showPopup && popupEmployee && (
                <>
                    <div className="overlay"></div>
                    <div className="popup-container">
                        <div className="popup">
                            <div className="popup-content">
                                <span className="close" onClick={handleClosePopup}>&times;</span>
                                <h2>Employee Details</h2>
                                <p><strong>ID:</strong> {popupEmployee.id_employee}</p>
                                <p><strong>Surname:</strong> {popupEmployee.empl_surname}</p>
                                <p><strong>Name:</strong> {popupEmployee.empl_name}</p>
                                <p><strong>Patronymic:</strong> {popupEmployee.empl_patronymic}</p>
                                <p><strong>Role:</strong> {popupEmployee.empl_role}</p>
                                <p><strong>Salary:</strong> {popupEmployee.salary}</p>
                                <p><strong>Date of Birth:</strong> {popupEmployee.date_of_birth}</p>
                                <p><strong>Date of Start:</strong> {popupEmployee.date_of_start}</p>
                                <p><strong>Phone Number:</strong> {popupEmployee.phone_number}</p>
                                <p><strong>City:</strong> {popupEmployee.city}</p>
                                <p><strong>Street:</strong> {popupEmployee.street}</p>
                                <p><strong>Zip Code:</strong> {popupEmployee.zip_code}</p>
                                {}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {filteredEmployee.length > 0 && (
                <div className="employees">
                    <div style={{width: '80%', margin: '0 auto'}}>
                        <table className="employee-table">
                            <thead>
                            <tr>
                                <th className="title-employee" title="Sort by ID" onClick={() => handleSort("id_employee")}>ID
                                </th>
                                <th className="title-employee" title="Sort by Employee Surname"
                                    onClick={() => handleSort("empl_surname")}>Employee Surname
                                </th>
                                <th className="title-employee" title="Sort by Employee Name"
                                    onClick={() => handleSort("empl_name")}>Employee Name
                                </th>
                                <th className="title-employee" title="Sort by Employee role"
                                    onClick={() => handleSort("empl_role")}>Employee role
                                </th>
                                <th className="space"></th>
                                <th className="title-employee" title="Sort by Employee Phone Number"
                                    onClick={() => handleSort("phone_number")}>Phone Number
                                </th>
                                <th className="title-employee" title="Sort by Employee Phone City"
                                    onClick={() => handleSort("city")}>City
                                </th>
                                <th className="title-employee" title="Sort by Employee Street"
                                    onClick={() => handleSort("street")}>Street
                                </th>

                                <th className="title-employee" title="⛌"></th>
                                <th className="title-employee" title="✎"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredEmployee.map(employee => (
                                <tr key={employee.id_employee}>
                                    <td className="employee-data" onClick={() => handlePopup(employee.id_employee)}>{employee.id_employee}</td>
                                    <td className="employee-data">{employee.empl_surname}</td>
                                    <td className="employee-data">{employee.empl_name}</td>
                                    <td className="employee-data">{employee.empl_role}</td>
                                    <td className="space"></td>
                                    <td className="employee-data">{employee.phone_number}</td>
                                    <td className="employee-data">{employee.city}</td>
                                    <td className="employee-data">{employee.street}</td>
                                    <td className="employee-data delete-employee">
                                        <button
                                            className="delete-employee title-employee"
                                            title="Remove employee"
                                            onClick={() => handleDeleteEmployee(employee.id_employee)}>⛌
                                        </button>
                                    </td>
                                    <td className="employee-data edit-employee">
                                        <button
                                            className="edit-employee title-employee"
                                            title="Edit employee">
                                            <NavLink to={"/employees/" + employee.id_employee}
                                                     className="add-employee-text">✎</NavLink>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {filteredEmployee.length === 0 && <div className="error-message"><h2>No products found.</h2></div>}
            {filteredEmployee.length !== 0 &&
                <footer className="footer">
                    <div className="contact-info">
                        <hr></hr>
                        <p>Contact us:</p>
                        <p>Email: yu.skip@ukma.edu.ua</p>
                        <p>Email: d.filozop@ukma.edu.ua</p>
                        <p>Phone: +1234567890</p>
                    </div>
                </footer>}
        </div>
    );
};

export default EmployeePage;
