import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Boxes,
  ChartNoAxesCombined,
  Clock3,
  Images,
  PackageCheck,
  ReceiptText,
  ShoppingBasket,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAllProducts } from "@/store/admin/product-slice/Index";
import { fetchAdminOrders } from "@/store/order-slice";
import { fetchAllSliders } from "@/store/slider/sliderSlice";

const currencyFormatter = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
});

const dateFormatter = new Intl.DateTimeFormat("en-AE", {
  dateStyle: "medium",
});

const periodOptions = [
  { value: "day", label: "Day", detail: "Today" },
  { value: "week", label: "Week", detail: "This week" },
  { value: "month", label: "Month", detail: "This month" },
  { value: "year", label: "Year", detail: "This year" },
];

const statusMeta = {
  processing: {
    label: "Processing",
    icon: Truck,
    className: "bg-amber-50 text-amber-700",
  },
  delivered: {
    label: "Delivered",
    icon: PackageCheck,
    className: "bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-50 text-red-700",
  },
};

const formatCurrency = (amount = 0) =>
  currencyFormatter.format(Number.isFinite(Number(amount)) ? Number(amount) : 0);

const formatDate = (value) => {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";

  return dateFormatter.format(date);
};

const getStatus = (order) =>
  !order?.orderStatus || order.orderStatus === "placed"
    ? "processing"
    : order.orderStatus;

const getOrderItems = (order) => (Array.isArray(order?.items) ? order.items : []);

const getOrderTotal = (order) => {
  const savedTotal = Number(order?.totalAmount);
  if (Number.isFinite(savedTotal)) return savedTotal;

  return getOrderItems(order).reduce(
    (sum, item) =>
      sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 0),
    0
  );
};

const getItemCount = (order) =>
  getOrderItems(order).reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);

const getCustomerName = (order) =>
  order?.customerName || order?.userId?.username || order?.userID?.username || "Customer";

const getProductPrice = (product) => {
  const salePrice = Number(product?.salePrice);
  const price = Number(product?.price);

  return salePrice > 0 ? salePrice : Number.isFinite(price) ? price : 0;
};

const getPeriodRange = (period) => {
  const now = new Date();
  const start = new Date(now);

  start.setHours(0, 0, 0, 0);

  if (period === "week") {
    start.setDate(start.getDate() - start.getDay());
  }

  if (period === "month") {
    start.setDate(1);
  }

  if (period === "year") {
    start.setMonth(0, 1);
  }

  return { start, end: now };
};

const isOrderInPeriod = (order, period) => {
  const orderDate = new Date(order?.createdAt || order?.updatedAt || 0);
  if (Number.isNaN(orderDate.getTime())) return false;

  const { start, end } = getPeriodRange(period);
  return orderDate >= start && orderDate <= end;
};

