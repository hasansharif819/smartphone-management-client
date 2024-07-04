// import ManagerDashboard from "../pages/manager/ManagerDashboard";
import BulkDeleteProducts from "../pages/manager/productManagement/BulkDeleteProducts";
import CreateProduct from "../pages/manager/productManagement/CreateProduct";
import ProductDetails from "../pages/manager/productManagement/ProductDetails";
import Products from "../pages/manager/productManagement/Products";
import Sales from "../pages/manager/productManagement/Sales";
import CreateManager from "../pages/manager/userManagement/CreateManager";
import CreateSeller from "../pages/manager/userManagement/CreateSeller";
import SellerData from "../pages/manager/userManagement/SellerData";
import SellerDetails from "../pages/manager/userManagement/SellerDetails";

export const managerPaths = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: <Products />,
  },
  {
    name: "User Management",
    children: [
      {
        name: "Create Seller",
        path: "create-seller",
        element: <CreateSeller />,
      },
      {
        name: "Create Manager",
        path: "create-manager",
        element: <CreateManager />,
      },
      {
        name: "Create Product",
        path: "create-product",
        element: <CreateProduct />,
      },
      {
        name: "Products",
        path: "product",
        element: <Products />,
      },
      {
        path: "product/:productId",
        element: <ProductDetails />,
      },
      {
        name: "Sales",
        path: "sales",
        element: <Sales />,
      },
      {
        name: "Seller Data",
        path: "seller-data",
        element: <SellerData />,
      },
      {
        path: "seller-data/:sellerId",
        element: <SellerDetails />,
      },
      {
        name: "Bulk Delete Products",
        path: "bulk-delete",
        element: <BulkDeleteProducts />,
      },
    ],
  },
];
