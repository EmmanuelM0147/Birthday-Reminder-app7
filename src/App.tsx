import React, { useState } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'manage'>('register');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {activeTab === 'register' ? (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Never Miss a Birthday Again</h1>
            <p className="text-gray-600 mb-8">Register yourself or your friends and family to receive birthday reminders via email.</p>
            <UserForm />
          </div>
        ) : (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Birthday Reminders</h1>
            <p className="text-gray-600 mb-8">View, edit, or remove birthday reminders.</p>
            <UserList />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;