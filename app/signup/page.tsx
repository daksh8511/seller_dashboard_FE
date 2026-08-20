"use client";

import React, { useState } from "react";
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
import { Store, User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import NodeApi from "@/utils/NodeApi";
import { toast } from "sonner";

const SignupSchema = Yup.object({
  ownerName: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Owner Name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email address is required"),
  storeName: Yup.string()
    .trim()
    .required("Store name is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      ownerName: "",
      email: "",
      password: "",
      confirmPassword: "",
      storeName: ""
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      handleSignup()
    },
  });

  const handleSignup = async () => {
    try {
      setLoading(true)
      const response = await NodeApi.post('/store/signup', {
        ownerName: formik?.values?.ownerName,
        email: formik?.values?.email,
        password: formik?.values?.password,
        storeName: formik?.values?.storeName
      })


      if (response?.data?.success) {
        const storeData = {
          ownerName: response?.data?.store?.ownerName,
          email: response?.data?.store?.email,
          storeName: response?.data?.store?.storeName,
          _id: response?.data?.store?._id
        }
        localStorage.setItem('auth', JSON.stringify(storeData))
        localStorage.setItem('token', JSON.stringify(response?.data?.token))

        router.push("/dashboard");
      }

    } catch (error) {
      console.error('error : ', error)
      toast.error(error?.response?.data?.msg)
    } finally {
      setLoading(false)
    }
  }

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
              <Label htmlFor="ownerName" required>
                Owner name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <User className="w-4 h-4" />
                </div>
                <Input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  className="pl-9"
                  placeholder="Alex Harrison"
                  value={formik.values.ownerName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.ownerName && formik.errors.ownerName
                      ? formik.errors.ownerName
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

            {/* Store name Field */}
            <div>
              <Label htmlFor="storeName" required>
                Store name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  id="storeName"
                  name="storeName"
                  className="pl-9"
                  placeholder="ShopNova"
                  value={formik.values.storeName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.storeName &&
                      formik.errors.storeName
                      ? formik.errors.storeName
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
              disabled={loading}
            >
              {
                loading && <Loader2 />
              }
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
