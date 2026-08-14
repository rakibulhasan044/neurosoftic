import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { ProductRoutes } from "../modules/product/product.routes";
import { OrderRoutes } from "../modules/order/order.routes";
import { StoreSettingsRoutes } from "../modules/store-settings/store-settings.routes";
import { UploadRoutes } from "../modules/upload/upload.routes";
import { CategoryRoutes } from "../modules/category/category.routes";
import { BrandRoutes } from "../modules/brand/brand.routes";
import { CollectionRoutes } from "../modules/collection/collection.routes";
import { BarcodeRoutes } from "../modules/barcode/barcode.routes";
import { DashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { InventoryRoutes } from "../modules/inventory/inventory.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
import { WishlistRoutes } from "../modules/wishlist/wishlist.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/barcodes",
    route: BarcodeRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/brands",
    route: BrandRoutes,
  },
  {
    path: "/collections",
    route: CollectionRoutes,
  },
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
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
  {
    path: "/inventory",
    route: InventoryRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/wishlist",
    route: WishlistRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
