import axios from 'axios';
import type { Task } from '../types/task';

const API_URL = 'http://localhost:5000';

export const getTasks = async (): Promise<Task[]> => {
  const res = await axios.get(`${API_URL}/`);
  return res.data;
};

export const createTask = async (taskData: Omit<Task, '_id'>): Promise<Task> => {
    const res = await axios.post(API_URL, taskData);
    return res.data;
}

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};
// Puedes añadir aquí también createTask, updateTask, etc.
