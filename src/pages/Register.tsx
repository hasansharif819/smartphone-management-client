import { FieldValues, SubmitHandler } from "react-hook-form";
import { Button, Col, Divider, Row } from "antd";
import { toast } from "sonner";
import { useAddSellerMutation } from "../redux/features/manager/userManagement.api";
import { TResponse } from "../types";
import PHForm from "../components/form/PHForm";
import PHInput from "../components/form/PHInput";
import PHSelect from "../components/form/PHSelect";
import { bloodGroupOptions, genderOptions } from "../constants/global";
import { Link, useNavigate } from "react-router-dom";

const sellerDefaultValues = {
  username: "sharif",
  password: "123456",
  confirmPassword: "123456",
  name: {
    firstName: "Sharif",
    middleName: "Hasan",
    lastName: "Shuvro",
  },
  gender: "male",
  dateOfBirth: "1998-12-01",
  email: "sharif@gmail.com",
  bloogGroup: "O+",
  profileImg: "https://i.ibb.co/VxNn1jF/sharif1.jpg",
  contactNo: "01640911511",
  emergencyContactNo: "01568268795",
  presentAddress: "Sector-9, Uttara, Dhaka",
  permanentAddress: "Uttar Sharifpur, Begumgonj, Noakhali",
};

const Register = () => {
  const navigate = useNavigate();
  const [addSeller] = useAddSellerMutation();
  // const [addSeller, { data, error }] = useAddSellerMutation();
  // console.log({ data, error });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...");
    const sellerData = {
      // username: data.username,
      password: data.password,
      seller: data,
    };

    // console.log("user = ", data);

    // console.log("User data = ", sellerData);

    const formData = new FormData();

    formData.append("data", JSON.stringify(formData));
    // formData.append("file", data.image);
    // addSeller(sellerData);

    try {
      const res = (await addSeller(sellerData)) as TResponse<any>;
      if (res.error) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("User register Successfully!!!", { id: toastId });
        navigate(`/login`);
        toast.success("Please Login!!!", { id: toastId });
      }
    } catch (err) {
      toast.error("Failed to register user!!! Something went wrong", {
        id: toastId,
      });
    }
  };

  return (
    <Row justify="center" style={{ padding: "50px 30px" }}>
      <h2>Register Now</h2>
      <Col span={24}>
        <PHForm onSubmit={onSubmit} defaultValues={sellerDefaultValues}>
          <div style={{ textAlign: "right" }}>
            <Link to="/login">Already have an account?</Link>
          </div>
          <Divider>User Info.</Divider>
          <Row gutter={8}>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="username" label="User Name" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="password" label="Password" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="confirmPassword"
                label="Confirm Password"
              />
            </Col>
          </Row>
          <Divider>Personal Info.</Divider>
          <Row gutter={8}>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="name.firstName" label="First Name" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="name.middleName" label="Middle Name" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="name.lastName" label="Last Name" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHSelect options={genderOptions} name="gender" label="Gender" />
            </Col>
            {/* <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHDatePicker name="dateOfBirth" label="Date of birth" />
            </Col> */}

            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="dateOfBirth" label="Date of birth" />
            </Col>

            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHSelect
                options={bloodGroupOptions}
                name="bloogGroup"
                label="Blood group"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="profileImg" label="Image" />
            </Col>
          </Row>
          <Divider>Contact Info.</Divider>
          <Row gutter={8}>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="email" label="Email" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="contactNo" label="Contact" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="emergencyContactNo"
                label="Emergency Contact"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="presentAddress"
                label="Present Address"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="permanentAddress"
                label="Permanent Address"
              />
            </Col>
          </Row>

          <Button htmlType="submit">Submit</Button>
        </PHForm>
      </Col>
    </Row>
  );
};

export default Register;
