import { useEffect, useState } from "react";
import "./User.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function User() {
  const [value, setValue] = useState("1");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [firstnameError, setFirstNameError] = useState("");
  const [lastnameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [accessLevels, setAccessLevels] = useState([]);

  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [editedAccessLevels, setEditedAccessLevels] = useState([]);

  const fetchUserRoles = async () => {
    try {
      const result = await fetch("http://localhost:3001/users-roles");
      if (!result.ok) throw new Error("Failed to fetch user roles");
      const data = await result.json();

      const formattedData = data.map((role) => ({
        ...role,
        accessLevels: Array.isArray(role.accessLevels)
          ? role.accessLevels
          : JSON.parse(role.accessLevels || "[]"),
      }));
      setUserRoles(formattedData);
    } catch (error) {
      setError("Error in fetching user roles");
      console.error("Fetching error:", error);
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRole = {
      userRole,
      accessLevels,
    };

    try {
      const response = await fetch("http://localhost:3001/users-roles/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRole),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to add user role: ${errorMessage}`);
      }

      fetchUserRoles();
      setUserRole("");
      setAccessLevels([]);
    } catch (error) {
      console.error("Submission error:", error.message);
    }
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    if (editingRoleId) {
      setEditedAccessLevels((prev) =>
        e.target.checked
          ? [...prev, value]
          : prev.filter((level) => level !== value)
      );
    } else {
      setAccessLevels((prev) =>
        e.target.checked
          ? [...prev, value]
          : prev.filter((level) => level !== value)
      );
    }
  };

  const handleEditClickRole = (role) => {
    setEditingRoleId(role.id);
    setEditedRole(role.userRole);
    setEditedAccessLevels(role.accessLevels);
  };

  const handleUpdateAccessLevels = async (e) => {
    e.preventDefault();
    const formattedAccessLevels = JSON.stringify(editedAccessLevels);

    const updatedRole = {
      userRole: editedRole,
      accessLevels: formattedAccessLevels,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/users-roles/${editingRoleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRole),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update user role: ${errorMessage}`);
      }

      fetchUserRoles();
      setEditingRoleId(null);
      setEditedRole("");
      setEditedAccessLevels([]);
    } catch (error) {
      console.error("Update error:", error.message);
    }
  };

  const handleDeleteUserRole = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/users-roles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete user role: ${errorMessage}`);
      }

      fetchUserRoles();
    } catch (error) {
      console.error("Deletion error:", error.message);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError("Error fetching users");
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    let isValid = true;
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setError("");

    if (!firstName) {
      setFirstNameError("First name is required");
      isValid = false;
    }
    if (!lastName) {
      setLastNameError("Last name is required");
      isValid = false;
    }
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email address is invalid");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }
    if (!role) {
      setError("Role is required");
      isValid = false;
    }
    if (!contactNumber) {
      setError("Contact number is required");
      isValid = false;
    } else if (!/^\d{11}$/.test(contactNumber)) {
      setError("Contact number must be 11 digits");
      isValid = false;
    }

    return isValid;
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setPassword("");
    setRole(user.role);
    setContactNumber(user.contactNumber);
    setRemarks(user.remarks);
    setValue("2");
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    const updatedUser = {
      firstName,
      lastName,
      email,
      password,
      role,
      contactNumber,
      remarks,
    };

    console.log("Updating user with data:", updatedUser);

    try {
      const response = await fetch(
        `http://localhost:3001/users/${editingUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      console.log("Response status:", response.status);

      if (response.ok) {
        console.log("User updated successfully");
        const updatedUsers = users.map((user) =>
          user.id === editingUserId ? { ...user, ...updatedUser } : user
        );
        setUsers(updatedUsers);

        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setRole("");
        setContactNumber("");
        setRemarks("");
        setEditingUserId(null);
        setValue("1");
      } else {
        const errorText = await response.text();
        setError(`Failed to update user details: ${errorText}`);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError("An error occurred while updating user details");
    }
  };

  const collectData = async () => {
    if (!validateForm()) {
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      contactNumber,
      remarks,
    };

    try {
      const response = await fetch("http://localhost:3001/users/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("User details added successfully");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setRole("");
        setContactNumber("");
        setRemarks("");
        fetchData();
        setValue("1");
      } else {
        setError("Failed to add user details");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An error occurred while adding user details");
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("User deleted successfully");
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
      } else {
        const errorText = await response.text();
        setError(`Failed to delete user: ${errorText}`);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("An error occurred while deleting user");
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="users">
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab className="tabHeading" label="Users" value="1" />
              <Tab
                className="tabHeading"
                label={editingUserId ? "Edit User" : "Add User"}
                value="2"
              />
              <Tab className="tabHeading" label="Manage Role" value="3" />
            </TabList>
          </Box>
          <TabPanel className="tabOne" value="1">
            <div className="usersTable">
              <table className="userTable">
                <thead>
                  <tr>
                    <th className="tableHeader">First Name</th>
                    <th className="tableHeader">Last Name</th>
                    <th className="tableHeader">Email</th>
                    <th className="tableHeader">Role</th>
                    <th className="tableHeader">Contact Number</th>
                    <th className="tableHeader">Text</th>
                    <th className="tableHeader">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, Index) => (
                    <tr key={Index}>
                      <td className="tableCell">
                        <div className="firstName rowData">
                          <span>{user.firstName}</span>
                        </div>
                      </td>
                      <td className="tableCell">
                        <div className="lastName rowData">
                          <span>{user.lastName}</span>
                        </div>
                      </td>
                      <td className="tableCell">
                        <div className="email rowData">
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="tableCell">
                        <div className="role rowData">
                          <span>{user.role}</span>
                        </div>
                      </td>
                      <td className="tableCell">
                        <div className="contactNumber rowData">
                          <span>{user.contactNumber}</span>
                        </div>
                      </td>
                      <td className="tableCell">
                        <div className="remarks rowData">
                          <span>{user.remarks}</span>
                        </div>
                      </td>
                      <td className="tableCell">
                        <button
                          className="editBtn"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="deleteBtn"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>
          <TabPanel value="2">
            <form>
              <div className="formDiv">
                <div className="formInnerDiv">
                  <label className="formLabel">First Name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    className="formInput"
                  />
                  {firstnameError && <p className="error">{firstnameError}</p>}
                </div>
                <div className="formInnerDiv">
                  <label className="formLabel">Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    className="formInput"
                  />
                  {lastnameError && <p className="error">{lastnameError}</p>}
                </div>
                <div className="formInnerDiv">
                  <label className="formLabel">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="formInput"
                  />
                  {emailError && <p className="error">{emailError}</p>}
                </div>
              </div>
              <div className="formDiv">
                <div className="formInnerDiv">
                  <label className="formLabel">Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="formInput"
                  />
                  {passwordError && <p className="error">{passwordError}</p>}
                </div>
                <div className="formInnerDiv">
                  <label className="formLabel">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="formInput"
                  >
                    <option value="">Select Role</option>
                    {userRoles.map((role) => (
                      <option key={role.id} value={role.userRole}>
                        {role.userRole}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="formInnerDiv">
                  <label className="formLabel">Contact Number</label>
                  <input
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    type="text"
                    className="formInput"
                  />
                </div>
              </div>
              <div className="formDiv">
                <div className="formInnerDiv">
                  <label className="formLabel">Text</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    name="textarea"
                    className="formInput"
                  ></textarea>
                </div>
              </div>
              <div className="userBtnDiv">
                <button
                  onClick={editingUserId ? handleUpdate : collectData}
                  className="userBtn"
                  type="button"
                >
                  {editingUserId ? "Update Details" : "Submit Details"}
                </button>
                {error && <p className="error">{error}</p>}
              </div>
            </form>
          </TabPanel>
          <TabPanel value="3">
            <div className="userRoles">
              <div className="rolesTableDiv">
                <h3 className="tableTitle"></h3>
                <table className="rolesTable">
                  <thead>
                    <tr>
                      <th>User Roles</th>
                      <th>Access Level</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRoles.map((role) => (
                      <tr key={role.id}>
                        <td>{role.userRole}</td>
                        <td>
                          {Array.isArray(role.accessLevels)
                            ? role.accessLevels.join(", ")
                            : "No Access"}
                        </td>
                        <td>
                          <button
                            className="editBtn"
                            onClick={() => handleEditClickRole(role)}
                          >
                            Edit
                          </button>
                          <button
                            className="deleteBtn"
                            onClick={() => handleDeleteUserRole(role.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <form
                className="rolesForm"
                onSubmit={
                  editingRoleId ? handleUpdateAccessLevels : handleSubmit
                }
              >
                <div className="formDiv">
                  <div className="formInnerDiv">
                    <label className="formLabel">Role Name</label>
                    <input
                      type="text"
                      className="formInput"
                      value={editingRoleId ? editedRole : userRole}
                      onChange={(e) =>
                        editingRoleId
                          ? setEditedRole(e.target.value)
                          : setUserRole(e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Access Level</label>
                    <div className="checkboxGroup">
                      <label>
                        <input
                          type="checkbox"
                          value="all"
                          onChange={handleCheckboxChange}
                          checked={
                            editingRoleId
                              ? editedAccessLevels.includes("all")
                              : accessLevels.includes("all")
                          }
                        />{" "}
                        All Access
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="view-users"
                          onChange={handleCheckboxChange}
                          checked={
                            editingRoleId
                              ? editedAccessLevels.includes("view-users")
                              : accessLevels.includes("view-users")
                          }
                        />{" "}
                        View Users
                      </label>
                    </div>
                  </div>
                </div>
                <div className="rolesBtnDiv">
                  <button className="rolesBtn" type="submit">
                    {editingRoleId ? "Update Role" : "Submit Role"}
                  </button>
                </div>
              </form>
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default User;
