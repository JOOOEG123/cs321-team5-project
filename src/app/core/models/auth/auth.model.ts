export interface AuthUser {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email: string;
  password: string;
  dob: string;
  country: string;
}


export interface UserProfile {
  country: string | null;
  userName: string | undefined;
  dob: string | null;
  email: string| null;
  firstName: string| undefined;
  lastName: string| undefined;
  uid: string| null;
  createdt?: string | null;
  moddt?: string | null;

}


