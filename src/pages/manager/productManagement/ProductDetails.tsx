import { useParams } from "react-router-dom";
import { Card, Col, Row } from "antd";
import { useGetProductByIdQuery } from "../../../redux/features/manager/productManagement.api";
import { TProduct } from "../../../types";

export type TTableData = Pick<
  TProduct,
  "name" | "price" | "quantity" | "brand" | "model"
>;

const ProductDetails = () => {
  const { productId } = useParams();

  const { data: product } = useGetProductByIdQuery(productId as string);

  const {
    // _id,
    name,
    price,
    quantity,
    releaseDate,
    model,
    // isAvailable,
    operatingSystem,
    screenSize,
    storageCapacity,
    brand,
    img,
  } = product?.data || {};

  return (
    <Card title={`Product Details - ${name}`} style={{ textAlign: "center" }}>
      <Row gutter={16}>
        <Col span={8}>
          <img src={img} height={300} width={300} />
        </Col>
        <Col
          span={16}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div>
            <p>
              <strong>Name: {name}</strong>
            </p>
            <p>
              <strong>Price:</strong> {price}
            </p>
            <p>
              <strong>Quantity:</strong> {quantity}
            </p>
            <p>
              <strong>Brand:</strong> {brand}
            </p>
            <p>
              <strong>Model:</strong> {model}
            </p>
            <p>
              <strong>Screen Size:</strong> {screenSize}
            </p>
            <p>
              <strong>Operating System:</strong> {operatingSystem}
            </p>
            <p>
              <strong>Storage Capacity:</strong> {storageCapacity}
            </p>
            <p>
              <strong>Release Data:</strong> {releaseDate}
            </p>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductDetails;
