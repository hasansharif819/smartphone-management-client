import { Button, Col, Row, Space } from "antd";
import { FieldValues } from "react-hook-form";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { useAppDispatch } from "../redux/hooks";
import { TUser, setUser } from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PHForm from "../components/form/PHForm";
import PHInput from "../components/form/PHInput";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const defaultValues = {
    // userId: "S-0001",
    username: "sharif",
    password: "123456",
  };

  const [login] = useLoginMutation();

  const onSubmit = async (data: FieldValues) => {
    // console.log(data);
    const toastId = toast.loading("Logging in");

    try {
      const userInfo = {
        // id: data.userId,
        username: data.username,
        password: data.password,
      };
      const res = await login(userInfo).unwrap();

      const user = verifyToken(res.data.accessToken) as TUser;
      dispatch(setUser({ user: user, token: res.data.accessToken }));
      toast.success("Logged in", { id: toastId, duration: 2000 });
      navigate(`/${user.role}/dashboard`);

      // if (res.data.needsPasswordChange) {
      //   navigate(`/change-password`);
      // } else {
      //   navigate(`/${user.role}/dashboard`);
      // }
    } catch (err) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <h2 style={{ marginBottom: "20px" }}>Login</h2>
      <Col span={12}>
        <Row justify="center" align="middle">
          <PHForm onSubmit={onSubmit} defaultValues={defaultValues}>
            {/* <PHInput type="text" name="userId" label="ID:" /> */}
            <PHInput type="text" name="username" label="User Name" />
            <PHInput type="text" name="password" label="Password" />
            <Space>
              <Button htmlType="submit">Login</Button>
              <span style={{ marginLeft: "20px" }}>
                <Link to="/register">Don't have account?</Link>
              </span>
            </Space>
          </PHForm>
        </Row>
      </Col>
    </Row>
  );
};

export default Login;
