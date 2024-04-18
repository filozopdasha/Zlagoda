import React, { useEffect, useState } from "react";
import './EmployeePageStyles.css';
import MenuBar from "../MenuBar/MenuBar";
import { NavLink, useNavigate } from "react-router-dom";

const EmployeePage = () => {

    const [fetchError, setFetchError] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("id_employee");
    const [sortOrder, setSortOrder] = useState("ASC");
    const [showPopup, setShowPopup] = useState(false);
    const [popupEmployee, setPopupEmployee] = useState(null);
    const [showCashiers, setShowCashiers] = useState(false);

    const [role, setRole] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedId = localStorage.getItem('id')
        if (storedRole) {
            setRole(storedRole);
        }
        if (storedId){
            setId(storedId);
        }
    }, []);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch(`http://localhost:8081/get-employees?sortBy=${sortBy}&sortOrder=${sortOrder}`);
                if (!response.ok) {
                    throw new Error('Could not fetch employees');
                }
                const data = await response.json();
                setEmployee(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setEmployee(null);
            }
        };
        fetchEmployee();
    }, [sortBy, sortOrder, showCashiers]);


    const handleDeleteEmployee = async (employeeId) => {
        try {
            const response = await fetch(`http://localhost:8081/delete-employee/${employeeId}`, {
                method: 'DELETE',
                mode:'cors'
            });
            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }
            setEmployee(prevEmployees => prevEmployees.filter(emp => emp.id_employee !== employeeId));
        } catch (error) {
            console.error('Error deleting employee:', error.message);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setSortBy("empl_surname");
    };

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
        } else {
            setSortBy(columnName);
            setSortOrder("ASC");
        }
    };

    const handlePopup = async (employeeId) => {
        setShowPopup(true);
        let popup = employee ? employee.find(employee => employee.id_employee === employeeId) : null;
        setPopupEmployee(popup);
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
            employee.category_number === parseInt(searchQuery)) &&
        (role === "Cashier" ? employee.id_employee === id : true)
    ) : [];

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    return (
        <div className="employees page">
            <MenuBar/>
            {fetchError && (<p>{fetchError}</p>)}
            {role === "Manager" && (
            <input
                type="text"
                placeholder="Search employee by surname..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-bar-employee"
            />
            )}
            <div className="add-employee-container">
                {role === "Manager" && (
                <button className="add-employee-button">
                    <NavLink to="/add-employee" className="add-employee-text">Add Employee</NavLink>
                </button>
                )}
                {role === "Manager" && (
                <button className="toggle-cashiers-button add-employee-button" onClick={handleToggleCashiers}>
                    {showAllButtonText}
                </button>
                )}
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

            {role === "Manager" && (
                <>
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

                                {role === "Manager" && (
                                    <th className="title-employee" title="⛌"></th>
                                )}
                                {role === "Manager" && (
                                <th className="title-employee" title="✎"></th>
                                )}
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
                                    {role === "Manager" && (
                                        <td className="employee-data delete-employee">
                                            <button
                                                className="delete-employee title-employee"
                                                title="Remove employee"
                                                onClick={() => handleDeleteEmployee(employee.id_employee)}>⛌
                                            </button>
                                        </td>
                                    )}
                                    {role === "Manager" && (
                                    <td className="employee-data edit-employee">
                                        <button
                                            className="edit-employee title-employee"
                                            title="Edit employee">
                                            <NavLink to={"/employees/" + employee.id_employee}
                                                     className="add-employee-text">✎</NavLink>
                                        </button>
                                    </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            </>
            )}
            {role === "Cashier" && (
                <>
                    {filteredEmployee.length === 0 && <div className="error-message"><h2>No products found.</h2></div>}
                    {filteredEmployee.length !== 0 && filteredEmployee.map(employee => (
                        <div key={employee.id_employee} className="profile-container">
                            <div className="profile-details">
                                <h2>{employee.empl_name} {employee.empl_patronymic} {employee.empl_surname}</h2>
                                <p><strong>ID:</strong> {employee.id_employee}</p>
                                <p><strong>Role:</strong> {employee.empl_role}</p>
                                <p><strong>Salary:</strong> {employee.salary}</p>
                                <p><strong>Date of Birth:</strong> {formatDate(employee.date_of_birth)}</p>
                                <p><strong>Date of Start:</strong> {formatDate(employee.date_of_start)}</p>
                                <p><strong>Phone Number:</strong> {employee.phone_number}</p>
                                <p><strong>Address:</strong> {employee.city}, {employee.street}, {employee.zip_code}</p>
                            </div>
                        </div>
                    ))}
                </>
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
