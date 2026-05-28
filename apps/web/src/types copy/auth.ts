export interface AuthStateProps {
  error: string | null;
  loading: boolean;
  actionError: string | null;
  signInData: any;
  actionLoading: boolean;
}

export type VerifyEmail = {
  email: string;
};

export type VerifyOTP = {
  email: string;
  otp: string;
};

export type ResetPassword = {
  password: string;
  confirmPassword: string;
};
