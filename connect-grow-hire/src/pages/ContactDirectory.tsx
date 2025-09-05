import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';
import { Contact } from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ExternalLink, Search } from "lucide-react";

const ContactDirectory: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getDirectoryContacts();
      setContacts(response.contacts || []);
    } catch (err) {
      console.error('Failed to load contacts:', err);
      setError('Failed to load contacts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const normalizeLinkedInUrl = (raw?: string) => {
    if (!raw) return "";
    let url = raw.trim();
    if (url.startsWith("//")) url = "https:" + url;
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    url = url.replace(/^http:\/\//i, "https://");
    return url;
  };

  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contacts;
    
    const term = searchTerm.toLowerCase();
    return contacts.filter((contact: any) => {
      const searchableFields = [
        contact.first_name || contact.FirstName || '',
        contact.last_name || contact.LastName || '',
        contact.email || contact.Email || '',
        contact.company || contact.Company || '',
        contact.title || contact.Title || '',
        contact.college || contact.College || '',
        contact.city || contact.City || '',
        contact.state || contact.State || '',
        contact.linkedin || contact.LinkedIn || '',
        contact.status || contact.Status || ''
      ];
      
      return searchableFields.some(field => 
        field.toString().toLowerCase().includes(term)
      );
    });
  }, [contacts, searchTerm]);

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
        <Button onClick={loadContacts} variant="outline">
          Refresh
        </Button>
      </div>

      {contacts.length > 0 && (
        <div className="mb-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No contacts in your directory yet.
          </p>
          <p className="text-muted-foreground mt-2">
            Use the search functionality with "Save to Directory" enabled to add contacts.
          </p>
        </div>
      ) : filteredContacts.length === 0 && searchTerm ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No contacts found matching "{searchTerm}".
          </p>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search terms.
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
              {filteredContacts.map((contact: any, index) => (
                <tr key={contact.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.first_name || contact.FirstName || ''}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.last_name || contact.LastName || ''}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {(() => {
                      const raw = contact.linkedin || contact.LinkedIn || "";
                      const href = normalizeLinkedInUrl(raw);
                      return href ? (
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto text-blue-600 hover:text-blue-800"
                        >
                          <a href={href} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            LinkedIn
                          </a>
                        </Button>
                      ) : (
                        ""
                      );
                    })()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.email || contact.Email || ''}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.company || contact.Company || ''}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.title || contact.Title || ''}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{contact.college || contact.College || ''}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {[contact.city || contact.City, contact.state || contact.State]
                      .filter(Boolean)
                      .join(', ')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(contact.first_contact_date || contact.FirstContactDate || '')}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {contact.status || contact.Status || 'Not Contacted'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(contact.last_contact_date || contact.LastContactDate || '')}</td>
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
