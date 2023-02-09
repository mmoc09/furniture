import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Heading from "../components/Heading";
import {
  collection,
  getCountFromServer,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const DashboardPage = () => {
  const [orders, setOrders] = React.useState([]);
  React.useEffect(() => {
    const colRef = collection(db, "orders");
    const q = query(colRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc, index) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setOrders(data);
    });
  }, []);
  return (
    <div>
      <Heading heading={"Dashboard"}></Heading>
      <div className="">
        <div className="grid grid-cols-4 px-5 py-5 bg-[#32776b] rounded-lg text-white gap-14">
          <div className="col-span-1">
            <Revenue data={orders.filter((order) => order.status === 2)} />
          </div>
          <div className="col-span-1">
            <TotalOrder data={orders} />
          </div>
          <div className="col-span-1">
            <p className="text-lg">Sản phẩm</p>
            <p className="text-lg font-semibold tracking-widest">10</p>
          </div>
          <div className="col-span-1">
            <p className="text-lg">Khách hàng</p>
            <p className="text-lg font-semibold tracking-widest">100</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Revenue = ({ data }) => {
  const [revenues, setRevenues] = React.useState([]);
  console.log(revenues);
  React.useEffect(() => {
    setRevenues(
      [...data].map((item) => ({
        revenue: getRevenueItem(item.products),
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const getRevenueItem = (products) => {
    let revenue = 0;
    [...products].forEach((product) => {
      if (product.productInfo.discountPrice) {
        revenue = revenue + product.qty * product.productInfo.discountPrice;
      } else {
        revenue = revenue + product.qty * product.productInfo.price;
      }
    });
    return revenue;
  };
  const getRevenue = () => {
    let revenue = 0;
    revenues.forEach((item) => (revenue += item.revenue));
    return revenue;
  };
  return (
    <>
      <div className="">
        <p className="text-lg">Doanh thu</p>
        <p className="text-lg font-semibold tracking-widest">{`${getRevenue()
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}VND`}</p>
      </div>
      {/* <div className="w-full h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={300} height={100} data={revenues}>
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#fff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div> */}
    </>
  );
};

const TotalOrder = ({ data }) => {
  return (
    <>
      <div className="">
        <p className="text-lg">Đơn hàng</p>
        <p className="text-lg font-semibold tracking-widest">100</p>
      </div>
      {/* <div className="w-full h-[150px]"></div> */}
    </>
  );
};

export default DashboardPage;