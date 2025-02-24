import React from "react";
import clsx from "clsx";

export function Card({ className, children }) {
  return (
    <div className={clsx("rounded-lg border border-gray-300 bg-white p-4 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={clsx("mb-4 flex items-center justify-between", className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h2 className={clsx("text-lg font-bold", className)}>{children}</h2>;
}

export function CardContent({ className, children }) {
  return <div className={clsx("text-gray-700", className)}>{children}</div>;
}
