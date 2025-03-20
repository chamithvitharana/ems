export interface ICommonType {
  id: number;
  code: string;
  name: string;
}

export interface IStatusPayload {
  id: number;
  status: boolean;
}

export interface IVehicle {
  id: number;
  brand: ICommonType;
  manufacturedYear: string;
  registeredYear: string;
  vehicleType: ICommonType;
  fuelType: ICommonType;
  registrationNumber: string;
  qrCode?: string;
  status?: 'ACTIVE' | 'INACTIVE' | null;
}

export interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nic: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  birthday: string;
  emailAlertEnabled: boolean;
  smsAlertEnabled: boolean;
  cardNumber?: string;
  cvc?: string;
  expiryDate?: string;
}

export interface IResetPassword {
  email: string;
  code: string;
  password: string;
}

export interface SignupFormPayload {
  email: string;
  password: string;
  phoneNumber: string;
  name: string;
  nic: string;
  addressLine1: string;
  addressLine2?: string;
  birthday: string;
  smsAlertEnabled: boolean;
  emailAlertEnabled: boolean;
  paymentId: string;
}

export interface ILoggedUser {
  accessToken: string;
  userRole: string;
  email: string;
  username: string;
  agent: IUser;
  customer: IUser;
}

export interface IUser {
  id: number;
  name: string;
  nic: string;
  addressLine1: string;
  addressLine2: string;
  contactNumber: string;
  email: string;
  birthday: null;
  userAccountsId: number;
  smsNotificationEnabled: boolean | null;
  emailNotificationEnabled: boolean | null;
  status: null;
  paymentId: null;
}

interface FuelType {
  id: number;
}

interface VehicleType {
  id: number;
}

interface Brand {
  id: number;
}

export interface IVehiclePayload {
  registrationNumber: string;
  registeredYear: string;
  manufacturedYear: string;
  fuelType: FuelType;
  vehicleType: VehicleType;
  brand: Brand;
  customerEmail: string;
}

export interface IChat {
  id: number;
  senderEmail: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface ChatData {
  content: IChat[];
}

export interface IChatConversation {
  id: number;
  senderEmail: string;
  senderName: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export interface IChatHistory {
  statusCode: number;
  data: ChatData;
  message: string;
}

export interface ICustomer {
  addressLine1: string;
  addressLine2: string;
  birthday: string | null;
  contactNumber: string;
  email: string;
  emailNotificationEnabled: boolean;
  id: number;
  name: string;
  nic: string;
  paymentId: string | null;
  smsNotificationEnabled: boolean;
  status: string | null;
  userAccountsId: number;
}

export interface IAccessPointInputs {
  name: string;
  lon: number;
  lat: number;
  code: string;
  emergencyAlertEmail: string;
  emergencyAlertMobile: string;
}

export interface IUpdateAccessPointInputs {
  id: number;
  name: string;
  lon: number;
  lat: number;
  code: string;
  emergencyAlertEmail: string;
  emergencyAlertMobile: string;
}

export interface INotificationPayload {
  content: string;
  notificationSource: 'ADMIN_NOTIFICATION';
  isCustomerNotification: boolean;
  isAgentNotification: boolean;
  isSmsNotification: boolean;
  isEmailNotification: boolean;
}

export interface INotificationData {
  id: number;
  content: string;
  notificationSource: 'ADMIN_NOTIFICATION';
  customerNotification: boolean;
  agentNotification: boolean;
  notificationType: any;
}

export type INotification = Omit<INotificationPayload, 'notificationSource'>;

export interface IUpdateAgentPayload {
  id: number;
  name: string;
  contactNumber: string;
  email: string;
  accessPointName?: string;
  accessPointId: number;
  status: string;
}

export type ICreateAgentPayload = Omit<IUpdateAgentPayload, 'id'>;

export interface ICreateAgentForm {
  name: string;
  contactNumber: string;
  email: string;
  accessPointId: string[];
  status: string[];
}

export interface ILocation {
  count: number;
  lat: number;
  lon: number;
  name: string;
}

export interface VehicleEntryExit {
  id: number;
  code: string;
  vehicleId: number;
  customerId: number;
  entranceId: number;
  exitId: number | null;
  entranceTime: string;
  exitTime: string | null;
  status: string;
  amount: number | null;
  distance: number | null;
  entranceName: string | null;
  exitName: string | null;
  vehicleRegistrationNumber: string | null;
}

export interface IPaymentConfig {
  id: number;
  source: string;
  destination: string;
  fare: number;
  category: string;
}

export interface BreakDownPayload {
  vehicleNumber: string;
  description: string;
  lat: string;
  lon: string;
}

export interface IUpdateProfile {
  email: string;
  password: string;
  phoneNumber: string;
  name: string;
  nic: string;
  addressLine1: string;
  addressLine2: string;
  birthday: string;
  smsAlertEnabled: boolean;
  emailAlertEnabled: boolean;
  paymentId: string;
}
