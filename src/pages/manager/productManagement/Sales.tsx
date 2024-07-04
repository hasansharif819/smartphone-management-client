import {
  Table,
  TableProps,
  TableColumnsType,
  Button,
  Pagination,
  Input,
} from "antd";
import { useGetAllSalesQuery } from "../../../redux/features/seller/salesManagement.api";
import moment from "moment";
import { TQueryParam } from "../../../types";
import { useState } from "react";
import { TItem, TSales } from "../../../types/salesManagement.type";
import jsPDF from "jspdf";
import { SearchOutlined } from "@ant-design/icons";

export type TTableData = Pick<
  TSales,
  | "buyerName"
  | "price"
  | "productQuantity"
  | "productId"
  | "createdAt"
  | "soldBy"
>;

const Sales = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: sales, isFetching } = useGetAllSalesQuery([
    { name: "page", value: page },
    { name: "sort", value: "id" },
    ...params,
  ]);

  const metaData = sales?.meta;

  // console.log("All Sales = ", sales);

  const tableData = sales?.data?.map(
    ({
      _id,
      buyerName,
      price,
      productQuantity,
      productId,
      soldBy,
      createdAt,
    }) => ({
      key: _id,
      buyerName,
      price,
      productQuantity,
      productId: productId?.name,
      soldBy: soldBy?.fullName,
      createdAt,
    })
  );

  const columns: TableColumnsType<TTableData> = [
    {
      title: "Client Name",
      key: "buyerName",
      dataIndex: "buyerName",
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
      title: "Product Price",
      key: "price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      key: "productQuantity",
      dataIndex: "productQuantity",
    },
    {
      title: "Product",
      key: "productId",
      dataIndex: "productId",
    },
    {
      title: "Seller",
      key: "soldBy",
      dataIndex: "soldBy",
    },
    {
      title: "Sales Date",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (date: moment.MomentInput) =>
        // moment(date).format("YYYY-MM-DD HH:mm:ss"),
        moment(date).format("YYYY-MM-DD"),
      filters: [
        {
          text: "daily",
          value: "daily",
        },
        {
          text: "weekly",
          value: "weekly",
        },
        {
          text: "monthly",
          value: "monthly",
        },
        {
          text: "yearly",
          value: "yearly",
        },
      ],
    },
    {
      title: "Voucers",
      key: "_id",
      render: (item) => {
        // console.log(item);
        return (
          <Button onClick={() => handleDownloadClick(item)}>Download</Button>
        );
      },
    },
  ];

  const handleDownloadClick = (item: TItem) => {
    // Use jsPDF to generate PDF
    const pdf = new jsPDF();
    // const totalPrice = item.price * item.productQuantity;

    // Static information
    pdf.setFont("Arial", "normal");
    pdf.setFontSize(18);
    pdf.text(`Id: ${item.key}`, 20, 25);
    pdf.text("Date: " + new Date().toLocaleDateString(), 160, 25);

    // Add content to the PDF
    pdf.setFont("Arial", "bold");
    pdf.setFontSize(24);
    pdf.text("Welcome to Smart Bazar", 65, 50);

    pdf.setFont("Arial", "normal");
    pdf.setFontSize(18);
    pdf.text("Address: Road 1/b, Sector 9", 70, 60);
    pdf.text("Uttara, Dhaka 1230", 80, 70);
    pdf.text("Phone: 01640911511", 80, 80);

    // Add content to the PDF
    pdf.setFont("Arial", "bold");
    pdf.setFontSize(32);
    pdf.text("Invoice", 90, 110);

    // pdf.setFont("Arial", "normal");
    // pdf.setFontSize(18);
    pdf.setFont("Arial", "normal");
    pdf.setFontSize(18);
    pdf.text(`Dear ${item.buyerName} sir,`, 20, 140);
    pdf.text(
      `Thanks for purchasing this ${item.productId}. We are very delighted and happy.`,
      20,
      150
    );
    pdf.text(
      `You are purchase this ${item.productId} with the quantity of ${item.productQuantity}`,
      20,
      160
    );
    pdf.text(`The price of this product is ${item.price}`, 20, 170);

    // Buyer information (dynamic)
    pdf.text(`Client Name: ${item.buyerName}`, 20, 190);

    // Sales details (dynamic)
    // pdf.text(`Price: $${item.price}`, 20, 200);
    pdf.text(`Quantity: ${item.productQuantity}`, 20, 200);
    pdf.text(`Total Price: $${item.price}`, 20, 210);

    // Static information (footer)
    pdf.text("Thank you for your purchase!", 70, 250);
    pdf.text("Stay with us!", 90, 260);

    // Save or open the PDF
    pdf.save("sales_data.pdf");
  };

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
          queryParams.push({ name: key, value: item });
        });
      });

      // Handle special cases for date ranges (daily, weekly, monthly, yearly)
      if (filters.createdAt && filters.createdAt.length > 0) {
        const selectedDateRange = filters.createdAt[0];

        if (selectedDateRange === "daily") {
          // Filter for today
          queryParams.push({
            name: "createdAt",
            value: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          });
        } else if (selectedDateRange === "weekly") {
          // Filter for the last 7 days
          queryParams.push({
            name: "createdAt",
            value: moment()
              .subtract(7, "days")
              .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          });
        } else if (selectedDateRange === "monthly") {
          // Filter for the current month
          queryParams.push({
            name: "createdAt",
            value: moment().startOf("month").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          });
        } else if (selectedDateRange === "yearly") {
          // Filter for the current year
          queryParams.push({
            name: "createdAt",
            value: moment().startOf("year").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          });
        }
      }

      setParams(queryParams);
    }
  };

  const handleSearch = () => {
    setParams([{ name: "buyerName", value: searchTerm }]);
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

export default Sales;
