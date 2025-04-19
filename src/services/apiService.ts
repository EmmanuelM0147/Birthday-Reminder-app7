import { supabase } from './supabaseClient';
import { User, CreateUserData, UpdateUserData } from '../types';

// Create a new user
export const createUser = async (userData: CreateUserData): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      username: userData.username,
      name: userData.name,
      email: userData.email,
      date_of_birth: userData.dateOfBirth
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

// Fetch a specific user
export const fetchUser = async (id: string): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Update a user
export const updateUser = async (id: string, userData: UpdateUserData): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update({
      username: userData.username,
      name: userData.name,
      email: userData.email,
      date_of_birth: userData.dateOfBirth
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
};