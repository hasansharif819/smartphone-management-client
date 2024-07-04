import { useState } from "react";
import { TQueryParam, TResponse } from "../../../types";
import { useAppSelector } from "../../../redux/hooks";
import { useCurrentToken } from "../../../redux/features/auth/authSlice";
import { verifyToken } from "../../../utils/verifyToken";
import {
  useBulkDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../../redux/features/manager/productManagement.api";
import { toast } from "sonner";
import { Button, Pagination, Table, TableProps } from "antd";
// import { ExclamationCircleOutlined } from "@ant-design/icons";

// const { confirm } = Modal;

const BulkDeleteProducts = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const token = useAppSelector(useCurrentToken);

  let user: any;

  if (token) {
    user = verifyToken(token);
  }
  // console.log("user = ", user);
  const userRole = user?.role;

  const { data: products, isFetching } = useGetAllProductsQuery([
    { name: "page", value: page },
    { name: "sort", value: "id" },
    ...params,
  ]);

  // console.log("Products = ", products);

  const [deleteProduct] = useBulkDeleteProductMutation();

  const metaData = products?.meta;

  const tableData = products?.data?.map(
    ({
      _id,
      name,
      price,
      quantity,
      releaseDate,
      model,
      isAvailable,
      operatingSystem,
      screenSize,
      storageCapacity,
      brand,
      img,
    }) => ({
      key: _id,
      name,
      price,
      quantity,
      releaseDate,
      model,
      operatingSystem,
      screenSize,
      storageCapacity,
      brand,
      img,
      isAvailable,
    })
  );

  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "quantity",
    },
    {
      title: "Brand",
      key: "brand",
      dataIndex: "brand",
    },
    {
      title: "Select",
      key: "_id",
      render: (item: { key: any }) => {
        const isChecked = selectedProducts.includes(item.key);

        const handleCheckboxChange = () => {
          if (isChecked) {
            // Remove from selectedProducts if already selected
            setSelectedProducts((prevSelected) =>
              prevSelected.filter((id) => id !== item.key)
            );
          } else {
            // Add to selectedProducts if not selected
            setSelectedProducts((prevSelected) => [...prevSelected, item.key]);
          }
        };

        return userRole === "seller" ? null : (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        );
      },
    },
  ];

  const onChange: TableProps["onChange"] = (
    _pagination,
    filters,
    _sorter,
    extra
  ) => {
    if (extra.action === "filter") {
      const queryParams: TQueryParam[] = [];

      Object.entries(filters).forEach(([key, values]) => {
        values?.forEach((item) => {
          if (typeof item === "string") {
            queryParams.push({ name: key, value: item });

            if (key === "price") {
              const [min, max] = item.split("-");
              queryParams.push({ name: key + "__gte", value: min });
              queryParams.push({ name: key + "__lte", value: max });
            } else {
              queryParams.push({ name: key, value: item });
            }
          }
        });
      });

      setParams(queryParams);
    }
  };

  const handleBulkDelete = async () => {
    const toastId = toast.loading("Deleting selected products...");

    try {
      const deletedProductData = {
        ids: selectedProducts,
      };

      //   console.log("console from try = ", deletedProductData);
      const res = (await deleteProduct(deletedProductData)) as TResponse<any>;
      //   console.log("res = ", res);
      if (res.error) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Selected products are successfully deleted", {
          id: toastId,
        });
        setSelectedProducts([]);
      }
    } catch (err) {
      toast.error("Something went wrong, selected products are not deleted", {
        id: toastId,
      });
    }
  };

  return (
    <>
      <div>
        <h2>Do you want to delete multiple product</h2>
      </div>
      <Table
        loading={isFetching}
        columns={columns}
        dataSource={tableData}
        onChange={onChange}
        pagination={false}
      />
      <Pagination
        current={page}
        onChange={(value) => setPage(value)}
        pageSize={metaData?.limit}
        total={metaData?.total}
      />
      <div style={{ textAlign: "center" }}>
        <Button
          style={{ backgroundColor: "red", color: "white", border: "none" }}
          onClick={handleBulkDelete}
          disabled={selectedProducts.length === 0}
        >
          Delete the Selected Items
        </Button>
      </div>
      ;
    </>
  );
};

export default BulkDeleteProducts;
