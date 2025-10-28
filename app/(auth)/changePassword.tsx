import { ChangePasswordRequest } from "@/types/auth";
import { useState } from "react";

  const usechangePasswordForm = () => {
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    currentPassword:"",
    newPassword: "", 
    newPasswordConfirmation:""
  });
  const [errors, setErrors] = useState<Partial<ChangePasswordRequest>>({});

  const updateField = (field: keyof ChangePasswordRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ChangePasswordRequest> = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "New password is required";
    } else if (formData.currentPassword.length < 8) {
      newErrors.currentPassword = "Password must be at least 8 characters";
    }
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.newPasswordConfirmation.trim()) {
      newErrors.newPasswordConfirmation = "Password confirmation is required";
    } else if (formData.newPassword !== formData.newPasswordConfirmation) {
      newErrors.newPasswordConfirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({ 
      currentPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm,
  };
};

export default usechangePasswordForm 