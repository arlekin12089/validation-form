# validation-form
# Field Input Validation
1. Update store/Form.ts
2. Move the validation logic into the handleChange method and validate accordingly based on the fieldType prop.
3. Update FormView.tsx
4. Update FormBuilder.tsx. Modify the InputField for the key to only accept a specific pattern if desired
   
# Dynamic validation
Utility Functions: There are five validation methods:

Check if value ≥ 5.
Verify if a string starts with a capital letter.
Validate email format.
Ensure no special characters in a string.
Confirm a valid date format.
Validation Application: Before adding a field, the handleAddingField method uses a new function, validateField, to confirm if the entered data adheres to the required validations for its type.

Error Display: Any validation error will appear to the user at the bottom of your form.

No UI changes were made. Validations occur automatically based on the selected field type.
