import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid"; // Import UUID to generate unique IDs

interface InputProps {
  placeholder: string;
  type: "email" | "password" | "text";
  value: string;
  onChange: (value: string) => void;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  type,
  value,
  onChange,
  isPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // Generate a unique ID for each input field
  const inputId = React.useMemo(() => uuidv4(), []);

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const labelClass = `absolute text-white left-4 transition-all duration-200 ${
    value || isFocused
      ? "top-0 text-xs transform -translate-y-1/2 bg-darkBlue-light p-2 rounded-md"
      : "top-1/2 transform -translate-y-1/2"
  }`;

  return (
    <div className="flex items-center rounded-md w-full mt-6 bg-darkBlue-light relative">
      <label htmlFor={inputId} className={labelClass}>
        {placeholder}
      </label>
      <input
        id={inputId}
        type={type === "password" && !showPassword ? "password" : "text"}
        className="font-medium rounded-lg text-gray-200 text-sm w-full px-4 py-4 placeholder-transparent focus:outline-none focus:ring-0 bg-inherit"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {type === "password" && (
        <button onClick={handlePasswordVisibility} className="px-4">
          {showPassword ? (
            <FaRegEyeSlash size={20} color="#374151" />
          ) : (
            <FaRegEye size={20} color="#374151" />
          )}
        </button>
      )}
    </div>
  );
};
