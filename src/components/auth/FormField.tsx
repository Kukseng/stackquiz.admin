"use client";

import React from "react";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  toggle?: () => void;
  toggleIcon?: React.ReactNode;
  autoComplete?: string; // <-- add this
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
  error,
  icon,
  toggle,
  toggleIcon,
  autoComplete, // <-- receive prop
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-gray-700 text-sm font-semibold mb-1">
        {label}
      </label>
      <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400">
        {icon && <span className="mr-2">{icon}</span>}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={autoComplete} // <-- use here
          className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400"
        />
        {toggle && toggleIcon && (
          <span onClick={toggle} className="ml-2">
            {toggleIcon}
          </span>
        )}
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default FormField;