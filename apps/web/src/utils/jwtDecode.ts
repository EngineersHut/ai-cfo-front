import { jwtDecode } from 'jwt-decode';

export interface DecodedTokenResponse {
  email: string;
  exp: number;
  iat: number;
  role: string;
  username: string;
  _id: string;
  full_name?: string;
  assignedTeam?: any;
}

export const getUserRoleFromToken = (token: string): DecodedTokenResponse | null => {
  try {
    const decoded: DecodedTokenResponse = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
};
