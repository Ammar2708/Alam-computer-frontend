import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BadgeDollarSign,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchCheckoutSettings,
  updateCheckoutSettings,
} from "@/store/settings-slice";

const currencyFormatter = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
});

const formatCurrency = (amount = 0) =>
  currencyFormatter.format(Number.isFinite(Number(amount)) ? Number(amount) : 0);

function Settings() {
  const dispatch = useDispatch();
  const { checkoutSettings, isLoading, isSaving, error } = useSelector(
    (state) => state.checkoutSettings || {}
  );
  const [draftDeliveryCharge, setDraftDeliveryCharge] = useState("");
  const [isDeliveryChargeDirty, setIsDeliveryChargeDirty] = useState(false);

  useEffect(() => {
    dispatch(fetchCheckoutSettings());
  }, [dispatch]);

  const currentDeliveryCharge = Math.max(
    0,
    Number(checkoutSettings?.deliveryCharge) || 0
  );
  const deliveryChargeValue = isDeliveryChargeDirty
    ? draftDeliveryCharge
    : String(currentDeliveryCharge);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const amount = Number(deliveryChargeValue);

    if (!Number.isFinite(amount) || amount < 0) {
      toast.error("Delivery charge must be a positive number or zero");
      return;
    }

    const result = await dispatch(updateCheckoutSettings({ deliveryCharge: amount }));

    if (result?.payload?.success) {
      setIsDeliveryChargeDirty(false);
      toast.success(result.payload.message || "Checkout settings updated");
      return;
    }

    toast.error(result?.payload?.message || "Failed to update checkout settings");
  };

  const handleRefresh = () => {
    setIsDeliveryChargeDirty(false);
    dispatch(fetchCheckoutSettings());
  };

  const handleFreeDelivery = () => {
    setDraftDeliveryCharge("0");
    setIsDeliveryChargeDirty(true);
  };

  return (
    <div className="min-w-0 space-y-6 p-0 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
            Admin
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Checkout Settings
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Control the delivery charge used at checkout.
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          variant="outline"
          className="h-11 w-full rounded-xl border-slate-200 px-5 font-black text-slate-700 hover:bg-slate-50 lg:w-auto"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Delivery Charge
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {formatCurrency(currentDeliveryCharge)}
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Truck className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Checkout Total
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                Items + Delivery
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BadgeDollarSign className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Status
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {currentDeliveryCharge > 0 ? "Active" : "Free"}
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <SettingsIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <p className="font-bold text-red-700">{error}</p>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Delivery Charge (AED)
            </span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={deliveryChargeValue}
              onChange={(event) => {
                setDraftDeliveryCharge(event.target.value);
                setIsDeliveryChargeDirty(true);
              }}
              placeholder="0.00"
              className="h-12 rounded-xl border-slate-200 text-base font-bold focus-visible:border-red-300 focus-visible:ring-red-100"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleFreeDelivery}
              disabled={isSaving}
              className="h-12 rounded-xl border-slate-200 px-5 font-black text-slate-700 hover:bg-slate-50"
            >
              Free Delivery
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-12 rounded-xl bg-red-600 px-5 font-black text-white hover:bg-red-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Settings;
