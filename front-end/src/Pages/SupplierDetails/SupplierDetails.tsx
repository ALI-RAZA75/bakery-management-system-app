import { useEffect, useState } from "react";
import "./SupplierDetails.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../Components/dataTable/DataTable';

function SupplierDetails() {
  const [value, setValue] = useState("1");
  const [supplierCode, setSupplierCode] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierNumber, setSupplierNumber] = useState("");
  const [address, setAddress] = useState("");
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [debitAmount, setDebitAmount] = useState(0);
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonNumber, setContactPersonNumber] = useState("");
  const [supplierStatus, setSupplierStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null); 

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:3001/suppliers");
      if (!response.ok) throw new Error("Failed to fetch Suppliers");
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching Suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const validateSupplier = () => {
    const errors = {};

    if (!supplierCode.trim()) errors.supplierCode = "Supplier Code is required";
    if (!supplierName.trim()) errors.supplierName = "Supplier Name is required";
    if (!supplierNumber.trim()) errors.supplierNumber = "Supplier Number is required";
    if (!address.trim()) errors.address = "Address is required";
    if (isNaN(balanceAmount) || balanceAmount < 0) errors.balanceAmount = "Balance Amount must be a positive number";
    if (isNaN(debitAmount) || debitAmount < 0) errors.debitAmount = "Debit Amount must be a positive number";
    if (!contactPersonName.trim()) errors.contactPersonName = "Contact Person Name is required";
    if (!contactPersonNumber.trim()) errors.contactPersonNumber = "Contact Person Number is required";
    if (!supplierStatus.trim()) errors.supplierStatus = "Supplier Status is required";

    return errors;
  };

  const handleSubmitSupplier = async (e) => {
    e.preventDefault();

    const errors = validateSupplier();
    if (Object.keys(errors).length > 0) {
      console.error("Form validation errors:", errors);
      return;
    }

    const supplierData = {
      supplierCode,
      supplierName,
      supplierNumber,
      address,
      balanceAmount,
      debitAmount,
      contactPersonName,
      contactPersonNumber: contactPersonNumber.trim(),
      supplierStatus,
      notes
    };

    try {
      const response = await fetch(editingSupplier ? `http://localhost:3001/suppliers/${editingSupplier.id}` : "http://localhost:3001/suppliers/add", {
        method: editingSupplier ? "PUT" : "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplierData),
      });

      if (!response.ok) throw new Error(editingSupplier ? "Failed to update supplier" : "Failed to add supplier");

      const data = await response.json();
      console.log(data.message);
      fetchSuppliers();
      resetForm();
      setValue("1"); 
    } catch (error) {
      console.error("Error submitting supplier:", error);
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/suppliers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete supplier");
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handleEditSupplier = (supplier) => {
    setSupplierCode(supplier.supplierCode);
    setSupplierName(supplier.supplierName);
    setSupplierNumber(supplier.supplierNumber);
    setAddress(supplier.address);
    setBalanceAmount(supplier.balanceAmount);
    setDebitAmount(supplier.debitAmount);
    setContactPersonName(supplier.contactPersonName);
    setContactPersonNumber(supplier.contactPersonNumber);
    setSupplierStatus(supplier.supplierStatus);
    setNotes(supplier.notes);

    setEditingSupplier(supplier); 
    setValue("2"); 
  };

  const resetForm = () => {
    setSupplierCode("");
    setSupplierName("");
    setSupplierNumber("");
    setAddress("");
    setBalanceAmount(0);
    setDebitAmount(0);
    setContactPersonName("");
    setContactPersonNumber("");
    setSupplierStatus("");
    setNotes("");
    setEditingSupplier(null); 
    setValue("1"); 
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns: GridColDef[] = [
    {
      field: 'supplierCode',
      headerName: 'Supplier Code',
      flex: 1,
      type: 'string',
    },
    {
      field: 'supplierName',
      headerName: 'Supplier Name',
      flex: 1,
      type: 'string',
    },
    {
      field: 'supplierNumber',
      headerName: 'Phone Number',
      flex: 1,
      type: 'string',
    },
    {
      field: 'address',
      headerName: 'Address',
      type: 'string',
      flex: 1,
    },
    {
      field: 'balanceAmount',
      headerName: 'Balance Amount',
      type: 'number',
      flex: 1,
    },
    {
      field: 'debitAmount',
      headerName: 'Debit Amount',
      type: 'number',
      flex: 1,
    },
    {
      field: 'contactPersonName',
      headerName: 'Contact Person Name',
      type: 'string',
      flex: 1,
    },
    {
      field: 'contactPersonNumber',
      headerName: 'Contact Person Phone',
      type: 'string',
      flex: 1,
    },
    {
      field: 'supplierStatus',
      headerName: 'Supplier Status',
      type: 'string',
      flex: 1,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      flex: 1,
      type: 'string',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div>
          <button className="editBtn" onClick={() => handleEditSupplier(params.row)}>Edit</button>
          <button className="deleteBtn" onClick={() => handleDeleteSupplier(params.row.id)}>Delete</button>
        </div>
      ),
    }
  ];

  return (
    <div className="supplierDetails">
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab className="tabHeading" label="Suppliers" value="1" />
              <Tab className="tabHeading" label={editingSupplier ?"Edit Supplier" : "Add Supplier"} value="2" />
            </TabList>
          </Box>
          <TabPanel className="tabOne" value="1">
            <DataTable
              slug="suppliers"
              columns={columns}
              rows={suppliers}
              onDelete={handleDeleteSupplier}
            />
          </TabPanel>
          <TabPanel value="2">
            <form onSubmit={handleSubmitSupplier}>
              <div className="formDiv">
                <div className="formInnerDiv">
                  <label className="formLabel">Supplier Code</label>
                  <input
                    className="formInput"
                    type="text"
                    value={supplierCode}
                    onChange={(e) => setSupplierCode(e.target.value)}
                  />
                </div>
                <div className="formInnerDiv">
                  <label className="formLabel">Supplier Name</label>
                  <input
                    className="formInput"
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                  />
                </div>
              </div>
              <div className="formDiv">
                <div className="formInnerDiv">
                  <label className="formLabel">Phone Number</label>
                  <input
                    className="formInput"
                    type="text"
                    value={supplierNumber}
                    onChange={(e) => setSupplierNumber(e.target.value)}
                  />
                </div>
                <div className="formInnerDiv">
                  <label className="formLabel">Address</label>
                  <input
                    className="formInput"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="formDiv">
                <div className="formInnerDiv">
                  <label className="formLabel">Balance Amount</label>
                  <input
                    className="formInput"
                    type="number"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(parseFloat(e.target.value))}
                  />
                </div>
                <div className="formInnerDiv">
                  <label className="formLabel">Debit Amount</label>
                  <input
                    className="formInput"
                    type="number"
                    value={debitAmount}
                    onChange={(e) => setDebitAmount(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div className="formDiv">
                <div className="formInnerDiv">
                  <label className="formLabel">Contact Person Name</label>
                  <input
                    className="formInput"
                    type="text"
                    value={contactPersonName}
                    onChange={(e) => setContactPersonName(e.target.value)}
                  />
                </div>
                <div className="formInnerDiv">
                  <label className="formLabel">Contact Person Phone</label>
                  <input
                    className="formInput"
                    type="text"
                    value={contactPersonNumber}
                    onChange={(e) => setContactPersonNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="formDiv">
                <div className="formInnerDiv">
                  <label className="formLabel">Supplier Status</label>
                  <input
                    className="formInput"
                    type="text"
                    value={supplierStatus}
                    onChange={(e) => setSupplierStatus(e.target.value)}
                  />
                </div>
                <div className="formInnerDiv">
                  <label className="formLabel">Notes</label>
                  <textarea
                    className="formInput"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
             
              <div className="supplierBtnDiv">
                <button className="supplierBtn" type="submit">
                  {editingSupplier ? "Update Supplier" : "Add Supplier"}
                </button>
                {editingSupplier && (
                  <button
                    type="button"
                    className="supplierBtn cancelBtn"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default SupplierDetails;
