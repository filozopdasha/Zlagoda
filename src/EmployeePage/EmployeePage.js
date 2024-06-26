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
    const [showHiddenTable, setShowHiddenTable] = useState(false);


    const [showBest, setShowBest] = useState(false);
    const [inputActive, setInputActive] = useState(false);
    const [inputText, setInputText] = useState('');
    const [shifts, setShifts] = useState(false);


    const [role, setRole] = useState('');
    const [id, setId] = useState('');
    const [showTopCashiers, setShowTopCashiers] = useState(false);

    useEffect(() => {
        if (showTopCashiers) {
            fetchTopCashiers();
        } else {
            fetchEmployee();
        }
    }, [showTopCashiers]);

    const fetchTopCashiers = async () => {
        try {
            const response = await fetch(`http://localhost:8081/find-cashier-serving-all-customers-with-card`);
            if (!response.ok) {
                throw new Error('Could not fetch top cashiers');
            }
            const data = await response.json();
            setEmployee(data);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setEmployee(null);
        }
    };

    const handleToggleTopCashiers = () => {
        setShowTopCashiers(prevState => !prevState);
    };

    const showTopCashiersButtonText = showTopCashiers ? "Show All Employees" : "Show Top Cashiers";


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
        fetchEmployee();
    }, [sortBy, sortOrder, showCashiers]);

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
        if (e.key === 'Enter') {
            if(searchQuery!==''){
                fetchSearchSurnames(e.target.value)
            }else {
                fetchEmployee()
            }
            setSortBy("empl_surname");
        }
    };


    const fetchSearchSurnames= async (search) => {
        try {
            const response = await fetch(`http://localhost:8081/search-employees-by-surname?search=${search}&sortBy=${"id_employee"}&sortOrder=${sortOrder}`);
            if (!response.ok) {
                throw new Error('Could not fetch the employees');
            }
            const data = await response.json();
            setEmployee(data);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setEmployee(null);
        }
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


    const fetchBestCashiers = async () => {
        try {
            const response = await fetch(`http://localhost:8081/get-best-worker`);
            if (!response.ok) {
                throw new Error('Could not fetch best cashier');
            }
            const data = await response.json();
            setEmployee(data);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setEmployee(null);
        }
    };
    const handleShowBest = () =>{
        setShowBest(prevState => !prevState)
        if(!showBest){
            fetchBestCashiers()
        }else{
            fetchEmployee()
        }
    }
    const showBestButtonText = showBest ? "Show All" : "All-shifts cashiers";



    const fetchWorkDays = async () => {
        try {
            const month = inputText;
            const response = await fetch(`http://localhost:8081/get-work-days-in-month?month=${month}`);
            if (!response.ok) {
                throw new Error('Could not fetch shifts');
            }
            const data = await response.json();
            setEmployee(data);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setEmployee(null);
        }
    };


    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleInputActivation = () => {
        setInputActive(true);
    };

    const handleSearchMonth = () => {
        setShifts(true)
        fetchWorkDays(inputText)
    };

    const handleCancelSearchMonth = () => {
        setShifts(false)
        setInputActive(false);
        setInputText('');
        fetchEmployee()
    }

    const handlePrint = () => {
        setShowHiddenTable(true);
        window.print();
        setShowHiddenTable(false);
    };

    let filteredEmployee = employee ? employee.filter(employee =>
        (showCashiers ? employee.empl_role === "Cashier" : true) &&
        //(employee.empl_surname.toLowerCase().startsWith(searchQuery.toLowerCase())
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
            <div id="menuBarWrapper">
                <MenuBar/>
            </div>
            {fetchError && (<p>{fetchError}</p>)}
            {role === "Manager" && (
                <input
                    type="text"
                    placeholder="Search employee by surname..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                    className="search-bar-employee"
                />
            )}
            {role === "Manager" && (
                <div className="add-employee-container">

                    <button className="add-employee-button">
                        <NavLink to="/add-employee" className="add-employee-text">Add Employee</NavLink>
                    </button>

                    <button className="toggle-cashiers-button add-employee-button" onClick={handleToggleTopCashiers}>
                        {showTopCashiersButtonText} {}
                    </button>

                    <button className="toggle-cashiers-button add-employee-button" onClick={handleToggleCashiers}>
                        {showAllButtonText}
                    </button>

                    <button className="toggle-cashiers-button add-employee-button" onClick={handleShowBest}>
                        {showBestButtonText}
                    </button>


                    {!inputActive && (
                        <button className="add-employee-button" onClick={handleInputActivation}>Shifts per
                            month</button>
                    )}
                    {inputActive && (
                        <select onChange={handleInputChange} value={inputText} className="date-bar-employee">
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>)}
                    {inputActive && (
                        <button className="add-employee-button" onClick={handleSearchMonth}>Search</button>
                    )}
                    {inputActive && (
                        <button className="add-employee-button" onClick={handleCancelSearchMonth}>Cancel</button>
                    )}
                    {role === "Manager" && !shifts &&(<button onClick={handlePrint} className="print-button">Print</button>)}
                </div>)}


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
                                        <th className="title-employee" title="Sort by ID"
                                            onClick={() => handleSort("id_employee")}>ID
                                        </th>
                                        <th className="title-employee" title="Sort by Employee Surname"
                                            onClick={() => handleSort("empl_surname")}>Employee Surname
                                        </th>
                                        <th className="title-employee" title="Sort by Employee Name"
                                            onClick={() => handleSort("empl_name")}>Employee Name
                                        </th>
                                        {!shifts && (
                                            <th className="title-employee" title="Sort by Employee role"
                                                onClick={() => handleSort("empl_role")}>Employee role
                                            </th>
                                        )}
                                        {!shifts && (<th className="space"></th>)}
                                        <th className="title-employee" title="Sort by Employee Phone Number"
                                            onClick={() => handleSort("phone_number")}>Phone Number
                                        </th>
                                        {shifts && (
                                            <th className="title-employee" title="Number of shifts per month"
                                                onClick={() => handleSort("worked_days")}>Worked days
                                            </th>
                                        )}
                                        {shifts && (
                                            <th className="title-employee" title="Number of total sales"
                                                onClick={() => handleSort("total_sales")}>Total sales
                                            </th>
                                        )}
                                        {!shifts && (<th className="title-employee" title="Sort by Employee Phone City"
                                                         onClick={() => handleSort("city")}>City
                                        </th>)}
                                        {!shifts && (<th className="title-employee" title="Sort by Employee Street"
                                                         onClick={() => handleSort("street")}>Street
                                        </th>)}

                                        {role === "Manager" && !shifts && (
                                            <th className="title-employee" title="⛌"></th>
                                        )}
                                        {role === "Manager" && !shifts && (
                                            <th className="title-employee" title="✎"></th>
                                        )}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredEmployee.map(employee => (
                                        <tr key={employee.id_employee}>
                                            <td className={id === employee.id_employee ? 'highlighted-row employee-data' : 'employee-data'}
                                                onClick={() => handlePopup(employee.id_employee)}>{employee.id_employee}</td>
                                            <td className={id === employee.id_employee ? 'highlighted-row employee-data' : 'employee-data'}>{employee.empl_surname}</td>
                                            <td className={id === employee.id_employee ? 'highlighted-row employee-data' : 'employee-data'}>{employee.empl_name}</td>
                                            {!shifts && (
                                                <td className={id === employee.id_employee ? 'highlighted-row employee-data' : 'employee-data'}>{employee.empl_role}</td>)}
                                            {!shifts && (<td className="space"></td>)}
                                            <td className={id === employee.id_employee ? 'highlighted-row employee-data' : 'employee-data'}>{employee.phone_number}</td>
                                            {shifts && (
                                                <td className={id === employee.id_employee ? 'highlighted-row employee-data' : 'employee-data'}>{employee.worked_days}</td>)}
                                            {shifts && (
                                                <td className={id === employee.id_employee ? 'highlighted-row employee-data' : 'employee-data'}>{employee.total_sales}</td>)}
                                            {!shifts && (
                                                <td className={id === employee.id_employee ? 'highlighted-row employee-data' : 'employee-data'}>{employee.city}</td>)}
                                            {!shifts && (
                                                <td className={id === employee.id_employee ? 'highlighted-row employee-data' : 'employee-data'}>{employee.street}</td>)}
                                            {role === "Manager" && !shifts && id !== employee.id_employee && (
                                                <td className="employee-data delete-employee">
                                                    <button
                                                        className="delete-employee title-employee"
                                                        title="Remove employee"
                                                        onClick={() => handleDeleteEmployee(employee.id_employee)}>⛌
                                                    </button>
                                                </td>
                                            )}
                                            {role === "Manager" && !shifts && id === employee.id_employee && (
                                                <td className="employee-data ">
                                                </td>
                                            )}
                                            {role === "Manager" && !shifts && (
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
                            <button
                                className="edit-employee title-employee"
                                title="Edit employee">
                                <NavLink to={"/employees/" + employee.id_employee}
                                         className="add-employee-text edit-profile">Change password</NavLink>
                            </button>
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
            <div className="hidden-table-empl" style={{display: showHiddenTable ? 'block' : 'none'}}>
                <table>
                    <thead>
                    <tr>
                        <th className="title-employee">ID
                        </th>
                        <th className="title-employee">Surname
                        </th>
                        <th className="title-employee">Name
                        </th>
                        <th className="title-employee">Patronymic
                        </th>
                        <th className="title-employee">Salary
                        </th>
                        <th className="title-employee">Date of Birth
                        </th>
                        <th className="title-employee">Date of Start
                        </th>
                        <th className="title-employee">Employee role
                        </th>
                        <th className="title-employee">Phone Number
                        </th>
                        <th className="title-employee">City
                        </th>
                        <th className="title-employee">Street
                        </th>
                        <th className="title-employee">Zip Code
                        </th>

                    </tr>
                    </thead>
                    <tbody>
                    {filteredEmployee.map(employee => (
                        <tr key={employee.id_employee}>
                            <td className="employee-data"
                                onClick={() => handlePopup(employee.id_employee)}>{employee.id_employee}</td>
                            <td className="employee-data">{employee.empl_surname}</td>
                            <td className="employee-data">{employee.empl_name}</td>
                            <td className="employee-data">{employee.empl_patronymic}</td>
                            <td className="employee-data">{employee.salary}</td>
                            <td className="employee-data">{employee.date_of_birth}</td>
                            <td className="employee-data">{employee.date_of_start}</td>
                            <td className="employee-data">{employee.empl_role}</td>
                            <td className="employee-data">{employee.phone_number}</td>
                            <td className="employee-data">{employee.city}</td>
                            <td className="employee-data">{employee.street}</td>
                            <td className="employee-data">{employee.zip_code}</td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeePage;
