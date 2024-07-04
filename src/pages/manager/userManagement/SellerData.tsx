import {
  Button,
  Pagination,
  Space,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import { useState } from "react";
import { TQueryParam, TSeller } from "../../../types";
import { useGetAllSellersQuery } from "../../../redux/features/manager/userManagement.api";
import { Link } from "react-router-dom";

export type TTableData = Pick<
  TSeller,
  "fullName" | "id" | "email" | "contactNo"
>;

const SellerData = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const [page, setPage] = useState(1);
  const {
    data: seller,
    // isLoading,
    isFetching,
  } = useGetAllSellersQuery([
    { name: "page", value: page },
    { name: "sort", value: "id" },
    ...params,
  ]);

  //   console.log({ seller, isLoading, isFetching });

  const metaData = seller?.meta;

  const tableData = seller?.data?.map(
    ({ _id, fullName, id, email, contactNo, username }) => ({
      key: _id,
      fullName,
      id,
      email,
      contactNo,
      username,
    })
  );

  const columns: TableColumnsType<TTableData> = [
    {
      title: "Name",
      key: "name",
      dataIndex: "fullName",
    },

    {
      title: "Id",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "username",
      key: "username",
      dataIndex: "username",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Contact No.",
      key: "contactNo",
      dataIndex: "contactNo",
    },
    {
      title: "Action",
      key: "x",
      render: (item) => {
        // console.log(item);
        return (
          <Space>
            <Link to={`/manager/seller-data/${item.key}`}>
              <Button>Details</Button>
            </Link>
          </Space>
        );
      },
      width: "1%",
    },
  ];

  const onChange: TableProps<TTableData>["onChange"] = (
    _pagination,
    filters,
    _sorter,
    extra
  ) => {
    if (extra.action === "filter") {
      const queryParams: TQueryParam[] = [];

      filters.name?.forEach((item) =>
        queryParams.push({ name: "name", value: item })
      );

      filters.year?.forEach((item) =>
        queryParams.push({ name: "year", value: item })
      );

      setParams(queryParams);
    }
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
    </>
  );
};

export default SellerData;
