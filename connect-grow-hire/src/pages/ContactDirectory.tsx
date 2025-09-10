// src/pages/ContactDirectory.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ContactDirectoryComponent from '@/components/ContactDirectory';

const ContactDirectory: React.FC = () => {
  const { user } = useAuth();
  const userEmail = user?.email || 'user@example.com';
  
  return <ContactDirectoryComponent userEmail={userEmail} />;
};

export default ContactDirectory;