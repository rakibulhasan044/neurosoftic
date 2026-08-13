import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { ProductRoutes } from "../modules/product/product.routes";
import { OrderRoutes } from "../modules/order/order.routes";
import { StoreSettingsRoutes } from "../modules/store-settings/store-settings.routes";
import { UploadRoutes } from "../modules/upload/upload.routes";

const router = express.Router();

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
  {
    path: "/store-settings",
    route: StoreSettingsRoutes,
  },
  {
    path: "/upload",
    route: UploadRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
