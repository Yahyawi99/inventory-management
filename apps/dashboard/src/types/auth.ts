export type authOptionsType = {
  type: "Email" | "Google" | "Phone" | "Code";
  icon: string;
  label: string;
};

export interface AuthOptionsSelectorProps {
  selectedOption: "Email" | "Google" | "Phone" | "Code";
  onSelectOption: (option: "Email" | "Google" | "Phone" | "Code") => void;
}

export interface AuthOptionProps extends AuthOptionsSelectorProps {
  option: authOptionsType;
}
export interface User {
  id: string | undefined;
  name: string;
  email: string;
  activeOrganizationId?: string | null | undefined;
}
