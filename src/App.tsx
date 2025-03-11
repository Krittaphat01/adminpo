import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  id: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  createdAt: string; 
  cartItems: CartItem[];
  totalPrice: number;
}

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            customer: data.customer,
            createdAt: data.createdAt.toDate().toLocaleString(), 
            cartItems: data.cartItems,
            totalPrice: data.totalPrice,
          };
        }) as OrderData[];
        setOrders(ordersList);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Order Date</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={7} style={{ color: "red" }}>{error}</TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>{order.customer.address}</TableCell>
                <TableCell>{order.customer.phone}</TableCell>
                <TableCell>{order.createdAt}</TableCell>
                <TableCell>
                  {order.cartItems.map((item) => (
                    <div key={item.id}>
                      {item.name} (x{item.quantity})
                    </div>
                  ))}
                </TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
