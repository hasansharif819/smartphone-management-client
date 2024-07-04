import {
  Button,
  Col,
  Flex,
  Input,
  Modal,
  Pagination,
  Row,
  Table,
  TableProps,
} from "antd";
import { FieldValues, SubmitHandler } from "react-hook-form";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "../../../redux/features/manager/productManagement.api";
import { useState } from "react";
import PHForm from "../../../components/form/PHForm";
import PHInput from "../../../components/form/PHInput";
import { useAddSalesMutation } from "../../../redux/features/seller/salesManagement.api";
import { toast } from "sonner";
import {
  TProduct,
  TProductItem,
  TQueryParam,
  TResponse,
  TUpdateProductModalProps,
} from "../../../types";
import { TSalesInfo, TSalesItem } from "../../../types/salesManagement.type";
import { useAppSelector } from "../../../redux/hooks";
import { useCurrentToken } from "../../../redux/features/auth/authSlice";
import { verifyToken } from "../../../utils/verifyToken";
import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import PHSelect from "../../../components/form/PHSelect";
import {
  brandNameOptions,
  operatingSystemOptions,
  storageCapacityOptions,
} from "../../../constants/global";

export type TTableData = Pick<
  TProduct,
  | "name"
  | "price"
  | "quantity"
  | "brand"
  | "model"
  | "img"
  | "operatingSystem"
  | "storageCapacity"
  | "releaseDate"
  | "screenSize"
  | "isAvailable"
>;

const { confirm } = Modal;

