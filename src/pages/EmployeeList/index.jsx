import { getEmployee, deleteEmployee } from "../../redux/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import styles from "./index.module.css";
import Button from "../../components/Button";

const Employeelist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(getEmployee());
  }, [dispatch]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const handleDelete = (emp) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteEmployee(selectedEmployee.employeeId));
    dispatch(getEmployee());
    setIsModalOpen(false);
  };

  const employeeList = employees || [];

  return (
    <div className={styles.container}>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h1>Confirm Deletion</h1>

        <h3>
          Are you sure you want to delete employee 
          <strong>
            {" "}
            "{selectedEmployee?.fname} {selectedEmployee?.lname}"
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

      {employeeList.length > 0 ? (
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
            {employeeList.map((emp) => (
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
                      onClick={() => alert("Edit " + emp.employeeId)}
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
