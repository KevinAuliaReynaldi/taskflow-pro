export interface User {
    id: number;
    email: string;
    username: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    color: string;
    user_id: number;
    created_at: string;
  }
  
  export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    category_id?: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    completed_at?: string;
    category_name?: string;
    category_color?: string;
  }
  
  export interface TaskFormData {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    category_id?: number;
  }
  
  export interface SessionUser {
    id: number;
    email: string;
    username: string;
  }
  
  declare module 'next-auth' {
    interface Session {
      user: SessionUser;
    }
    
    interface User {
      id: number;
      username: string;
    }
  }
  
  declare module 'next-auth/jwt' {
    interface JWT {
      id: number;
      username: string;
    }
  }