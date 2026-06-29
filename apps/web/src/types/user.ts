export interface UserStateProps {
  error: string | null;
  loading: boolean;
  actionError: string | null;
  userData: User | null;
  actionLoading: boolean;
}

export type User  = {
  email: string;
  password: string;
  name: string;
  profilePic: string;
};
