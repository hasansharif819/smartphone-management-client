import { FieldValues, SubmitHandler } from "react-hook-form";
import PHForm from "../../../components/form/PHForm";
import { Button, Col, Flex, Row } from "antd";
import { toast } from "sonner";
import PHInput from "../../../components/form/PHInput";
import {
  useAddProductMutation,
  // useGetAllProductsQuery,
} from "../../../redux/features/manager/productManagement.api";
import { TResponse } from "../../../types";
import PHSelect from "../../../components/form/PHSelect";
import {
  brandNameOptions,
  operatingSystemOptions,
  storageCapacityOptions,
} from "../../../constants/global";

const updateProductDefaultValues = {
  name: "Product Name",
  price: 500,
  quantity: 30,
  isAvailable: true,
  releaseDate: "2024-02-17",
  model: "Model XYZ",
  operatingSystem: "OS Name",
  screenSize: 15.6,
  storageCapacity: "512GB",
  img: "https://example.com/product-image.jpg",
  brand: "Brand Name",
};

const CreateProduct = () => {
  const [createProduct] = useAddProductMutation();
  // const { data: products } = useGetAllProductsQuery(undefined);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...");

    const productData = {
      ...data,
      price: Number(data.price),
      quantity: Number(data.quantity),
      screenSize: Number(data.screenSize),
      isDeleted: false,
    };

    // console.log(productData);

    try {
      const res = (await createProduct(productData)) as TResponse<any>;
      // console.log(res);
      if (res.error) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Product created", { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <Flex justify="center" align="center">
      <Col span={24}>
        <PHForm onSubmit={onSubmit} defaultValues={updateProductDefaultValues}>
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
            {/* <PHInput type="text" name="brand" label="Brand" /> */}
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHSelect options={brandNameOptions} name="brand" label="Brand" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="model" label="Model" />
            </Col>
            {/* <PHInput
            type="text"
            name="operatingSystem"
            label="Operating System"
          /> */}
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHSelect
                options={operatingSystemOptions}
                name="operatingSystem"
                label="Operating System"
              />
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="screenSize" label="Screen Size" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              {/* <PHInput
                type="text"
                name="storageCapacity"
                label="Storage Capacity"
              /> */}
              <PHSelect
                options={storageCapacityOptions}
                name="storageCapacity"
                label="Storage Capacity"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="releaseDate" label="Release Date" />
            </Col>
          </Row>
          <PHInput type="text" name="img" label="Image" />
          <Button htmlType="submit">Submit</Button>
        </PHForm>
      </Col>
    </Flex>
  );
};

export default CreateProduct;
