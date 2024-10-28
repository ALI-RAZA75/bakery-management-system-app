import "./UserRoles.scss";
// import { useEffect, useState } from "react";

function UserRoles() {
  // const [userRoles, setUserRoles] = useState([]);
  // const [userRole, setUserRole] = useState("");
  // const [accessLevels, setAccessLevels] = useState([]);
  // const [error, setError] = useState("");
  // const [editingRoleId, setEditingRoleId] = useState(null);
  // const [editedRole, setEditedRole] = useState("");
  // const [editedAccessLevels, setEditedAccessLevels] = useState([]);


  


  // const fetchUserRoles = async () => {
  //   try {
  //     const result = await fetch("http://localhost:3001/users-roles");
  //     if (!result.ok) throw new Error("Failed to fetch user roles");
  //     const data = await result.json();

  //     const formattedData = data.map(role => ({
  //       ...role,
  //       accessLevels: Array.isArray(role.accessLevels)
  //         ? role.accessLevels
  //         : JSON.parse(role.accessLevels || "[]")
  //     }));
  //     setUserRoles(formattedData);
  //   } catch (error) {
  //     setError("Error in fetching user roles");
  //     console.error("Fetching error:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserRoles();
  // }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const newRole = {
  //     userRole,
  //     accessLevels,
  //   };

  //   try {
  //     const response = await fetch("http://localhost:3001/users-roles/add", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(newRole),
  //     });

  //     if (!response.ok) {
  //       const errorMessage = await response.text();
  //       throw new Error(`Failed to add user role: ${errorMessage}`);
  //     }

  //     fetchUserRoles();
  //     setUserRole("");
  //     setAccessLevels([]);
  //   } catch (error) {
  //     console.error("Submission error:", error.message);
  //   }
  // };

  // const handleCheckboxChange = (e) => {
  //   const value = e.target.value;
  //   if (editingRoleId) {

  //     setEditedAccessLevels((prev) =>
  //       e.target.checked
  //         ? [...prev, value]
  //         : prev.filter((level) => level !== value)
  //     );
  //   } else {

  //     setAccessLevels((prev) =>
  //       e.target.checked
  //         ? [...prev, value]
  //         : prev.filter((level) => level !== value)
  //     );
  //   }
  // };

  // const handleEditClick = (role) => {
  //   setEditingRoleId(role.id);
  //   setEditedRole(role.userRole);
  //   setEditedAccessLevels(role.accessLevels);
  // };

  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   const formattedAccessLevels = JSON.stringify(editedAccessLevels);

  //   const updatedRole = {
  //     userRole: editedRole,
  //     accessLevels: formattedAccessLevels,
  //   };

  //   try {
  //     const response = await fetch(`http://localhost:3001/users-roles/${editingRoleId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updatedRole),
  //     });

  //     if (!response.ok) {
  //       const errorMessage = await response.text();
  //       throw new Error(`Failed to update user role: ${errorMessage}`);
  //     }

  //     fetchUserRoles();
  //     setEditingRoleId(null);
  //     setEditedRole("");
  //     setEditedAccessLevels([]);
  //   } catch (error) {
  //     console.error("Update error:", error.message);
  //   }
  // };

  // const handleDelete = async (id) => {
  //   try {
  //     const response = await fetch(`http://localhost:3001/users-roles/${id}`, {
  //       method: "DELETE",
  //     });

  //     if (!response.ok) {
  //       const errorMessage = await response.text();
  //       throw new Error(`Failed to delete user role: ${errorMessage}`);
  //     }

  //     fetchUserRoles();
  //   } catch (error) {
  //     console.error("Deletion error:", error.message);
  //   }
  // };

  return (
    <div className="userRoles">
      {/* <form className="rolesForm" onSubmit={editingRoleId ? handleUpdate : handleSubmit}>
        <div className="formDiv">
          <div className="formInnerDiv">
            <label className="formLabel">Role Name</label>
            <input
              type="text"
              className="formInput"
              value={editingRoleId ? editedRole : userRole}
              onChange={(e) => (editingRoleId ? setEditedRole(e.target.value) : setUserRole(e.target.value))}
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
                  checked={editingRoleId ? editedAccessLevels.includes("all") : accessLevels.includes("all")}
                />{" "}
                All Access
              </label>
              <label>
                <input
                  type="checkbox"
                  value="view-users"
                  onChange={handleCheckboxChange}
                  checked={editingRoleId ? editedAccessLevels.includes("view-users") : accessLevels.includes("view-users")}
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

      <div className="rolesTableDiv">
        <h3 className="tableTitle">Users</h3>
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
                <td>{Array.isArray(role.accessLevels) ? role.accessLevels.join(", ") : "No Access"}</td>
                <td>
                  <button className="editBtn" onClick={() => handleEditClick(role)}>
                    Edit
                  </button>
                  <button className="deleteBtn" onClick={() => handleDelete(role.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}

export default UserRoles;
