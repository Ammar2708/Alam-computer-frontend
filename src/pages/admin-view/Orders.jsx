import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BadgeCheck,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  ReceiptText,
  RefreshCw,
  Search,
  Truck,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
} from "@/store/order-slice";

const currencyFormatter = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
});

const dateFormatter = new Intl.DateTimeFormat("en-AE", {
  dateStyle: "medium",
  timeStyle: "short",
});

const statusMeta = {
  processing: {
    label: "Processing",
    icon: Truck,
    className: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  delivered: {
    label: "Delivered",
    icon: PackageCheck,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-50 text-red-700 ring-red-100",
  },
};

const statusFilters = [
  { value: "all", label: "All" },
  { value: "processing", label: "Processing" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const formatCurrency = (amount = 0) =>
  currencyFormatter.format(Number.isFinite(Number(amount)) ? Number(amount) : 0);

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return dateFormatter.format(date);
};

const formatOrderId = (id = "") =>
  id ? `#${id.slice(-8).toUpperCase()}` : "#ORDER";

const formatPaymentMethod = (value = "") =>
  value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Cash On Delivery";

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
  order?.customerName ||
  order?.cutomerName ||
  order?.userId?.username ||
  order?.userID?.username ||
  "Customer";

const getCustomerEmail = (order) =>
  order?.email || order?.userId?.email || order?.userID?.email || "No email";

const getStatus = (order) =>
  !order?.orderStatus || order.orderStatus === "placed"
    ? "processing"
    : order.orderStatus;

const getStatusMeta = (status) => statusMeta[status] || statusMeta.processing;

function OrderStatusBadge({ status }) {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${meta.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}

function StatTile({ icon: Icon, label, value, accentClassName }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex animate-pulse flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="h-5 w-36 rounded bg-slate-200" />
              <div className="h-4 w-56 rounded bg-slate-100" />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="h-16 rounded-xl bg-slate-100" />
                <div className="h-16 rounded-xl bg-slate-100" />
                <div className="h-16 rounded-xl bg-slate-100" />
              </div>
            </div>
            <div className="h-20 rounded-xl bg-slate-100 lg:w-52" />
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order, onUpdateStatus, updatingStatus }) {
  const status = getStatus(order);
  const items = getOrderItems(order);
  const visibleItems = items.slice(0, 4);
  const hiddenItemCount = Math.max(items.length - visibleItems.length, 0);
  const isFinalStatus = status === "delivered" || status === "cancelled";
  const isUpdating = Boolean(updatingStatus);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-100 hover:shadow-md">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-slate-950">
                  {formatOrderId(order?._id)}
                </h2>
                <OrderStatusBadge status={status} />
              </div>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {formatDate(order?.createdAt)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Total
              </p>
              <p className="mt-1 text-2xl font-black text-red-600">
                {formatCurrency(getOrderTotal(order))}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-y border-slate-100 py-4 md:grid-cols-3">
            <div className="flex min-w-0 gap-3">
              <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Customer
                </p>
                <p className="mt-1 truncate font-bold text-slate-900">
                  {getCustomerName(order)}
                </p>
                <p className="mt-1 flex min-w-0 items-center gap-1.5 truncate text-sm text-slate-500">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{getCustomerEmail(order)}</span>
                </p>
                {order?.phone ? (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <Phone className="h-3.5 w-3.5" />
                    {order.phone}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex min-w-0 gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Delivery
                </p>
                <p className="mt-1 line-clamp-2 font-bold text-slate-900">
                  {order?.address || "Address unavailable"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {[order?.city, order?.postalCode].filter(Boolean).join(", ") ||
                    "City unavailable"}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 gap-3">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Payment
                </p>
                <p className="mt-1 font-bold text-slate-900">
                  {formatPaymentMethod(order?.paymentMethod)}
                </p>
                <p className="mt-1 text-sm capitalize text-slate-500">
                  {order?.paymentStatus || "pending"}
                </p>
              </div>
            </div>
          </div>

          {order?.notes ? (
            <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {order.notes}
            </p>
          ) : null}

          <div className="mt-4 space-y-3">
            {visibleItems.map((item, index) => (
              <div
                key={`${item?.productId || item?.title || "item"}-${index}`}
                className="flex min-w-0 items-center gap-3"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                  {item?.image ? (
                    <img
                      src={item.image}
                      alt={item?.title || "Order item"}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-slate-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900">
                    {item?.title || "Product"}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Qty {item?.quantity || 0} x {formatCurrency(item?.price)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-black text-slate-900">
                  {formatCurrency((Number(item?.price) || 0) * (Number(item?.quantity) || 0))}
                </p>
              </div>
            ))}

            {hiddenItemCount > 0 ? (
              <p className="text-sm font-bold text-slate-500">
                +{hiddenItemCount} more item{hiddenItemCount === 1 ? "" : "s"}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-slate-100 px-4 py-4 xl:w-56">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-500">Items</span>
            <span className="font-black text-slate-950">{getItemCount(order)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-500">Lines</span>
            <span className="font-black text-slate-950">{items.length}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-500">Status</span>
            <span className="font-black capitalize text-slate-950">{status}</span>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Actions
            </p>
            <div className="grid gap-2">
              <Button
                type="button"
                onClick={() => onUpdateStatus(order, "delivered")}
                disabled={isFinalStatus || isUpdating}
                className="h-10 rounded-xl bg-emerald-600 font-black uppercase text-white hover:bg-emerald-700"
              >
                <PackageCheck className="mr-2 h-4 w-4" />
                {updatingStatus === "delivered" ? "Updating" : "Delivered"}
              </Button>
              <Button
                type="button"
                onClick={() => onUpdateStatus(order, "cancelled")}
                disabled={isFinalStatus || isUpdating}
                className="h-10 rounded-xl bg-red-600 font-black uppercase text-white hover:bg-red-700"
              >
                <XCircle className="mr-2 h-4 w-4" />
                {updatingStatus === "cancelled" ? "Updating" : "Cancel"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Orders() {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.orders || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + getOrderTotal(order), 0);
    const totalItems = orders.reduce((sum, order) => sum + getItemCount(order), 0);
    const openOrders = orders.filter((order) => {
      const status = getStatus(order);
      return status !== "delivered" && status !== "cancelled";
    }).length;

    return {
      totalRevenue,
      totalItems,
      openOrders,
      totalOrders: orders.length,
    };
  }, [orders]);

  const statusCounts = useMemo(
    () =>
      orders.reduce(
        (counts, order) => {
          const status = getStatus(order);
          counts[status] = (counts[status] || 0) + 1;
          counts.all += 1;
          return counts;
        },
        { all: 0 }
      ),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const status = getStatus(order);
      const matchesStatus = activeStatus === "all" || status === activeStatus;

      if (!matchesStatus) return false;
      if (!query) return true;

      const itemText = getOrderItems(order)
        .map((item) => `${item?.title || ""} ${item?.productId || ""}`)
        .join(" ");

      const searchableText = [
        order?._id,
        getCustomerName(order),
        getCustomerEmail(order),
        order?.phone,
        order?.city,
        order?.postalCode,
        order?.address,
        itemText,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [activeStatus, orders, searchTerm]);

  const handleRefresh = () => {
    dispatch(fetchAdminOrders());
  };

  const handleUpdateOrderStatus = async (order, orderStatus) => {
    if (!order?._id) return;

    const currentStatus = getStatus(order);
    if (currentStatus === orderStatus) {
      toast.info(`Order is already ${orderStatus}`);
      return;
    }

    if (currentStatus === "delivered" || currentStatus === "cancelled") {
      toast.info("This order is already closed");
      return;
    }

    setUpdatingOrder({ id: order._id, status: orderStatus });

    const result = await dispatch(
      updateAdminOrderStatus({
        orderId: order._id,
        orderStatus,
      })
    );

    setUpdatingOrder(null);

    if (result?.payload?.success) {
      toast.success(result.payload.message || "Order status updated");
      return;
    }

    toast.error(result?.payload?.message || "Failed to update order status");
  };

  return (
    <div className="min-w-0 space-y-6 p-0 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
            Admin
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Orders
          </h1>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={loading}
          className="h-11 w-full rounded-xl bg-red-600 px-5 font-bold text-white shadow-sm hover:bg-red-700 lg:w-auto"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={ReceiptText}
          label="Orders"
          value={stats.totalOrders}
          accentClassName="bg-red-50 text-red-600"
        />
        <StatTile
          icon={BadgeCheck}
          label="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          accentClassName="bg-emerald-50 text-emerald-600"
        />
        <StatTile
          icon={Clock3}
          label="Open"
          value={stats.openOrders}
          accentClassName="bg-amber-50 text-amber-600"
        />
        <StatTile
          icon={Package}
          label="Items"
          value={stats.totalItems}
          accentClassName="bg-slate-100 text-slate-700"
        />
      </div>

      <div className="flex flex-col gap-3 border-y border-slate-100 py-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search orders"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:ring-4 focus:ring-red-100"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
          {statusFilters.map((filter) => {
            const isActive = activeStatus === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveStatus(filter.value)}
                className={`h-10 shrink-0 rounded-xl px-4 text-sm font-black transition ${
                  isActive
                    ? "bg-red-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {filter.label}
                <span className="ml-2 text-xs opacity-75">
                  {statusCounts[filter.value] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <p className="font-bold text-red-700">{error}</p>
          <Button
            onClick={handleRefresh}
            className="mt-4 h-10 rounded-xl bg-red-600 px-4 font-bold text-white hover:bg-red-700"
          >
            Try Again
          </Button>
        </div>
      ) : loading ? (
        <OrderSkeleton />
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center">
          <ShoppingBagIcon />
          <h2 className="mt-5 text-xl font-black text-slate-950">
            No orders found
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {orders.length === 0
              ? "Orders will appear here after customers check out."
              : "No orders match the current search or status."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order?._id}
              order={order}
              onUpdateStatus={handleUpdateOrderStatus}
              updatingStatus={
                updatingOrder?.id === order?._id ? updatingOrder.status : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ShoppingBagIcon() {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
      <Package className="h-8 w-8" />
    </div>
  );
}

export default Orders;
