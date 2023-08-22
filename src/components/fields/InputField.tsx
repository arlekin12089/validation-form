import { ChangeEvent, useEffect, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";

type InputFieldProps = Omit<TextFieldProps, "onChange"> & {
  label: string;
  value: string;
  fieldType?: string; // Add this prop to know what type of validation to apply
  onChange: (value: string) => void;
};

export const InputField = ({
  onChange,
  label,
  value,
  placeholder,
  ...otherProps
}: InputFieldProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <TextField
      fullWidth
      onChange={handleChange}
      label={label}
      value={value}
      placeholder={placeholder}
      variant="outlined"
      margin="normal"
      {...otherProps}
    />
  );
};
