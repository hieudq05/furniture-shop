"use client";

import DetailsProduct from "./page/DetailsProduct";
import HomeComponent from "./page/Home";
import ProductList from "./page/Products";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cart from "./page/Cart";
import Login from "./page/Login";
import Signup from "./page/Signup";
import Payment from "./page/Payment";
import Dashboard from "../admin/main";
import { AdminHome } from "../admin/Home";
import { ListProduct } from "../admin/ListProduct";
import { ListCategory } from "../admin/ListCategory";
import { ListCustomer } from "../admin/ListCustomer";
import PrivateRoute from "./components/PrivateRoute";
import LoggedInRoute from "./components/LoggedInRoute";
import Layout from "./page/Layout";
import { AuthProvider } from "./components/AuthContext";
import RequireAuth from "./components/RequireAuth";
import Profile from "./page/Profile";
import ProductByCategory from "./page/ProductByCategory";
import Order from "./page/Order";
import CustomerDetails from "../admin/CustomerDetails";
import OrderDetails from "../admin/OrderDetails";
import { UpdateCategory } from "../admin/manage/UpdateCategory";
import { CreateCategory } from "../admin/manage/CreateCategory";
import { UpdateProduct } from "../admin/manage/UpdateProduct";
import { CreateProduct } from "../admin/manage/CreateProduct";
import ReportsPage from "../admin/reports/ReportsPage";

export default function Home() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Public Routes */}
                        <Route index element={<HomeComponent />} />
                        <Route
                            path="products/:id"
                            element={<DetailsProduct />}
                        />
                        <Route
                            path="category/:id"
                            element={<ProductByCategory />}
                        />
                        <Route path="products" element={<ProductList />} />
                        <Route path="cart" element={<Cart />} />

                        {/* If user hasn't logged in or sign up */}
                        <Route element={<LoggedInRoute />}>
                            <Route path="auth/login" element={<Login />} />
                            <Route path="auth/register" element={<Signup />} />
                        </Route>

                        {/* Require Auth */}
                        <Route element={<RequireAuth />}>
                            <Route path="profile" element={<Profile />} />
                            <Route path="cart/payment" element={<Payment />} />
                            <Route path="orders" element={<Order />} />
                            {/* And Role is Admin */}
                            <Route path="admin/" element={<PrivateRoute />}>
                                <Route
                                    index
                                    element={
                                        <Dashboard
                                            component={<AdminHome></AdminHome>}
                                        />
                                    }
                                />
                                <Route
                                    path="products"
                                    element={
                                        <Dashboard
                                            component={
                                                <ListProduct></ListProduct>
                                            }
                                        />
                                    }
                                />
                                <Route
                                    path="categories"
                                    element={
                                        <Dashboard
                                            component={
                                                <ListCategory></ListCategory>
                                            }
                                        />
                                    }
                                />
                                <Route
                                    path="customers"
                                    element={
                                        <Dashboard
                                            component={
                                                <ListCustomer></ListCustomer>
                                            }
                                        />
                                    }
                                />
                                <Route
                                    path="customers/:id"
                                    element={
                                        <Dashboard
                                            component={<CustomerDetails />}
                                        />
                                    }
                                />
                                <Route
                                    path="customers/orders/:id"
                                    element={
                                        <Dashboard
                                            component={<OrderDetails />}
                                        />
                                    }
                                />
                                <Route
                                    path="categories/update/:id"
                                    element={
                                        <Dashboard
                                            component={<UpdateCategory />}
                                        />
                                    }
                                />
                                <Route
                                    path="categories/create"
                                    element={
                                        <Dashboard
                                            component={<CreateCategory />}
                                        />
                                    }
                                />
                                <Route
                                    path="products/:id"
                                    element={
                                        <Dashboard
                                            component={<UpdateProduct />}
                                        />
                                    }
                                />
                                <Route
                                    path="products/create"
                                    element={
                                        <Dashboard
                                            component={<CreateProduct />}
                                        />
                                    }
                                />
                                <Route
                                    path="reports"
                                    element={
                                        <Dashboard
                                            component={<ReportsPage />}
                                        />
                                    }
                                />
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}
