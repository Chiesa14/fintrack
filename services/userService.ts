import { API_CONFIG } from './api/config';
import { hashPassword } from '../utils/encryption';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'types/user';

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  createdAt: string;
}

interface StoredUser extends UserResponse {
  password: string;
}

class UserService {
  private baseUrl: string;
  private readonly USER_KEY = '@user';

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async register(userData: UserRegistrationData): Promise<User> {
    try {
      const hashedPassword = await hashPassword(userData.password);

      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({
          ...userData,
          password: hashedPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      const { password, ...userWithoutPassword } = data;
      await this.saveUser(userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<User> {
    try {
      // First, find the user by username/email
      const response = await fetch(`${this.baseUrl}/users?username=${username}`);
      
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const users = await response.json();
      const user = users[0] as StoredUser; // Get the first matching user

      if (!user) {
        throw new Error('User not found');
      }

      // Hash the provided password
      const hashedPassword = await hashPassword(password);
      
      // Compare passwords
      if (user.password !== hashedPassword) {
        throw new Error('Invalid password');
      }

      // Return user data without sensitive information
      const { password: _, ...userWithoutPassword } = user;
      await this.saveUser(userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(this.USER_KEY);
  }

  private async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

export const userService = new UserService();
