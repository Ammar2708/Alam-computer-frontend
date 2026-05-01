import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommonForm from "@/components/comman/Form";
import { regiterFormConrol } from "@/config";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { registerUser } from "../../store/auth-slice";

const initialState = {
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(registerUser(formData)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        toast.success("Account created successfully", {
          description: "You can now login",
        });

        navigate("/auth/login");
      } else {
        toast.error("Account creation failed", {
          description: "Please try again",
        });
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

      {/* Register Section */}
      <div className="flex items-center justify-center p-6">

        <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-red-200 shadow-xl">

          <h2 className="text-3xl font-bold text-center text-red-600">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mt-2">
            Sign up to get started
          </p>

          <div className="mt-6">
            <CommonForm
              formControls={regiterFormConrol}
              buttonText="Sign Up"
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
            />
          </div>

          <p className="text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-red-600 hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default AuthRegister;