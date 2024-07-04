import { FieldValues, SubmitHandler } from "react-hook-form";
import PHForm from "../../../components/form/PHForm";
import PHInput from "../../../components/form/PHInput";
import { Button, Col, Divider, Row } from "antd";
import PHSelect from "../../../components/form/PHSelect";
import { bloodGroupOptions, genderOptions } from "../../../constants/global";
import { useAddManagerMutation } from "../../../redux/features/manager/userManagement.api";
import { toast } from "sonner";
import { TResponse } from "../../../types";
import PHDatePicker from "../../../components/form/PHDatePicker";

const sellerDefaultValues = {
  username: "manager",
  name: {
    firstName: "Hasan",
    middleName: "Shuvro",
    lastName: "Sharif",
  },
  profileImg: "https://i.ibb.co/VxNn1jF/sharif1.jpg",
  gender: "male",
  dateOfBirth: "1998-12-01",
  email: "hasan@gmail.com",
  bloogGroup: "O+",
  contactNo: "01640911511",
  emergencyContactNo: "01568268795",
  presentAddress: "Sector-9, Uttara, Dhaka",
  permanentAddress: "Uttara, Dhaka",
};

const CreateManager = () => {
  const [addManager] = useAddManagerMutation();
  // const [addManager, { data, error }] = useAddManagerMutation();

  // console.log({ data, error });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating manager...");
    const managerData = {
      password: "manager123",
      manager: data,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(managerData));
    // formData.append("file", data.image);

    // addManager(formData);

    try {
      const res = (await addManager(managerData)) as TResponse<any>;
      if (res.error) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Manager Created Successfully", { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong, Manager is not created!!!", {
        id: toastId,
      });
    }
  };

  return (
    <Row justify="center">
      <Col span={24}>
        <PHForm onSubmit={onSubmit} defaultValues={sellerDefaultValues}>
          <Divider>Personal Info.</Divider>
          <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
            <PHInput type="text" name="username" label="User Name" />
          </Col>
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
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHDatePicker name="dateOfBirth" label="Date of birth" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHSelect
                options={bloodGroupOptions}
                name="bloogGroup"
                label="Blood group"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              {/* This is for paid hosting */}
              {/* <Controller
                name="image"
                render={({ field: { onChange, value, ...field } }) => (
                  <Form.Item label="Picture">
                    <Input
                      type="file"
                      value={value?.fileName}
                      {...field}
                      onChange={(e) => onChange(e.target.files?.[0])}
                    />
                  </Form.Item>
                )}
              /> */}
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

export default CreateManager;
