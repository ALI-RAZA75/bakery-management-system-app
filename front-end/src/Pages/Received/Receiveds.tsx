import { useEffect, useState, useMemo } from "react";
import "./Receiveds.scss";
import Box from "@mui/material/Box";
import DataTable from "../../Components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";

interface Demand {
  dmdID: string;
  userID: number | null;
  productID: number | null;
  categoryID: number | null;
  quantity: number;
  demandDate: string;
}

interface SubmittedDemand {
  dmdID: string;
  userID: number | null;
  categoryID: number | null;
  productID: number | null;
  quantity: number;
  quantityReceived: number;
  demandDate: string;
  receivedDate: string;
}

interface User {
  id: number;
  firstName: string;
}

interface Product {
  id: number;
  itemName: string;
}

interface Category {
  id: number;
  category_name: string;
}

function Received() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);


  const [receivedDate, setReceivedDate] = useState<string>("");
  const [selectedDemands, setSelectedDemands] = useState<Record<string, boolean>>({});
  const [quantitiesReceived, setQuantitiesReceived] = useState<Record<string, number>>({});
  const [searchDmdID, setSearchDmdID] = useState<string>("");
  const [searchDemandDate, setSearchDemandDate] = useState<string>("");
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);



  const [totalReceivedMap, setTotalReceivedMap] = useState<Record<string, number>>({});