const Products = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const token = useAppSelector(useCurrentToken);
  // console.log("Token = ", token);

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

  const [deleteProduct] = useDeleteProductMutation();

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
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={() => handleSearch()}
          />
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchTerm ? "#1890ff" : undefined }} />
      ),
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
      filters: [
        {
          text: "Samsung",
          value: "Samsung",
        },
        {
          text: "OnePlus",
          value: "OnePlus",
        },
        {
          text: "Apple",
          value: "Apple",
        },
        {
          text: "Xiaomi",
          value: "Xiaomi",
        },
        {
          text: "Vivo",
          value: "Vivo",
        },
        {
          text: "Realme",
          value: "Realme",
        },
        {
          text: "Oppo",
          value: "Oppo",
        },
        {
          text: "Motorola",
          value: "Motorola",
        },
        {
          text: "Nokia",
          value: "Nokia",
        },
        {
          text: "Huawei",
          value: "Huawei",
        },
      ],
    },
    {
      title: "Details",
      key: "x",
      render: (item: { key: any }) => {
        // console.log(item);
        return (
          <Link to={`/${userRole}/product/${item.key}`}>
            <Button>Details</Button>
          </Link>
        );
      },
      width: "1%",
    },
    {
      title: "Update",
      key: "_id",
      render: (item: TProductItem) => {
        return userRole === "seller" ? null : (
          <UpdateProductModal productId={item.key} productInfo={item} />
        );
      },
    },
    {
      title: "Delete",
      key: "_id",
      render: (item: { key: any }) => {
        const showDeleteConfirm = (productId: string) => {
          confirm({
            title: "Do you want to delete this product?",
            icon: <ExclamationCircleOutlined />,
            content: "This action cannot be undone.",
            onOk() {
              handleDelete(productId);
            },
            onCancel() {
              // Do nothing if canceled
            },
          });
        };

        const handleDelete = async (item: any) => {
          const toastId = toast.loading("Deleting...");
          const productId = item;
          // console.log("ProductId = ", productId);

          try {
            const res = (await deleteProduct(productId)) as TResponse<any>;
            if (res.error) {
              toast.error(res.error.data.message, { id: toastId });
              console.log("Deleted product = ");
            } else {
              toast.success("Product is Successfully Deleted", { id: toastId });
            }
          } catch (err) {
            toast.error("Something went wrong, Product is not Deleted!!!", {
              id: toastId,
            });
          }
        };
        return userRole === "seller" ? null : (
          <Button onClick={() => showDeleteConfirm(item.key)}>Delete</Button>
        );
      },
    },
    {
      title: "Sales",
      key: "_id",
      render: (item: TSalesItem) => {
        // console.log(item);
        return userRole === "manager" ? null : (
          <AddSalesModal salesInfo={item} />
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

  const handleSearch = () => {
    setParams([{ name: "name", value: searchTerm }]);
  };

  return (
    <>
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
          style={{ backgroundColor: "green", color: "white", border: "none" }}
        >
          <Link to="/manager/create-product">Create Varient</Link>
        </Button>
      </div>
      ;
    </>
  );
};

const UpdateProductModal: React.FC<TUpdateProductModalProps> = ({
  productId,
  productInfo,
}) => {
  const [updateProduct] = useUpdateProductMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // console.log("Product indfo = ", productId);

  const updateProductDefaultValues = {
    name: `${productInfo?.name}`,
    price: `${productInfo?.price}`,
    quantity: `${productInfo?.quantity}`,
    releaseDate: `${productInfo?.releaseDate}`,
    model: `${productInfo?.model}`,
    operatingSystem: `${productInfo?.operatingSystem}`,
    screenSize: `${productInfo?.screenSize}`,
    storageCapacity: `${productInfo?.storageCapacity}`,
    img: `${productInfo?.img}`,
    brand: `${productInfo?.brand}`,
    isAvailable: `${productInfo?.isAvailable}`,
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Updating...");
    const productData = {
      id: productId,
      data,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(productData));

    // console.log("Update Product data = ", productData);

    try {
      const res = (await updateProduct(productData)) as TResponse<any>;
      if (res.error) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Product is Successfully updated", { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong, Product is not updated!!!", {
        id: toastId,
      });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={showModal}
        style={{ backgroundColor: "green", color: "white", border: "none" }}
      >
        Update Now
      </Button>
      <Modal
        title="Update Product Information"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Flex justify="center" align="center">
          <Col span={24}>
            <PHForm
              onSubmit={onSubmit}
              defaultValues={updateProductDefaultValues}
            >
              <Row gutter={8}>
                <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
                  <PHInput type="text" name="name" label="Name" />
                </Col>
                <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
                  <PHInput type="text" name="price" label="Price" />
                </Col>
                <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
                  <PHInput type="text" name="quantity" label="Quantity" />
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
                  <PHInput type="text" name="model" label="Model" />
                </Col>
                <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
                  <PHSelect
                    options={operatingSystemOptions}
                    name="operatingSystem"
                    label="Operating System"
                  />
                </Col>
                <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
                  <PHSelect
                    options={storageCapacityOptions}
                    name="storageCapacity"
                    label="Storage Capacity"
                  />
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
                  <PHSelect
                    options={brandNameOptions}
                    name="brand"
                    label="Brand"
                  />
                </Col>
                <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
                  <PHInput type="text" name="screenSize" label="Screen Size" />
                </Col>
                <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
                  <PHInput
                    type="text"
                    name="releaseDate"
                    label="Release Date"
                  />
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
                  <PHInput
                    type="text"
                    name="isAvailable"
                    label="Is Available"
                  />
                </Col>
                <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
                  <PHInput type="text" name="img" label="Image" />
                </Col>
              </Row>

              <Button htmlType="submit">Submit</Button>
            </PHForm>
          </Col>
        </Flex>
      </Modal>
    </>
  );
};

const AddSalesModal = (salesInfo: { salesInfo: TSalesInfo }) => {
  const [createSales] = useAddSalesMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isProductAvailable =
    salesInfo.salesInfo.quantity > 0 &&
    salesInfo.salesInfo.isAvailable === true;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...");
    const salesData = {
      productId: salesInfo?.salesInfo?.key,
      buyerName: data?.buyerName,
      productQuantity: Number(data?.productQuantity),
      price: Number(salesInfo?.salesInfo?.price * data?.productQuantity),
    };

    try {
      if (!isProductAvailable) {
        toast.error("Product is out of stock");
        return;
      }

      const res = (await createSales(salesData)) as TResponse<any>;
      if (res.error) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Sales Successfully", { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const showModal = () => {
    if (isProductAvailable) {
      setIsModalOpen(true);
    } else {
      toast.warning("Product is out of stock");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isProductAvailable ? (
        <Button
          onClick={showModal}
          style={{ backgroundColor: "green", color: "white", border: "none" }}
        >
          Sale Now
        </Button>
      ) : (
        <Button
          style={{ backgroundColor: "red", color: "white", border: "none" }}
        >
          Out of Stock
        </Button>
      )}
      <Modal
        title="Sales Information"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <PHForm onSubmit={onSubmit}>
          <PHInput type="text" name="buyerName" label="Client Name" />
          <PHInput type="text" name="productQuantity" label="Quantity" />
          <Button htmlType="submit">Submit</Button>
        </PHForm>
      </Modal>
    </>
  );
};

export default Products;
