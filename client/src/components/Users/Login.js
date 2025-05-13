import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import StatusMessage from "../Alert/StatusMessage";
import { loginAPI } from "../../apis/usersAPI";
import { useAuth } from "../../auth/AuthContext";

//----- Validation Schema Yup -----
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter A Valid Email")
    .required("Email Is Required"),
  password: Yup.string().required("Password Is Required"),
});

//----- Login Component -----
const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const hasNavigatedRef = useRef(false);

  //----- ReDirect Logged In User -----
  useEffect(() => {
    if (isAuthenticated && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      navigate("/dashboard", { replace: true });
    }

    return () => {
      hasNavigatedRef.current = false;
    };
  }, [isAuthenticated, navigate]);

  //----- Mutation -----
  const mutation = useMutation({ mutationFn: loginAPI });

  //----- Formik Form Handling -----
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    //Handle The Form Submission
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  //----- Handling Logging In -----
  useEffect(() => {
    if (mutation.isSuccess) {
      login();
    }
  }, [mutation.isSuccess, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-300 text-sm">
            Please sign in to your account to continue
          </p>
        </div>
        {mutation.isPending && (
          <StatusMessage type="loading" message="Loading..." />
        )}
        {mutation.isError && (
          <StatusMessage
            type="error"
            message={mutation?.error?.response?.data?.message}
          />
        )}
        {mutation.isSuccess && (
          <StatusMessage type="success" message="Logging In...." />
        )}
        <div className="mb-2"></div>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email Input Field */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-200 block mb-2"
            >
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                {...formik.getFieldProps("email")}
                className="w-full px-4 py-3 border bg-gray-700 border-gray-600 rounded-xl text-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:border-[#5a3470] focus:ring-1 focus:ring-[#5a3470] transition-all duration-200"
                placeholder="name@example.com"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-400 mt-2 text-sm">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password Input Field */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-200 block mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                {...formik.getFieldProps("password")}
                className="w-full px-4 py-3 border bg-gray-700 border-gray-600 rounded-xl text-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:border-[#5a3470] focus:ring-1 focus:ring-[#5a3470] transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-400 mt-2 text-sm">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/register"
                className="font-medium text-[#6d4088] hover:text-[#5a3470] transition-colors duration-200"
              >
                Need an account? Sign up
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#432752] via-[#5a3470] to-[#6d4088] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#432752] transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
