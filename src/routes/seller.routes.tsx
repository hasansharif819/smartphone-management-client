import ProductDetails from "../pages/manager/productManagement/ProductDetails";
import Products from "../pages/manager/productManagement/Products";
import Sales from "../pages/manager/productManagement/Sales";
// import SellerDashboard from "../pages/seller/SellerDashboard";

export const sellerPaths = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: <Products />,
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
];
