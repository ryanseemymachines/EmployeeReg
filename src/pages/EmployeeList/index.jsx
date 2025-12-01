import { getEmployee, deleteEmployee } from "../../redux/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import styles from "./index.module.css";

const Employeelist = () => {
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

  const handleDelete = async (id) => {
    await dispatch(deleteEmployee(id));
    dispatch(getEmployee());
  };

  const employeeList = employees || [];

  return (
    <div className={styles.container}>
      {employeeList.length > 0 ? (
        <table className={styles.employeeTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Date of Join</th>
              <th>Experience (yrs)</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employeeList.map((emp) => (
              <tr key={emp.employeeId}>
                <td>
                  {emp.fname} {emp.lname}
                </td>
                <td>{emp.designation}</td>
                <td>{formatDate(emp.doj)}</td>
                <td>{emp.experience}</td>
                <td>{emp.email}</td>
                <td>{formatDate(emp.dob)}</td>
                <td>{emp.phoneNumber}</td>
                <td>
                  <ul className={styles.actionBtns}>
                    <li onClick={() => alert("Edit " + emp.employeeId)}>
                      Edit
                    </li>
                    <li onClick={() => handleDelete(emp.employeeId)}>Delete</li>
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
