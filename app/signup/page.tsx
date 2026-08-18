"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Store, User, Mail, Lock, ArrowRight } from "lucide-react";

const SignupSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Full Name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function SignupPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      router.push("/dashboard");
    },
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-zinc-50 dark:bg-black text-black dark:text-white">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 rounded bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
          <Store className="w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight">ShopNova</span>
      </div>

      <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Seller Account</CardTitle>
          <CardDescription>
            Join ShopNova to start managing and selling your products
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" required>
                Full Name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <User className="w-4 h-4" />
                </div>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="pl-9"
                  placeholder="Alex Harrison"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.fullName && formik.errors.fullName
                      ? formik.errors.fullName
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="email" required>
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="pl-9"
                  placeholder="seller@shopnova.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.email && formik.errors.email
                      ? formik.errors.email
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" required>
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="pl-9"
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && formik.errors.password
                      ? formik.errors.password
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <Label htmlFor="confirmPassword" required>
                Confirm Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="pl-9"
                  placeholder="••••••••"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                      ? formik.errors.confirmPassword
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full space-x-2 mt-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-black dark:text-white underline hover:opacity-80 transition-opacity"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
