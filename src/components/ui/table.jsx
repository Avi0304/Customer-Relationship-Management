import React from "react";

export function Table({ children }) {
  return <table className="w-full border-collapse">{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="bg-gray-100">{children}</thead>;
}

export function TableRow({ children }) {
  return (
    <tr className="border-b border-gray-300 hover:bg-gray-100 px-4 py-3">
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "" }) {
  return <th className={`px-4 py-3 text-left ${className}`}>{children}</th>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableCell({ children, className }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
