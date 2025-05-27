import { API_CONFIG } from './api/config';
import { Expense, CreateExpenseData } from '../types/expense';



class ExpenseService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async createExpense(expenseData: CreateExpenseData): Promise<Expense> {
    try {
      const response = await fetch(`${this.baseUrl}/expenses`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        throw new Error('Failed to create expense');
      }

      return await response.json();
    } catch (error) {
      console.error('Create expense error:', error);
      throw error;
    }
  }

  async getExpense(id: string): Promise<Expense> {
    try {
      const response = await fetch(`${this.baseUrl}/expenses/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch expense');
      }

      return await response.json();
    } catch (error) {
      console.error('Get expense error:', error);
      throw error;
    }
  }

  async getAllExpenses(userId: string): Promise<Expense[]> {
    try {
      const response = await fetch(`${this.baseUrl}/expenses?userId=${userId}`);
      console.log(userId);
      

      // If no expenses found (404), return empty array
      if (response.status === 404) {
        return [];
      }

      // For other error status codes, throw error
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Get all expenses error:', error);
      // Return empty array on error instead of throwing
      return [];
    }
  }

  async deleteExpense(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
    } catch (error) {
      console.error('Delete expense error:', error);
      throw error;
    }
  }

  async getExpenseById(expenseId: string): Promise<Expense> {
    try {
      const response = await fetch(`${this.baseUrl}/expenses/${expenseId}`, {
        headers: API_CONFIG.HEADERS,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expense');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  }

  async deleteExpenseById(expenseId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: API_CONFIG.HEADERS,
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
}

export const expenseService = new ExpenseService();
