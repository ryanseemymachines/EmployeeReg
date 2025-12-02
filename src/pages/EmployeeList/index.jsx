import {
  getEmployee,
  getEmployeeById,
  deleteEmployee,
} from "../../redux/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import styles from "./index.module.css";

const Employeelist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteSelectedEmployee, setDeleteSelectedEmployee] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employees } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(getEmployee());
  }, [dispatch]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const handleEdit = async (employeeId) => {
    const result = await dispatch(getEmployeeById(employeeId));
    if (result.success) navigate(`/employee/edit/${employeeId}`);
  };

  const handleDelete = (emp) => {
    setDeleteSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteEmployee(deleteSelectedEmployee.employeeId));
    dispatch(getEmployee());
    setIsModalOpen(false);
  };

  const employeeList = employees || [];

  const filteredEmployees = employeeList.filter(
    (emp) =>
      `${emp.fname} ${emp.lname}`.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search) ||
      emp.designation.toLowerCase().includes(search)
  );

  return (
    <div className={styles.container}>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h1>Confirm Deletion</h1>

        <h3>
          Are you sure you want to delete employee
          <strong>
            {" "}
            "{deleteSelectedEmployee?.fname} {deleteSelectedEmployee?.lname}"
          </strong>
          ?
        </h3>

        <div className={styles.modalActions}>
          <Button onClick={confirmDelete} btnStyle="regBtn" label="Confirm" />
          <Button
            onClick={() => setIsModalOpen(false)}
            btnStyle="regBtn"
            label="Cancel"
          />
        </div>
      </Modal>

      <div className={styles.searchBox}>
        <Input
        inputStyle="searchInput"
          type="search"
          value={searchInput}
          onChange={(e) => {
            const value = e.target.value;
            setSearchInput(value);

            if (value.trim() === "") {
              setSearch("");
            }
          }}
          placeholder="Search for employee name, email or designation"
        />

        <Button
          label="Search"
          btnStyle="regBtn"
          onClick={() => setSearch(searchInput.toLowerCase())}
        />
      </div>

      {filteredEmployees.length > 0 ? (
        <table className={styles.employeeTable}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.headerData}>Name</th>
              <th className={styles.headerData}>Designation</th>
              <th className={styles.headerData}>Date of Join</th>
              <th className={styles.headerData}>Experience</th>
              <th className={styles.headerData}>Email</th>
              <th className={styles.headerData}>Date of Birth</th>
              <th className={styles.headerData}>Phone Number</th>
              <th className={styles.headerActionData}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.employeeId} className={styles.dataRow}>
                <td className={styles.tableData}>
                  {emp.fname} {emp.lname}
                </td>
                <td className={styles.tableData}>{emp.designation}</td>
                <td className={styles.tableData}>{formatDate(emp.doj)}</td>
                <td className={styles.tableData}>{emp.experience}</td>
                <td className={styles.tableData}>{emp.email}</td>
                <td className={styles.tableData}>{formatDate(emp.dob)}</td>
                <td className={styles.tableData}>{emp.phoneNumber}</td>
                <td className={styles.actionBtnCell}>
                  <ul className={styles.actionBtns}>
                    <li
                      onClick={() => handleEdit(emp.employeeId)}
                      className={styles.editBtn}
                    >
                      Edit
                    </li>
                    <li
                      onClick={() => handleDelete(emp)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees found</p>
      )}
    </div>
  );
};

export default Employeelist;
