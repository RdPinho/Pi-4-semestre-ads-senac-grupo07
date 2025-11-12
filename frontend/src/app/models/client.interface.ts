export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  address?: Address;
  preferences?: ClientPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientPreferences {
  preferredProfessionals: string[];
  preferredServices: string[];
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}