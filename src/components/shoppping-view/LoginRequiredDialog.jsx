import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Lock, Mail, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/store/auth-slice";

const initialState = {
  email: "",
  password: "",
};

function LoginRequiredDialog({
  open,
  onOpenChange,
  onLoginSuccess,
  title = "Login Required",
  description = "Please login before adding products to your cart.",
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setIsSubmitting(true);
      const action = await dispatch(loginUser(formData));
      const payload = action?.payload;
      const loggedInUser = payload?.user;

      if (action.meta.requestStatus === "fulfilled" && payload?.success !== false) {
        toast.success("Login successful");
        setFormData(initialState);
        onLoginSuccess?.(loggedInUser);
        onOpenChange?.(false);
        return;
      }

      toast.error(payload?.message || "Login failed");
    } catch {
      toast.error("Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-0 bg-white p-0 shadow-[0_24px_70px_rgba(153,27,27,0.25)] sm:max-w-md">
        <div className="bg-red-600 px-6 py-6 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
            <ShoppingCart className="h-6 w-6" />
          </div>

          <DialogHeader className="mt-4 gap-2 text-left">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-red-50">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div>
            <label className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">
              Email
            </label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="h-11 rounded-xl border-gray-200 pl-10 focus-visible:ring-red-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">
              Password
            </label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="h-11 rounded-xl border-gray-200 pl-10 pr-11 focus-visible:ring-red-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-red-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-red-600 text-sm font-black uppercase tracking-[0.16em] text-white hover:bg-red-700"
          >
            {isSubmitting ? "Logging In..." : "Login"}
          </Button>

          <p className="text-center text-sm font-medium text-gray-500">
            Do not have an account?{" "}
            <Link
              to="/auth/register"
              onClick={() => onOpenChange?.(false)}
              className="font-black text-red-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LoginRequiredDialog;
