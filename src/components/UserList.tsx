import React, { useState, useEffect } from 'react';
import { format, isValid } from 'date-fns';
import toast from 'react-hot-toast';
import { Trash2, Edit, X, Save, Loader } from 'lucide-react';
import { fetchUsers, deleteUser, updateUser } from '../services/apiService';
import { User } from '../types';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        toast.success('Reminder deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete reminder');
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      birthDate: user.birthDate ? format(new Date(user.birthDate), 'yyyy-MM-dd') : ''
    });
    setEditErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditErrors({});
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEditForm = () => {
    const errors: Record<string, string> = {};
    
    if (!editForm.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editForm.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(editForm.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!editForm.birthDate) {
      errors.birthDate = 'Birth date is required';
    } else {
      const birthDate = new Date(editForm.birthDate);
      const today = new Date();
      if (!isValid(birthDate)) {
        errors.birthDate = 'Please enter a valid date';
      } else if (birthDate > today) {
        errors.birthDate = 'Birth date cannot be in the future';
      }
    }
    
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEdit = async (id: string) => {
    if (!validateEditForm()) {
      return;
    }
    
    try {
      const updatedUser = await updateUser(id, {
        name: editForm.name!,
        email: editForm.email!,
        birthDate: editForm.birthDate!
      });
      
      setUsers(users.map(user => user.id === id ? updatedUser : user));
      setEditingId(null);
      setEditForm({});
      toast.success('Reminder updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update reminder');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader className="h-10 w-10 text-primary-500 animate-spin" />
        <span className="ml-4 text-gray-600">Loading reminders...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
        <div className="text-gray-500 mb-4">
          <Calendar className="h-12 w-12 mx-auto text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No reminders found</h3>
        <p className="text-gray-500">Add your first birthday reminder to get started.</p>
      </div>
    );
  }

  const formatBirthDate = (dateString: string | null): string => {
    if (!dateString) return 'No birthday set';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMMM d') : 'Invalid date';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-slide-up">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birthday</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                {editingId === user.id ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name || ''}
                        onChange={handleEditInputChange}
                        className={`w-full px-2 py-1 border rounded shadow-sm ${
                          editErrors.name ? 'border-error-500' : 'border-gray-300'
                        }`}
                      />
                      {editErrors.name && <p className="mt-1 text-xs text-error-500">{editErrors.name}</p>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="email"
                        name="email"
                        value={editForm.email || ''}
                        onChange={handleEditInputChange}
                        className={`w-full px-2 py-1 border rounded shadow-sm ${
                          editErrors.email ? 'border-error-500' : 'border-gray-300'
                        }`}
                      />
                      {editErrors.email && <p className="mt-1 text-xs text-error-500">{editErrors.email}</p>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="date"
                        name="birthDate"
                        value={editForm.birthDate || ''}
                        onChange={handleEditInputChange}
                        className={`w-full px-2 py-1 border rounded shadow-sm ${
                          editErrors.birthDate ? 'border-error-500' : 'border-gray-300'
                        }`}
                      />
                      {editErrors.birthDate && <p className="mt-1 text-xs text-error-500">{editErrors.birthDate}</p>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleSaveEdit(user.id)}
                        className="text-success-500 hover:text-success-700 mr-3 transition-colors duration-150"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {formatBirthDate(user.birthDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-primary-500 hover:text-primary-700 mr-3 transition-colors duration-150"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-error-500 hover:text-error-700 transition-colors duration-150"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Import the Calendar component for the empty state
import { Calendar } from 'lucide-react';

export default UserList;