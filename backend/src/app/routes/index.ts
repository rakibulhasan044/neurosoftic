import express from "express";
import { UserRoutes } from "../modules/user/user.routes";

const router = express.Router();

import { AuthRoutes } from "../modules/auth/auth.routes";

import { ProductRoutes } from "../modules/product/product.routes";

import { OrderRoutes } from "../modules/order/order.routes";

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
