"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LogoutButton({
    callbackUrl = "/login",
    children = "Sair",
    className,
}: LogoutButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        setLoading(true);
        try {
            // Clear localStorage keys used by the app for auth
            try {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } catch (e) {
                // ignore localStorage errors (e.g., in some privacy modes)
                // but continue to sign out
            }

            // Perform next-auth signOut which will clear session cookies server-side
            // and redirect to the provided callbackUrl
            await signOut({ redirect: true, callbackUrl });
        } finally {
            // In case signOut doesn't redirect (blocked or client environment), ensure loading is reset
            setLoading(false);
        }
    };

    return (
        <Button
            type="button"
            onClick={handleSignOut}
            className={className}
            disabled={loading}
            aria-busy={loading}
            aria-label="Sair"
        >
            {loading ? "Saindo..." : children}
        </Button>
    );
}
