import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Users, Search, Plus, Trash2 } from 'lucide-react';
import LockedFeatureOverlay from '../components/LockedFeatureOverlay';

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
  userId: string;
  createdAt: any;
}

const statusColors: Record<string, string> = {
  'Not Contacted': '#A0A0A0',
  'Contacted': '#4285F4',
  'Followed Up': '#FB8C00',
  'Responded': '#34A853',
  'Call Scheduled': '#9C27B0',
  'Rejected': '#EA4335',
  'Hired': '#FFD700'
};

const statusOptions = [
  'Not Contacted',
  'Contacted', 
  'Followed Up',
  'Responded',
  'Call Scheduled',
  'Rejected',
  'Hired'
];

const ContactDirectory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCell, setEditingCell] = useState<{ contactId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const hasAccess = true; // Allow access for development testing

  useEffect(() => {
    console.log('ContactDirectory useEffect - user:', user);
    const userEmail = user?.email || 'test@example.com';
    console.log('Using user email:', userEmail);
    fetchContactsWithUser(userEmail);
  }, [user]);

  const fetchContactsWithUser = async (userEmail: string) => {
    try {
      setLoading(true);
      const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
      const response = await fetch(`${API}/api/contacts?userId=${encodeURIComponent(userEmail)}`);
      
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
        console.log('Contacts fetched successfully:', data.contacts?.length || 0);
      } else {
        console.error('Failed to fetch contacts');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createContact = async () => {
    try {
      const userEmail = user?.email || 'test@example.com';
      const newContact = {
        firstName: '',
        lastName: '',
        linkedinUrl: '',
        email: '',
        company: '',
        jobTitle: '',
        college: '',
        location: '',
        userId: userEmail
      };

      const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
      const response = await fetch(`${API}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(prev => [data.contact, ...prev]);
      } else {
        console.error('Failed to create contact');
      }
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  const updateContact = async (contactId: string, field: string, value: string) => {
    try {
      const userEmail = user?.email || 'test@example.com';
      
      const timeoutId = setTimeout(async () => {
        const updateData = { [field]: value, userId: userEmail };

        const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
        const response = await fetch(`${API}/api/contacts/${contactId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          const data = await response.json();
          setContacts(prev => prev.map(contact => 
            contact.id === contactId ? { ...contact, ...data.contact } : contact
          ));
        } else {
          console.error('Failed to update contact');
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      const userEmail = user?.email || 'test@example.com';
      const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
      const response = await fetch(`${API}/api/contacts/${contactId}?userId=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(prev => prev.filter(contact => contact.id !== contactId));
      } else {
        console.error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleCellEdit = (contactId: string, field: string, currentValue: string) => {
    setEditingCell({ contactId, field });
    setEditValue(currentValue);
  };

  const handleCellSave = (contactId: string, field: string) => {
    updateContact(contactId, field, editValue);
    setEditingCell(null);
    setEditValue('');
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleStatusChange = (contactId: string, status: string) => {
    updateContact(contactId, 'status', status);
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const importedContacts = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim());
            const contact: any = {
              firstName: values[headers.indexOf('firstName')] || values[headers.indexOf('First Name')] || '',
              lastName: values[headers.indexOf('lastName')] || values[headers.indexOf('Last Name')] || '',
              linkedinUrl: values[headers.indexOf('linkedinUrl')] || values[headers.indexOf('LinkedIn URL')] || '',
              email: values[headers.indexOf('email')] || values[headers.indexOf('Email')] || '',
              company: values[headers.indexOf('company')] || values[headers.indexOf('Company')] || '',
              jobTitle: values[headers.indexOf('jobTitle')] || values[headers.indexOf('Job Title')] || '',
              college: values[headers.indexOf('college')] || values[headers.indexOf('College')] || '',
              location: values[headers.indexOf('location')] || values[headers.indexOf('Location')] || '',
              userId: user?.email || 'test@example.com'
            };
            return contact;
          })
          .filter(contact => contact.firstName || contact.lastName || contact.email);

        const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
        for (const contact of importedContacts) {
          const response = await fetch(`${API}/api/contacts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(contact),
          });

          if (response.ok) {
            const data = await response.json();
            setContacts(prev => [data.contact, ...prev]);
          }
        }
      } catch (error) {
        console.error('Error importing CSV:', error);
      }
    };
    reader.readAsText(file);
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return Object.values(contact).some(value => 
      value && value.toString().toLowerCase().includes(searchLower)
    );
  });

  const groupedContacts = filteredContacts.reduce((acc: any[], contact) => {
    const lastGroup = acc[acc.length - 1];
    if (!lastGroup || lastGroup[0]?.firstContactDate !== contact.firstContactDate) {
      if (acc.length > 0) {
        acc.push({ type: 'separator' });
      }
      acc.push([contact]);
    } else {
      lastGroup.push(contact);
    }
    return acc;
  }, []).flat();

  const EditableCell: React.FC<{
    contact: Contact;
    field: string;
    value: string;
  }> = ({ contact, field, value }) => {
    const isEditing = editingCell?.contactId === contact.id && editingCell?.field === field;

    if (isEditing) {
      return (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleCellSave(contact.id, field)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCellSave(contact.id, field);
            if (e.key === 'Escape') handleCellCancel();
          }}
          className="h-8 text-sm"
          autoFocus
        />
      );
    }

    return (
      <div
        className="p-2 h-8 text-sm cursor-pointer hover:bg-muted/50 rounded"
        onClick={() => handleCellEdit(contact.id, field, value)}
      >
        {value || <span className="text-muted-foreground">Click to edit</span>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Loading contacts...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Back Arrow */}
      <div className="max-w-7xl mx-auto mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/home")} 
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 py-8">
          <div className="flex items-center justify-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Contact Directory</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Manage your professional contacts in one organized place.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="hidden"
              id="csv-import"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('csv-import')?.click()}
              className="flex items-center gap-2"
            >
              Import CSV
            </Button>
            <Button onClick={createContact} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Contact Table */}
        <Card className="relative">
          {!hasAccess && (
            <LockedFeatureOverlay 
              featureName="Contact Directory"
              requiredTier="Premium"
            >
              <div></div>
            </LockedFeatureOverlay>
          )}
          
          <CardHeader>
            <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
          </CardHeader>
          
          <CardContent className={!hasAccess ? "blur-sm" : ""}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">First Name</th>
                    <th className="text-left p-3 font-medium">Last Name</th>
                    <th className="text-left p-3 font-medium">LinkedIn URL</th>
                    <th className="text-left p-3 font-medium">Email Address</th>
                    <th className="text-left p-3 font-medium">Company</th>
                    <th className="text-left p-3 font-medium">Job Title</th>
                    <th className="text-left p-3 font-medium">College</th>
                    <th className="text-left p-3 font-medium">Location</th>
                    <th className="text-left p-3 font-medium">First Contact Date</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Last Contact Date</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedContacts.map((item, index) => {
                    if ('type' in item && item.type === 'separator') {
                      return (
                        <tr key={`separator-${index}`}>
                          <td colSpan={12} className="h-4"></td>
                        </tr>
                      );
                    }

                    const contact = item as Contact;
                    return (
                      <tr key={contact.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-1">
                          <EditableCell contact={contact} field="firstName" value={contact.firstName} />
                        </td>
                        <td className="p-1">
                          <EditableCell contact={contact} field="lastName" value={contact.lastName} />
                        </td>
                        <td className="p-1">
                          <EditableCell contact={contact} field="linkedinUrl" value={contact.linkedinUrl} />
                        </td>
                        <td className="p-1">
                          <EditableCell contact={contact} field="email" value={contact.email} />
                        </td>
                        <td className="p-1">
                          <EditableCell contact={contact} field="company" value={contact.company} />
                        </td>
                        <td className="p-1">
                          <EditableCell contact={contact} field="jobTitle" value={contact.jobTitle} />
                        </td>
                        <td className="p-1">
                          <EditableCell contact={contact} field="college" value={contact.college} />
                        </td>
                        <td className="p-1">
                          <EditableCell contact={contact} field="location" value={contact.location} />
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {contact.firstContactDate}
                        </td>
                        <td className="p-1">
                          <Select
                            value={contact.status}
                            onValueChange={(value) => handleStatusChange(contact.id, value)}
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue>
                                <Badge 
                                  style={{ backgroundColor: statusColors[contact.status] }}
                                  className="text-white text-xs"
                                >
                                  {contact.status}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                  <Badge 
                                    style={{ backgroundColor: statusColors[status] }}
                                    className="text-white text-xs"
                                  >
                                    {status}
                                  </Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {contact.lastContactDate}
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteContact(contact.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredContacts.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No contacts found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first contact.'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={createContact}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Contact
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactDirectory;
