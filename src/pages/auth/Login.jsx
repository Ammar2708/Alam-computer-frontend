import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { loginUser } from "../../store/auth-slice";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function onSubmit(e) {
    e.preventDefault();

    dispatch(loginUser(formData)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        toast.success("Login Success");
        navigate("/admin/dashboard");
      } else {
        toast.error("Login Failed");
      }
    });
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white">

      {/* Left Branding */}
      <div className="hidden md:flex flex-col items-center justify-center bg-red-600 text-white p-10">

        <h1 className="text-5xl font-bold">
          Alam Computer
        </h1>

        <p className="mt-4 text-lg text-red-100">
          Your Trusted Computer Store
        </p>

        <p className="mt-2 text-sm text-red-200">
          Laptops • Accessories • Gaming
        </p>

      </div>

      {/* Login Section */}
      <div className="flex items-center justify-center p-6">

        <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-red-200 shadow-xl">

          <h2 className="text-3xl font-bold text-center text-red-600">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 mt-2">
            Login to your account
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:border-red-500 outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 p-3 rounded-lg border border-gray-300 focus:border-red-500 outline-none"
              />

              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition"
            >
              Login
            </button>

          </form>

          {/* Register Link */}
          <p className="text-center text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-red-600 hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default AuthLogin;