const fetchTotalReceived = async (dmdID: string, productID: number) => {
    try {
        const response = await fetch(`http://localhost:3001/received/sum/${dmdID}/${productID}`);
        const data = await response.json();
        console.log("Fetched total received:", data); 
        const key = `${dmdID}-${productID}`;
        setTotalReceivedMap((prev) => ({
            ...prev,
            [key]: data.totalReceived, 
        }));
    } catch (error) {
        console.error("Error fetching total received:", error);
    }
};



  const calculateRemainingQuantity = (dmdID: string, productID: number) => {
    const key = `${dmdID}-${productID}`;
    const demand = demands.find((d) => d.dmdID === dmdID && d.productID === productID);
    const totalQuantity = demand?.quantity || 0;
    const totalReceived = demand?.totalReceived || 0;
    const currentReceived = quantitiesReceived[key] || 0; 
  
    const remainingQuantity = totalQuantity - totalReceived;
    if (currentReceived > remainingQuantity) {
      return "Received quantities exceed remaining quantities";
    }
  
    const remainingValue = remainingQuantity - currentReceived;
    return remainingValue > 0 ? `${remainingValue}` : "No remaining quantity";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchDmdID || searchDemandDate) {
      setIsSearchPerformed(true);
    }
  };


  const handleDemandSelect = (dmdID: string, productID: number) => {
    const key = `${dmdID}-${productID}`;
    setSelectedDemands((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleQuantityReceivedChange = (dmdID: string, productID: number, value: string) => {
    const key = `${dmdID}-${productID}`;
    const parsedValue = parseInt(value, 10) || 0;
    const demand = demands.find((d) => d.dmdID === dmdID && d.productID === productID);
    
    if (!demand) return; 
  
    const totalQuantity = demand.quantity;
    const totalReceived = totalReceivedMap[key] || 0;
    const remainingQuantity = totalQuantity - totalReceived;
  
    if (parsedValue > remainingQuantity) {
      alert(`Cannot receive more than the remaining quantity of ${remainingQuantity}`);
      return;
    }
  
    setQuantitiesReceived((prev) => ({
      ...prev,
      [key]: parsedValue,
    }));
  };
  

  // const handleQuantityReceivedChange = (dmdID: string, productID: number, value: string) => {
  //   const key = `${dmdID}-${productID}`;
  //   const parsedValue = parseInt(value, 10) || 0;
  //   setQuantitiesReceived((prev) => ({
  //     ...prev,
  //     [key]: parsedValue,
  //   }));
  // };

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const response = await fetch("http://localhost:3001/demands");
        if (!response.ok) {
          throw new Error("Failed to fetch demands");
        }
        const data = await response.json();
        setDemands(data);
      } catch (error) {
        console.error("Error fetching demands:", error);
      }
    };

    fetchDemands();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:3001/users");
      const data = await response.json();
      setUsers(data);
    };

    const fetchProducts = async () => {
      const response = await fetch("http://localhost:3001/products");
      const data = await response.json();
      setProducts(data);
    };

    const fetchCategories = async () => {
      const response = await fetch("http://localhost:3001/categories");
      const data = await response.json();
      setCategories(data);
    };


    fetchUsers();
    fetchProducts();
    fetchCategories();
  }, []);

  // const userMap = useMemo(() => {
  //   return users.reduce((map, user) => {
  //     map[user.id] = user.firstName;
  //     return map;
  //   }, {} as Record<number, string>);
  // }, [users]);

  const productMap = useMemo(() => {
    return products.reduce((map, product) => {
      map[product.id] = product.itemName;
      return map;
    }, {} as Record<number, string>);
  }, [products]);

  // const categoryMap = useMemo(() => {
  //   return categories.reduce((map, category) => {
  //     map[category.id] = category.category_name;
  //     return map;
  //   }, {} as Record<number, string>);
  // }, [categories]);

  const filteredDemands = useMemo(() => {
    return demands.filter((demand) => {
      const matchesDmdID = searchDmdID ? demand.dmdID.includes(searchDmdID) : true;
      const matchesDemandDate = searchDemandDate ? demand.demandDate === searchDemandDate : true;
      return matchesDmdID && matchesDemandDate;
    });
  }, [demands, searchDmdID, searchDemandDate]);

  useEffect(() => {

    if (filteredDemands.length > 0) {
      filteredDemands.forEach((demand) => {
        fetchTotalReceived(demand.dmdID, demand.productID);
      });
    }
  }, [filteredDemands]);


  const demandColumns: GridColDef[] = [
    {
      field: "select",
      headerName: "Select",
      width: 50,
      renderCell: (params) => {
        const key = `${params.row.dmdID}-${params.row.productID}`;
        return (
          <input
            type="checkbox"
            checked={!!selectedDemands[key]}
            onChange={() => handleDemandSelect(params.row.dmdID, params.row.productID)}
          />
        );
      },
    },
    { field: "dmdID", headerName: "Demand ID", width: 100 },
    // {
    //   field: "firstName",
    //   headerName: "User Name",
    //   width: 100,
    //   renderCell: (params) => userMap[params.row.userID] || "Unknown",
    // },
    {
      field: "itemName",
      headerName: "Product Name",
      flex: 1,
      renderCell: (params) => productMap[params.row.productID] || "Unknown",
    },
    // {
    //   field: "categoryID",
    //   headerName: "Category Name",
    //   flex: 1,
    //   renderCell: (params) => categoryMap[params.row.categoryID] || "Unknown",
    // },
    { field: "quantity", headerName: "Quantity", width: 100 },
    {
      field: "quantityReceived",
      headerName: "Quantity Received",
      width: 200,
      renderCell: (params) => {
        const key = `${params.row.dmdID}-${params.row.productID}`;
        return (
          <input
            type="number"
            value={quantitiesReceived[key] || 0}
            onChange={(e) => handleQuantityReceivedChange(params.row.dmdID, params.row.productID, e.target.value)}
          />
        );
      },
    },
    {
      field: "totalReceived",
      headerName: "Total Received Quantity",
      width: 150,
      renderCell: (params) => {
        const key = `${params.row.dmdID}-${params.row.productID}`;
        return totalReceivedMap[key] || 0; 
      },
    },
    {
      field: "remainingQuantity",
      headerName: "Remaining Quantity",
      flex: 1,
      renderCell: (params) => {
        return calculateRemainingQuantity(params.row.dmdID, params.row.productID);
      },
    },
    
  ];


  const collectData = async (event) => {
    event.preventDefault();

    const submittedData = Object.keys(selectedDemands)
        .filter((key) => selectedDemands[key])
        .map((key) => {
            const [dmdID, productID] = key.split("-");
            const selectedDemand = demands.find(
                (demand) => demand.dmdID === dmdID && demand.productID === Number(productID)
            );

            const receivedQuantity = quantitiesReceived[key] || 0;
            const remainingQuantity = calculateRemainingQuantity(dmdID, Number(productID));

            return {
                dmdID,
                userID: selectedDemand?.userID || null,
                categoryID: selectedDemand?.categoryID || null,
                productID: Number(productID),
                quantity: selectedDemand?.quantity || 0,
                quantityReceived: receivedQuantity,
                remainingquantity: remainingQuantity.toString(),
                demandDate: selectedDemand?.demandDate || "",
                receivedDate: new Date().toISOString().split('T')[0],
            };
        });

    try {
        for (const item of submittedData) {
            const { dmdID, userID, categoryID, productID, quantityReceived } = item;

            const existsResponse = await fetch(`http://localhost:3001/received/check/${dmdID}/${productID}`);
            const existsData = await existsResponse.json();

            if (existsResponse.ok && existsData.exists) {
                const existingResponse = await fetch(`http://localhost:3001/received/check/${dmdID}/${userID}/${categoryID}/${productID}`);
                const existingData = await existingResponse.json();

                if (existingResponse.ok) {
                    const newQuantityReceived = existingData.quantityReceived + quantityReceived;
                    const updateResponse = await fetch(`http://localhost:3001/received/${dmdID}/${userID}/${categoryID}/${productID}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...existingData,
                            quantityReceived: newQuantityReceived,
                        }),
                    });

                    const updateResult = await updateResponse.json();
                    if (!updateResponse.ok) {
                        throw new Error(updateResult.error || "Error updating data");
                    }
                    console.log("Updated entry successfully:", updateResult);
                } else {
                    throw new Error("Error fetching existing record");
                }
            } else {
                const createResponse = await fetch("http://localhost:3001/received/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify([item]),
                });

                const createResult = await createResponse.json();
                if (!createResponse.ok) {
                    throw new Error(createResult.error || "Error creating new data");
                }
                console.log("Created new entry successfully:", createResult);
            }
        }

        alert("Data submitted successfully");
        resetForm();
    } catch (error) {
        console.error("Error submitting data:", error);
        alert("Failed to submit data. Please try again.");
    }
};

  const resetForm = () => {
    setSelectedDemands({});
    setQuantitiesReceived({});
    setReceivedDate("");
  };

  return (
    <div className="received">
      <Box sx={{ width: "100%", typography: "body1" }}>
      <div className="demand-form">
      <form onSubmit={isSearchPerformed ? collectData : handleSearch}>
        <div className="formDiv">
          <div className="formInnerDiv">
            <label className="formLabel">Search by Demand ID</label>
            <input
              type="text"
              className="formInput"
              placeholder="Enter Demand ID"
              value={searchDmdID}
              onChange={(e) => setSearchDmdID(e.target.value)}
            />
          </div>

          <div className="formInnerDiv">
            <label className="formLabel">Search by Demand Date</label>
            <input
              type="date"
              className="formInput"
              value={searchDemandDate}
              onChange={(e) => setSearchDemandDate(e.target.value)}
            />
          </div>

          {isSearchPerformed && (
            <div className="formInnerDiv">
              <label className="formLabel">Received Date</label>
              <input
                type="date"
                className="formInput"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="formButtonDiv">
          <button type="submit" className="submitBtn">
            {isSearchPerformed ? 'Submit' : 'Search'}
          </button>
        </div>
      </form>
      {isSearchPerformed && (
        <div style={{ height: 400, width: '100%' }}>
          <DataTable rows={filteredDemands} columns={demandColumns} />
        </div>
      )}
    </div>
      </Box>
    </div>
  );
}

export default Received;
