import { Dropdown } from "./fields/Dropdown.tsx";
import { useState, useEffect } from "react";
import { addField, FieldType } from "../store/form.ts";
import { Button, Grid, Typography, Box } from "@mui/material";
import { InputField } from "./fields/InputField.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/config.ts";

// Validation utility functions
const isAtLeastFive = (value: string) => parseFloat(value) >= 5;
const startsWithCapitalLetter = (value: string) => /^[A-Z]/.test(value);
const matchesEmailPattern = (value: string) =>
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
const hasNoSpecialChars = (value: string) => /^[a-zA-Z0-9 ]*$/.test(value);
const isValidDate = (value: string) => !isNaN(Date.parse(value));

export const FormBuilder = () => {
  const [currentType, setCurrentType] = useState("");
  const [currentKey, setCurrentKey] = useState("");
  const [currentLabel, setCurrentLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { fields } = useSelector((state: RootState) => state.form);

  useEffect(() => {
    if (currentType === FieldType.Date) {
      setPlaceholder("YYYY-MM-DD");
    } else {
      setPlaceholder(null);
    }
  }, [currentType]);

  const validateField = (type: FieldType, value: string) => {
    let validationMessage: string | null = null;
    const ruleMap: { [key in FieldType]?: () => boolean } = {
      [FieldType.Number]: () => isAtLeastFive(value),
      [FieldType.String]: () =>
        startsWithCapitalLetter(value) && hasNoSpecialChars(value),
      [FieldType.Date]: () => isValidDate(value),
      [FieldType.Email]: () => matchesEmailPattern(value),
    };

    if (!ruleMap[type]?.()) {
      switch (type) {
        case FieldType.Number:
          validationMessage = "Value must be at least 5.";
          break;
        case FieldType.String:
          validationMessage = !startsWithCapitalLetter(value)
            ? "String must start with a capital letter."
            : !hasNoSpecialChars(value)
            ? "String must not have special characters."
            : null;
          break;
        case FieldType.Date:
          validationMessage = "Please enter a valid date.";
          break;
        case FieldType.Email:
          validationMessage = "Please enter a valid email address.";
          break;
      }
    }
    return validationMessage;
  };

  const handleAddingField = () => {
    setError(null);
    const validationError = validateField(
      currentType as FieldType,
      currentLabel
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    if (fields[currentKey] !== undefined) {
      setError("Key already exists");
      return;
    }

    if (currentType === FieldType.Number && isNaN(Number(currentLabel))) {
      setError("Please enter a valid number for the label.");
      return;
    }

    if (currentType === FieldType.Date && isNaN(Date.parse(currentLabel))) {
      setError("Please enter a valid date for the label.");
      return;
    }

    if (
      currentType === FieldType.Boolean &&
      !["true", "false"].includes(currentLabel.toLowerCase())
    ) {
      setError("Please enter either true or false for the label.");
      return;
    }

    if (currentType && currentKey && currentLabel) {
      dispatch(
        addField({
          key: currentKey,
          type: currentType as FieldType,
          label: currentLabel,
        })
      );
      // Reset fields after successful addition
      setCurrentKey("");
      setCurrentLabel("");
      setCurrentType("");
    }
  };

  return (
    <Grid container spacing={2} sx={{ width: 300, margin: "auto" }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Form Builder
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Dropdown
          label="Choose a field type"
          value={currentType}
          onChange={(type) => setCurrentType(type)}
          options={{
            Number: FieldType.Number,
            String: FieldType.String,
            Date: FieldType.Date,
            Boolean: FieldType.Boolean,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <InputField
          onChange={(value) => setCurrentKey(value)}
          label="Key"
          value={currentKey}
        />
      </Grid>
      <Grid item xs={12}>
        <InputField
          placeholder={placeholder}
          fieldType={currentType as FieldType}
          onChange={(value) => setCurrentLabel(value)}
          label="Label"
          value={currentLabel}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleAddingField}>
          Add Field
        </Button>
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Box color="error.main">{error}</Box>
        </Grid>
      )}
    </Grid>
  );
};
