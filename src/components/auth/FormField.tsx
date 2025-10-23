import React from "react";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  toggle?: () => void;
  toggleIcon?: React.ReactNode;
  autoComplete?: string;
  disabled?: boolean; // ✅ Add disabled
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
  autoComplete,
  disabled,
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative flex items-center">
        {icon && <div className="absolute left-3">{icon}</div>}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled} // ✅ apply prop
          className={`w-full pl-10 pr-10 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            error ? "border-red-500" : "border-gray-300"
          } disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
        {toggleIcon && (
          <div className="absolute right-3" onClick={toggle}>
            {toggleIcon}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FormField;
export type { FormFieldProps };
