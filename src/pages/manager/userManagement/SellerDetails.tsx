import { useParams } from "react-router-dom";
import { useGetSingleSellerQuery } from "../../../redux/features/manager/userManagement.api";
import { Card, Col, Row } from "antd";

const SellerDetails = () => {
  const { sellerId } = useParams();

  const { data: seller } = useGetSingleSellerQuery(sellerId as string);

  // console.log("data = ", seller?.data);

  const { fullName, email, contactNo, username, profileImg, dateOfBirth } =
    seller?.data || {};

  return (
    <Card title={`User Details - ${fullName}`} style={{ textAlign: "center" }}>
      <Row gutter={16}>
        <Col span={8}>
          <img src={profileImg} height={400} />
        </Col>
        <Col
          span={16}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div>
            <p>
              <strong>Name:</strong> {fullName}
            </p>
            <p>
              <strong>Username:</strong> {username}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Contact No:</strong> {contactNo}
            </p>
            <p>
              <strong>Date Of Birth:</strong> {dateOfBirth}
            </p>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default SellerDetails;
