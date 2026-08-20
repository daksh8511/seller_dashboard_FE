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
import { Store, ArrowRight, Lock, Mail, Loader2 } from "lucide-react";
import NodeApi from "@/utils/NodeApi";
import { toast } from "sonner";

const SigninSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SigninPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: SigninSchema,
    onSubmit: (values) => {
      SigninStore()
    },
  });

  const SigninStore = async () => {
    try {
      setLoading(true)
      const response = await NodeApi.post('/store/signin', {
        email: formik?.values?.email,
        password: formik?.values?.password,
      })

      if (response?.data?.success) {
        toast.success(response?.data?.msg)
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
      console.log('error : ', error)
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
          <CardTitle className="text-2xl">Sign In to Dashboard</CardTitle>
          <CardDescription>
            Enter your credentials to access your seller account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-5">
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full space-x-2 mt-2"
              disabled={loading}
            >
              {loading && <Loader2 />}
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Don&apos;t have a seller account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-black dark:text-white underline hover:opacity-80 transition-opacity"
            >
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