function MetricTile({
  icon: Icon,
  label,
  value,
  detail,
  tone = "red",
  isMoney = false,
}) {
  const tones = {
    red: "bg-red-50 text-red-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-sky-50 text-sky-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>
          <p
            className={`mt-2 font-black leading-tight text-slate-950 ${
              isMoney
                ? "break-words text-[clamp(1.35rem,1.65vw,1.75rem)]"
                : "text-2xl"
            }`}
          >
            {value}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500">{detail}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            tones[tone] || tones.red
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, actionTo, actionLabel }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
      {actionTo ? (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-1 text-sm font-black text-red-600 transition hover:text-red-700"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

function StatusPill({ status }) {
  const meta = statusMeta[status] || statusMeta.processing;
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${meta.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}

function Dashboard() {
  const dispatch = useDispatch();
  const [activePeriod, setActivePeriod] = useState("month");
  const { productList = [], isLoading: productsLoading } = useSelector(
    (state) => state.adminProducts || {}
  );
  const { orders = [], loading: ordersLoading } = useSelector(
    (state) => state.orders || {}
  );
  const { sliderList = [], isLoading: slidersLoading } = useSelector(
    (state) => state.slider || {}
  );

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAdminOrders());
    dispatch(fetchAllSliders());
  }, [dispatch]);

  const isLoading = productsLoading || ordersLoading || slidersLoading;
  const activePeriodLabel =
    periodOptions.find((option) => option.value === activePeriod)?.detail ||
    "This month";

  const dashboardData = useMemo(() => {
    const periodOrders = orders.filter((order) =>
      isOrderInPeriod(order, activePeriod)
    );
    const deliveredOrders = periodOrders.filter(
      (order) => getStatus(order) === "delivered"
    );
    const processingOrders = periodOrders.filter(
      (order) => getStatus(order) === "processing"
    );
    const cancelledOrders = periodOrders.filter(
      (order) => getStatus(order) === "cancelled"
    );

    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + getOrderTotal(order),
      0
    );
    const pendingRevenue = processingOrders.reduce(
      (sum, order) => sum + getOrderTotal(order),
      0
    );
    const itemsSold = deliveredOrders.reduce(
      (sum, order) => sum + getItemCount(order),
      0
    );

    const totalStock = productList.reduce(
      (sum, product) => sum + (Number(product?.totalStock) || 0),
      0
    );
    const inventoryValue = productList.reduce(
      (sum, product) =>
        sum + getProductPrice(product) * (Number(product?.totalStock) || 0),
      0
    );
    const lowStockProducts = productList
      .filter((product) => {
        const stock = Number(product?.totalStock) || 0;
        return stock > 0 && stock <= 5;
      })
      .sort((a, b) => (Number(a?.totalStock) || 0) - (Number(b?.totalStock) || 0));
    const outOfStockProducts = productList.filter(
      (product) => (Number(product?.totalStock) || 0) <= 0
    );

    const categories = productList.reduce((counts, product) => {
      const category = product?.category || "Uncategorized";
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    }, {});
    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const activeSliders = sliderList.filter((slider) => slider?.isActive).length;
    const recentOrders = [...periodOrders]
      .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
      .slice(0, 5);

    return {
      activeSliders,
      cancelledOrders,
      deliveredOrders,
      inventoryValue,
      itemsSold,
      lowStockProducts,
      outOfStockProducts,
      pendingRevenue,
      periodOrders,
      processingOrders,
      recentOrders,
      topCategories,
      totalRevenue,
      totalStock,
    };
  }, [activePeriod, orders, productList, sliderList]);

  const fulfillmentTotal = Math.max(dashboardData.periodOrders.length, 1);
  const orderStatusRows = [
    {
      label: "Processing",
      value: dashboardData.processingOrders.length,
      tone: "bg-amber-500",
    },
    {
      label: "Delivered",
      value: dashboardData.deliveredOrders.length,
      tone: "bg-emerald-500",
    },
    {
      label: "Cancelled",
      value: dashboardData.cancelledOrders.length,
      tone: "bg-red-500",
    },
  ];

  return (
    <div className="min-w-0 space-y-6 p-0 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
            Alam Computer
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Dashboard
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {formatDate(new Date())}
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex w-full gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1 shadow-sm sm:w-auto">
            {periodOptions.map((option) => {
              const isActive = activePeriod === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setActivePeriod(option.value)}
                  className={`h-9 shrink-0 rounded-xl px-4 text-sm font-black transition ${
                    isActive
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              asChild
              className="h-11 rounded-xl bg-red-600 px-5 font-black text-white hover:bg-red-700"
            >
              <Link to="/admin/orders">
                <BadgeCheck className="mr-2 h-4 w-4" />
                Orders
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl border-slate-200 px-5 font-black text-slate-700 hover:bg-slate-50"
            >
              <Link to="/admin/products">
                <ShoppingBasket className="mr-2 h-4 w-4" />
                Products
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          icon={Wallet}
          label="Delivered Revenue"
          value={formatCurrency(dashboardData.totalRevenue)}
          detail={`${dashboardData.deliveredOrders.length} completed orders - ${activePeriodLabel}`}
          tone="emerald"
          isMoney
        />
        <MetricTile
          icon={Clock3}
          label="Processing"
          value={dashboardData.processingOrders.length}
          detail={`${formatCurrency(dashboardData.pendingRevenue)} awaiting - ${activePeriodLabel}`}
          tone="amber"
        />
        <MetricTile
          icon={Boxes}
          label="Inventory"
          value={productList.length}
          detail={`${dashboardData.totalStock} units in stock`}
          tone="red"
        />
        <MetricTile
          icon={AlertTriangle}
          label="Stock Alerts"
          value={
            dashboardData.lowStockProducts.length +
            dashboardData.outOfStockProducts.length
          }
          detail={`${dashboardData.outOfStockProducts.length} out of stock`}
          tone="blue"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader title="Order Pipeline" actionTo="/admin/orders" actionLabel="Manage" />

          <div className="space-y-4">
            {orderStatusRows.map((row) => {
              const percent = Math.round((row.value / fulfillmentTotal) * 100);

              return (
                <div key={row.label}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-black text-slate-800">{row.label}</span>
                    <span className="font-bold text-slate-500">
                      {row.value} orders
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${row.tone}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Items Sold
              </p>
              <p className="mt-2 text-xl font-black text-slate-950">
                {dashboardData.itemsSold}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Inventory Value
              </p>
              <p className="mt-2 break-words text-[clamp(1rem,1.35vw,1.25rem)] font-black leading-tight text-slate-950">
                {formatCurrency(dashboardData.inventoryValue)}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Active Slides
              </p>
              <p className="mt-2 text-xl font-black text-slate-950">
                {dashboardData.activeSliders}/{sliderList.length}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader
            title="Catalog Mix"
            actionTo="/admin/products"
            actionLabel="Inventory"
          />

          {dashboardData.topCategories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
              <ShoppingBasket className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-500">
                No products yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.topCategories.map(([category, count]) => {
                const percent = Math.round((count / Math.max(productList.length, 1)) * 100);

                return (
                  <div key={category}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-black text-slate-800">
                        {category}
                      </span>
                      <span className="font-bold text-slate-500">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-red-600"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader title="Recent Orders" actionTo="/admin/orders" actionLabel="Open" />

          {isLoading && orders.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : dashboardData.recentOrders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
              <ReceiptText className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-500">
                No orders yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dashboardData.recentOrders.map((order) => (
                <div
                  key={order?._id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-black text-slate-950">
                        #{order?._id?.slice(-8).toUpperCase() || "ORDER"}
                      </p>
                      <StatusPill status={getStatus(order)} />
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-slate-500">
                      {getCustomerName(order)} - {getItemCount(order)} item
                      {getItemCount(order) === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-black text-red-600">
                      {formatCurrency(getOrderTotal(order))}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      {formatDate(order?.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader
            title="Inventory Watch"
            actionTo="/admin/products"
            actionLabel="Restock"
          />

          {dashboardData.lowStockProducts.length === 0 &&
          dashboardData.outOfStockProducts.length === 0 ? (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-8 text-center">
              <PackageCheck className="mx-auto h-8 w-8 text-emerald-600" />
              <p className="mt-3 text-sm font-black text-emerald-700">
                Stock levels look healthy
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {[...dashboardData.outOfStockProducts, ...dashboardData.lowStockProducts]
                .slice(0, 6)
                .map((product) => {
                  const stock = Number(product?.totalStock) || 0;

                  return (
                    <div
                      key={product?._id}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                          {product?.image ? (
                            <img
                              src={product.image}
                              alt={product?.title || "Product"}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <ShoppingBasket className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-black text-slate-950">
                            {product?.title || "Product"}
                          </p>
                          <p className="mt-1 truncate text-sm font-medium text-slate-500">
                            {product?.category || "Uncategorized"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                          stock <= 0
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {stock <= 0 ? "Out" : `${stock} left`}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to="/admin/products"
          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-100 hover:bg-red-50/40"
        >
          <div>
            <p className="font-black text-slate-950">Products</p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Catalog and stock
            </p>
          </div>
          <ShoppingBasket className="h-5 w-5 text-red-600" />
        </Link>

        <Link
          to="/admin/orders"
          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-100 hover:bg-red-50/40"
        >
          <div>
            <p className="font-black text-slate-950">Orders</p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Fulfillment queue
            </p>
          </div>
          <ChartNoAxesCombined className="h-5 w-5 text-red-600" />
        </Link>

        <Link
          to="/admin/slider"
          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-100 hover:bg-red-50/40"
        >
          <div>
            <p className="font-black text-slate-950">Homepage</p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Sliders and campaigns
            </p>
          </div>
          <Images className="h-5 w-5 text-red-600" />
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
