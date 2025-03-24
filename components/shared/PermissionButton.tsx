"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import React from "react";

interface PermissionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission: string;
  action: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  asChild?: boolean;
}

export function PermissionButton({
  permission,
  action,
  fallback = null,
  asChild = false,
  children,
  ...props
}: PermissionButtonProps) {
  const { checkPermission } = useAuth();

  const hasPermission = checkPermission(permission, action);

  if (!hasPermission) {
    return fallback;
  }

  if (asChild) {
    // Pass through the children directly if asChild is true
    return <>{children}</>;
  }

  return <Button {...props}>{children}</Button>;
}
