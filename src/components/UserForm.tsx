import React, { useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Calendar, Loader } from 'lucide-react';
import { createUser } from '../services/apiService';

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    name: '',
    email: '',
    dateOfBirth: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: '',
      name: '',
      email: '',
      dateOfBirth: '',
    };

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      valid = false;
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
      valid = false;
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const birthDateObj = new Date(formData.dateOfBirth);
      const formattedDate = format(birthDateObj, 'yyyy-MM-dd');
      
      await createUser({
        username: formData.username,
        name: formData.name,
        email: formData.email,
        dateOfBirth: formattedDate,
      });
      
      toast.success('Birthday reminder set successfully!');
      
      // Reset form
      setFormData({
        username: '',
        name: '',
        email: '',
        dateOfBirth: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to set reminder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 animate-slide-up">
      <div className="flex items-center mb-6">
        <Calendar className="h-6 w-6 text-primary-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Set a Birthday Reminder</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.username ? 'border-error-500' : 'border-gray-300'
            }`}
            placeholder="Enter username"
          />
          {errors.username && <p className="mt-1 text-sm text-error-500">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.name ? 'border-error-500' : 'border-gray-300'
            }`}
            placeholder="Enter full name"
          />
          {errors.name && <p className="mt-1 text-sm text-error-500">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.email ? 'border-error-500' : 'border-gray-300'
            }`}
            placeholder="email@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-error-500">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.dateOfBirth ? 'border-error-500' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && <p className="mt-1 text-sm text-error-500">{errors.dateOfBirth}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Processing...
            </span>
          ) : (
            'Set Birthday Reminder'
          )}
        </button>
      </form>
    </div>
  );
};

export default UserForm;