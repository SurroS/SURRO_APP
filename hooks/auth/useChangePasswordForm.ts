
import { ChangePasswordRequest } from "@/types/auth";
import { useState, useMemo } from "react";

export interface PasswordRule {
  label: string;
  met: boolean;
}

const useChangePasswordForm = () => {
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    currentPassword:"",
    newPassword: "", 
    newPasswordConfirmation:""
  });
  const [errors, setErrors] = useState<Partial<ChangePasswordRequest>>({});

  const passwordRules: PasswordRule[] = useMemo(() => [
    { label: "At least 8 characters", met: formData.newPassword.length >= 8 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(formData.newPassword) },
    { label: "At least one lowercase letter", met: /[a-z]/.test(formData.newPassword) },
    { label: "At least one number", met: /\d/.test(formData.newPassword) },
    { label: "At least one special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) },
  ], [formData.newPassword]);

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
      newErrors.currentPassword = "Current password is required";
    }
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (!passwordRules.every((r) => r.met)) {
      newErrors.newPassword = "Password does not meet all requirements";
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
    passwordRules,
    updateField,
    validateForm,
    resetForm,
  };
};

export default useChangePasswordForm; 