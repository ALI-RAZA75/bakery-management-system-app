import { useEffect, useState, useMemo } from "react";
import "./Issuance.scss";
import Box from "@mui/material/Box";
import DataTable from "../../Components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";

interface User {
  id: number;
  firstName: string;
}

interface Received {
  id: number;
  productID: number | null;
  quantityReceived: number;
}

interface Product {
  id: number;
  itemName: string;
  itemCode: number;
}

function Issuance() {
  const [receivedData, setReceivedData] = useState<Received[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [issuanceDate, setIssuanceDate] = useState<string>("");
  const [issuedTo, setIssuedTo] = useState<number | string>("");
  const [issuedBy, setIssuedBy] = useState<number | string>("");
  const [issuancePurpose, setIssuancePurpose] = useState<string>("");
  const [issuedQuantities, setIssuedQuantities] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [totalReceivedMap, setTotalReceivedMap] = useState<Record<string, number>>({});
  const [selectedProducts, setSelectedProducts] = useState<{ [key: number]: boolean }>({});
  const [totalIssuedMap, setTotalIssuedMap] = useState<Record<string, number>>({}); 
  const [issuedData, setIssuedData] = useState<Issued[]>([]); 

  const [nextIssuedId, setNextIssuedId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchNextIssuedId = async () => {
      try {
        const response = await fetch("http://localhost:3001/issuance/next");
        const data = await response.json();
        setNextIssuedId(data.nextIssuedId);
      } catch (error) {
        console.error("Error fetching next issued ID:", error);
      }
    };

    fetchNextIssuedId();
  }, []);

  const handleProductSelect = (productId: number) => {
    setSelectedProducts((prevSelected) => ({
      ...prevSelected,
      [productId]: !prevSelected[productId],
    }));
  };

  const fetchTotalReceived = async (productID: number) => {
    try {
      const response = await fetch(`http://localhost:3001/received/sum/${productID}`);
      const data = await response.json();
      const key = `${productID}`;
      setTotalReceivedMap((prev) => ({
        ...prev,
        [key]: data.totalReceived || 0,
      }));
    } catch (error) {
      console.error("Error fetching total received:", error);
    }
  };

  const fetchTotalIssued = async (productID: number) => {
    try {
      const response = await fetch(`http://localhost:3001/issuance/sum/${productID}`);
      const data = await response.json();
      console.log(data);
      const key = `${productID}`;
      setTotalIssuedMap((prev) => ({
        ...prev,
        [key]: data.totalIssued || 0,
      }));
    } catch (error) {
      console.error("Error fetching total issued:", error);
    }
  };

  useEffect(() => {
    const fetchReceivedData = async () => {
      try {
        const response = await fetch("http://localhost:3001/received");
        const receivedData = await response.json();

        const mappedData = receivedData.map((item) => ({
          ...item,
          productID: item.productID,
          productName: item.productName,
        }));

        setReceivedData(mappedData);

        mappedData.forEach((item: Received) => {
          if (item.productID !== null) {
            fetchTotalReceived(item.productID);
          }
        });
      } catch (error) {
        console.error("Error fetching received data:", error);
      }
    };

    const fetchIssuedData = async () => {
      try {
        const response = await fetch("http://localhost:3001/issuance");
        const issuedData = await response.json();
        setIssuedData(issuedData);

        issuedData.forEach((item: Issued) => {
          fetchTotalIssued(item.productID);
        });
      } catch (error) {
        console.error("Error fetching issued data:", error);
      }
    };

    const fetchUsers = async () => {
      const response = await fetch("http://localhost:3001/users");
      const data = await response.json();
      setUsers(data);
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchUsers();
    fetchReceivedData();
    fetchProducts();
    fetchIssuedData();
  }, []);

  const groupedReceivedData = useMemo(() => {
    const productMap = new Map();
  
    receivedData.forEach(item => {
      if (item.productID !== null) {
        if (productMap.has(item.productID)) {
          const existingItem = productMap.get(item.productID);
          productMap.set(item.productID, {
            ...existingItem,
            quantityReceived: existingItem.quantityReceived + item.quantityReceived,
          });
        } else {
          productMap.set(item.productID, item);
        }
      }
    });
  
    return Array.from(productMap.values());
  }, [receivedData]);
  

  const productMap = useMemo(() => {
    return products.reduce((map, product) => {
      map[product.id] = { itemName: product.itemName, itemCode: product.itemCode };
      return map;
    }, {} as Record<number, { itemName: string; itemCode: number }>);
  }, [products]);

  // const handleIssuedQuantityChange = (productId: number, value: number) => {
  //   setIssuedQuantities((prev) => ({
  //     ...prev,
  //     [productId]: value,
  //   }));
  // };

  const handleIssuedQuantityChange = (productId: number, value: number) => {
    const availableQuantity = totalReceivedMap[productId] - (totalIssuedMap[productId] || 0);
  
    if (value > availableQuantity) {
      alert(`You cannot issue more than the available quantity. Available Quantity: ${availableQuantity}`);
      return;
    }
  
    setIssuedQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    // Validate required fields and quantities
    if (!issuanceDate || !issuedTo || !issuedBy || !issuancePurpose || Object.keys(issuedQuantities).length === 0) {
      setError("Please fill in all fields and issue at least one product.");
      return;
    }
  
    const items = Object.entries(issuedQuantities)
      .filter(([, qty]) => qty > 0) // Filter out products with zero issued quantity
      .map(([productId, qty]) => {
        const product = productMap[Number(productId)];
        const totalReceived = totalReceivedMap[productId] || 0; // Total quantity received
        const totalIssued = totalIssuedMap[productId] || 0; // Total quantity issued so far
  
        // Available Quantity = Total Received - Total Issued
        const availableQuantity = totalReceived - totalIssued;
  
        // Remaining Quantity = Available Quantity - Issued Quantity
        const remainingQuantity = availableQuantity - qty;
  
        return {
          itemCode: product?.itemCode || 0,
          productID: productId || 0,
          issuedQuantity: qty,
          remainingQuantity: remainingQuantity >= 0 ? remainingQuantity : 0, // Set remainingQuantity to 0 if negative
        };
      });
  
    const issuance = {
      issuanceDate,
      issuedTo,
      issuedBy,
      issuancePurpose,
      items,
    };
  
    try {
      const response = await fetch("http://localhost:3001/issuance/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issuance),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await response.json();
      console.log("Issuance created successfully:", result);
      setIssuanceDate("");
      setIssuedTo("");
      setIssuedBy("");
      setIssuancePurpose("");
      setIssuedQuantities({});
      setSelectedProducts({});
      setError("");

      window.location.reload();
      const res = await fetch("http://localhost:3001/issuance/next");
      const data = await res.json();
      setNextIssuedId(data.nextIssuedId);
  
    } catch (error) {
      console.error("Error submitting issuance:", error);
    }
  };

  const issuanceColumns: GridColDef[] = [
    {
      field: "select",
      headerName: "Select",
      flex: 1,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={!!selectedProducts[params.row?.id]}
          onChange={() => handleProductSelect(params.row?.id)}
        />
      ),
    },
    {
      field: "itemCode",
      headerName: "Item Code",
      width: 150,
      renderCell: (params) => {
        const product = productMap[params.row.productID];
        return product ? product.itemCode : "N/A";
      },
    },
    {
      field: "itemName",
      headerName: "Product Name",
      flex: 1,
      renderCell: (params) => {
        const product = productMap[params.row.productID];
        return product ? product.itemName : "Unknown";
      },
    },
    // {
    //   field: "quantityIssued",
    //   headerName: "Total Quantity Issued",
    //   width: 150,
    //   renderCell: (params) => {
    //     const key = `${params.row.productID}`;
    //     return totalIssuedMap[key] || 0;
    //        },
    // },
    {
      field: "availableQuantity",
      headerName: "Available Quantity",
      width: 150,
    //   renderCell: (params) => {
    //     const key = `${params.row.productID}`;
    //     return totalReceivedMap[key] || 0;
    //   },
    // },
    renderCell: (params) => {
      const key = `${params.row.productID}`;
      const totalReceived = totalReceivedMap[key] || 0;
      const totalIssued = totalIssuedMap[key] || 0;
      
      // Available quantity is calculated as received minus issued
      const availableQuantity = totalReceived - totalIssued;
  
      return availableQuantity >= 0 ? availableQuantity : "Invalid Quantity";
    },
  },
    {
      field: "issuedQuantity",
      headerName: "Issued Quantity",
      flex: 1,
      renderCell: (params) => {
        const key = `${params.row.productID}`;
        return (
          <input
            type="number"
            value={issuedQuantities[key] || 0}
            onChange={(e) => handleIssuedQuantityChange(params.row.productID, Number(e.target.value))}
          />
        );
      },
    },    
    {
      field: "remainingQuantity",
      headerName: "Remaining Quantity",
      flex: 1,
      renderCell: (params) => {
        const key = `${params.row.productID}`;
        const availableQuantity = (totalReceivedMap[key] || 0) - (totalIssuedMap[key] || 0); // Calculate Available Quantity
        const issuedQty = issuedQuantities[key] || 0; 
    
        const remainingQty = availableQuantity - issuedQty;
    
        return remainingQty >= 0 ? remainingQty : "Invalid Quantity";
      },
    },
  ];

  return (
    <div className="issuance">
       <Box sx={{ width: "100%", typography: "body1" }}>
         <TabContext value="1">
           <TabPanel value="1">
             <div className="issuance-form">
               <form onSubmit={handleSubmit}>
                 <div className="formDiv">
                 <div className="formInnerDiv">
                    <label className="formLabel">Next Issued ID</label>
                    <input
                      className="formInput"
                      type="text"
                      value={nextIssuedId !== null ? nextIssuedId : "Loading..."}
                      readOnly 
                    />
                  </div>
                   <div className="formInnerDiv">
                     <label className="formLabel">Issuance Date</label>
                     <input
                       className="formInput"
                       type="date"
                       value={issuanceDate}
                       onChange={(e) => setIssuanceDate(e.target.value)}
                     />
                   </div>
                   <div className="formInnerDiv">
                     <label className="formLabel">Issued To</label>
                     <select
                       className="formInput"
                       value={issuedTo || ""}
                       onChange={(e) => setIssuedTo(Number(e.target.value))}
                     >
                       <option value="">Select Issued To</option>
                       {users.map((user) => (
                         <option key={user.id} value={user.id}>
                           {user.firstName}
                         </option>
                       ))}
                     </select>
                   </div>
                   <div className="formInnerDiv">
                     <label className="formLabel">Issued By</label>
                     <select
                       className="formInput"
                       value={issuedBy || ""}
                       onChange={(e) => setIssuedBy(Number(e.target.value))}
                     >
                       <option value="">Select Issued By</option>
                       {users.map((user) => (
                         <option key={user.id} value={user.id}>
                           {user.firstName}
                         </option>
                       ))}
                     </select>
                   </div>
                   <div className="formInnerDiv">
                     <label className="formLabel">Issuance Purpose</label>
                     <input
                       className="formInput"
                       type="text"
                       value={issuancePurpose}
                       onChange={(e) => setIssuancePurpose(e.target.value)}
                     />
                   </div>
                 </div>
                 <div className="issuanceBtnDiv"><button className="submitBtn" type="submit">
                   Submit Issuance
                 </button></div>
                 
               </form>
             </div>
           </TabPanel>
         </TabContext>
       </Box>
       <div className="table">
         <DataTable
           title="Product Issuance"
           rows={groupedReceivedData}
           columns={issuanceColumns}
         />
       </div>
     </div>
  );
}

export default Issuance;

