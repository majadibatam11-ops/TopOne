import { supabase, isSupabaseConfigured } from './supabase';

export interface Employee {
  id: string;
  created_at: string;
  // Employee Details
  employee_no: string;
  name: string;
  surname: string;
  id_number: string;
  gender: 'Male' | 'Female' | 'Other';
  passport_no: string;
  marital_status: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  contact: string;
  address: string;
  employment_date: string;
  
  // Banking Details
  bank_name: string;
  account_no: string;
  branch_code: string;
  
  // Emergency Contacts
  emergency_name: string;
  emergency_surname: string;
  emergency_relationship: string;
  emergency_contact: string;
  emergency_address: string;

  // Documents
  doc_id_copy?: string;
  doc_proof_account?: string;
  doc_sars?: string;
  doc_contract?: string;
  doc_supporting_docs?: string[];
}

export const uploadEmployeeDoc = async (file: File, path: string): Promise<string | null> => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.storage
      .from('employee-docs')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('employee-docs')
      .getPublicUrl(data.path);
      
    return publicUrl;
  }
  return null;
};

export const getEmployees = async (): Promise<Employee[]> => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      return data as Employee[];
    }
    console.error('Supabase error fetching employees:', error);
  }
  
  // Fallback to Local Storage
  const stored = localStorage.getItem('topone_employees');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

export const saveEmployee = async (employee: Omit<Employee, 'id' | 'created_at'>): Promise<Employee[]> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('employees')
      .insert([{
        ...employee
      }]);
      
    if (error) {
      console.error('Supabase insert employee error:', error);
      throw new Error(`Failed to save employee: ${error.message}`);
    }
    return await getEmployees();
  }
  
  // Fallback to Local Storage
  const stored = localStorage.getItem('topone_employees');
  const employees = stored ? JSON.parse(stored) : [];
  
  const newEmployee: Employee = {
    ...employee,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  const updated = [newEmployee, ...employees];
  localStorage.setItem('topone_employees', JSON.stringify(updated));
  return updated;
};

export const deleteEmployee = async (id: string): Promise<Employee[]> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete employee error:', error);
    }
    return await getEmployees();
  }
  
  // Fallback to Local Storage
  const stored = localStorage.getItem('topone_employees');
  if (stored) {
    const employees = JSON.parse(stored);
    const updated = employees.filter((e: Employee) => e.id !== id);
    localStorage.setItem('topone_employees', JSON.stringify(updated));
    return updated;
  }
  return [];
};
