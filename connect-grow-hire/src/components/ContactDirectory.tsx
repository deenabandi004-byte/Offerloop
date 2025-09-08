import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  linkedinUrl: string;
  email: string;
  company: string;
  jobTitle: string;
  college: string;
  location: string;
  firstContactDate: string;
  status: string;
  lastContactDate: string;
}

interface ContactDirectoryProps {
  userEmail?: string;
}

const ContactDirectory: React.FC<ContactDirectoryProps> = ({ userEmail = 'user@example.com' }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate localStorage key for user-specific storage
  const getStorageKey = () => `contacts_${userEmail.replace('@', '_').replace('.', '_')}`;

  useEffect(() => {
    loadContacts();
  }, [userEmail]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📂 Loading contacts from localStorage for:', userEmail);
      
      const storageKey = getStorageKey();
      const storedContacts = localStorage.getItem(storageKey);
      
      if (storedContacts) {
        const parsed = JSON.parse(storedContacts);
        setContacts(Array.isArray(parsed) ? parsed : []);
        console.log(`✅ Loaded ${parsed.length} contacts from localStorage`);
      } else {
        setContacts([]);
        console.log('📭 No contacts found in localStorage');
      }
      
    } catch (err) {
      console.error('Failed to load contacts from localStorage:', err);
      setError('Failed to load contacts. Please try again.');
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save contacts to localStorage (called from parent component)
  const saveContacts = (newContacts: Partial<Contact>[]) => {
    try {
      const storageKey = getStorageKey();
      const existingContacts = contacts;
      const today = new Date().toLocaleDateString();
      
      const contactsToAdd: Contact[] = newContacts.map((contact, index) => ({
        id: `contact_${Date.now()}_${index}`,
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        linkedinUrl: contact.linkedinUrl || '',
        email: contact.email || '',
        company: contact.company || '',
        jobTitle: contact.jobTitle || '',
        college: contact.college || '',
        location: contact.location || '',
        firstContactDate: today,
        status: 'Not Contacted',
        lastContactDate: today,
      }));
      
      // Check for duplicates (by email or LinkedIn)
      const updatedContacts = [...existingContacts];
      let addedCount = 0;
      let skippedCount = 0;
      
      contactsToAdd.forEach(newContact => {
        const isDuplicate = existingContacts.some(existing => 
          (existing.email && newContact.email && existing.email === newContact.email) ||
          (existing.linkedinUrl && newContact.linkedinUrl && existing.linkedinUrl === newContact.linkedinUrl)
        );
        
        if (!isDuplicate) {
          updatedContacts.push(newContact);
          addedCount++;
        } else {
          skippedCount++;
        }
      });
      
      localStorage.setItem(storageKey, JSON.stringify(updatedContacts));
      setContacts(updatedContacts);
      
      console.log(`💾 Saved to localStorage: ${addedCount} added, ${skippedCount} skipped`);
      return { created: addedCount, skipped: skippedCount };
      
    } catch (err) {
      console.error('Failed to save contacts to localStorage:', err);
      throw err;
    }
  };

  // Expose save function globally so Home.tsx can call it
  useEffect(() => {
    (window as any).saveContactsToDirectory = saveContacts;
    return () => {
      delete (window as any).saveContactsToDirectory;
    };
  }, [contacts]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const openLinkedIn = (url: string) => {
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    }
  };

  const clearAllContacts = () => {
    if (confirm('Are you sure you want to clear all contacts? This cannot be undone.')) {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
      setContacts([]);
      console.log('🗑️ Cleared all contacts from localStorage');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading contacts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadContacts}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Directory</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">User: {userEmail}</span>
          <span className="text-sm text-gray-500">Storage: localStorage</span>
          <Button onClick={loadContacts} variant="outline">
            Refresh
          </Button>
          {contacts.length > 0 && (
            <Button onClick={clearAllContacts} variant="destructive" size="sm">
              Clear All
            </Button>
          )}
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No contacts in your directory yet.
          </p>
          <p className="text-muted-foreground mt-2">
            Use the search functionality with "Save to Directory" enabled to add contacts.
          </p>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LinkedIn URL</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Contact Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact, index) => (
                <tr key={contact.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.firstName}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.lastName}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {contact.linkedinUrl ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openLinkedIn(contact.linkedinUrl)}
                        className="p-0 h-auto text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        LinkedIn
                      </Button>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.company}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.jobTitle}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.college}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.location}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(contact.firstContactDate)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(contact.lastContactDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactDirectory;