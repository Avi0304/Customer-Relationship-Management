import React from "react";
import clsx from "clsx";

export function Table({ children, className = "" }) {
  return (
    <table className={clsx("w-full border-collapse", className)}>
      {children}
    </table>
  );
}

export function TableHeader({ children, className = "" }) {
  return <thead className={clsx("bg-gray-100 hover:bg-gray-100", className)}>{children}</thead>;
}

export function TableRow({ children, className = "" }) {
  return (
    <tr
      className={clsx("border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100", className)}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "" }) {
  return (
    <th className={clsx("px-4 py-3 text-left font-semibold", className)}>
      {children}
    </th>
  );
}

export function TableBody({ children, className = "" }) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableCell({ children, className = "" }) {
  return <td className={clsx("px-4 py-3", className)}>{children}</td>;
}
