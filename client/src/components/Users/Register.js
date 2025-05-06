import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { regesterAPI } from "../../apis/usersAPI";
import StatusMessage from "../Alert/StatusMessage";
import { useAuth } from "../../auth/AuthContext";

//----- Validation Schema Yup -----
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter A Valid Email.")
    .required("Email Is Required"),
  password: Yup.string().required("Password Is Required"),
  username: Yup.string().required("Username Is Required"),
});

const Registration = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  //----- ReDirect Logged In User -----
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  //----- Mutation -----
  const mutation = useMutation({ mutationFn: regesterAPI });

  //----- Formik Form Handling -----
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Create Account
          </h2>
          <p className="text-center text-gray-300 text-sm">
            Get started with your free account today. No credit card required.
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
          <StatusMessage type="success" message="Registration Successfull" />
        )}
        <div className="mb-2"></div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Username Input Field */}
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-200 block mb-2"
            >
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                {...formik.getFieldProps("username")}
                className="w-full px-4 py-3 border bg-gray-700 border-gray-600 rounded-xl text-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:border-[#5a3470] focus:ring-1 focus:ring-[#5a3470] transition-all duration-200"
                placeholder="Choose a username"
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-400 mt-2 text-sm">
                {formik.errors.username}
              </div>
            )}
          </div>

          {/* Email Input Field */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-200 block mb-2"
            >
              Email Address
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
                placeholder="Create a password"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-400 mt-2 text-sm">
                {formik.errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#432752] via-[#5a3470] to-[#6d4088] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#432752] transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Create Account
          </button>
        </form>

        <div className="text-sm mt-4 text-center">
          <Link
            to="/login"
            className="font-medium text-[#6d4088] hover:text-[#5a3470] transition-colors duration-200"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;
