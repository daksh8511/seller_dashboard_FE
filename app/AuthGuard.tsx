"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("token");

        const publicPages = ["/signin", "/signup"];
        const isPublicPage = publicPages.includes(pathname);

        if (!token && !isPublicPage) {
            router.replace("/signin");
            return;
        }

        if (token && isPublicPage) {
            router.replace("/dashboard");
            return;
        }
    }, [pathname, router]);

    return <>{children}</>;
}