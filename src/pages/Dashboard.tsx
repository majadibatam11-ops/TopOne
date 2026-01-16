import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { getNotices, saveNotice, deleteNotice, type Notice } from '../lib/noticeStore';
import { getMessages, deleteMessage, markMessageRead, type Message } from '../lib/messageStore';
import { getEmployees, saveEmployee, deleteEmployee, uploadEmployeeDoc, type Employee } from '../lib/employeeStore';
import { logout } from '../lib/auth';
import { isSupabaseConfigured } from '../lib/supabase';
import { Trash2, Plus, LayoutDashboard, LogOut, Database, HardDrive, MessageSquare, Bell, CheckCircle, Users, Upload, FileText, X, Eye, Phone, Mail, MapPin, Calendar, CreditCard, User } from 'lucide-react';
import logo from '../assets/logo.png';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import absaLogo from '../assets/banks/absa.svg';
import capitecLogo from '../assets/banks/capitec.svg';
import discoveryLogo from '../assets/banks/discovery.svg';
import fnbLogo from '../assets/banks/fnb.svg';
import investecLogo from '../assets/banks/investec.svg';
import nedbankLogo from '../assets/banks/nedbank.svg';
import standardLogo from '../assets/banks/standard.svg';
import tymebankLogo from '../assets/banks/tymebank.svg';
import africanLogo from '../assets/banks/african.svg';
import bidvestLogo from '../assets/banks/bidvest.svg';

const banks = [
  { name: 'Absa Bank', logo: absaLogo },
  { name: 'Capitec Bank', logo: capitecLogo },
  { name: 'Discovery Bank', logo: discoveryLogo },
  { name: 'FNB', logo: fnbLogo },
  { name: 'Investec', logo: investecLogo },
  { name: 'Nedbank', logo: nedbankLogo },
  { name: 'Standard Bank', logo: standardLogo },
  { name: 'TymeBank', logo: tymebankLogo },
  { name: 'African Bank', logo: africanLogo },
  { name: 'Bidvest Bank', logo: bidvestLogo },
];

export function Dashboard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    type: Notice['type'];
  }>({
    title: '',
    content: '',
    type: 'important'
  });
  
  // File states

  const [idFile, setIdFile] = useState<File | null>(null);
  const [proofAccountFile, setProofAccountFile] = useState<File | null>(null);
  const [sarsFile, setSarsFile] = useState<File | null>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);

  const [employeeForm, setEmployeeForm] = useState<Omit<Employee, 'id' | 'created_at'>>({
    employee_no: '',
    name: '',
    surname: '',
    id_number: '',
    gender: 'Male',
    passport_no: '',
    marital_status: 'Single',
    contact: '',
    address: '',
    employment_date: '',
    bank_name: '',
    account_no: '',
    branch_code: '',
    emergency_name: '',
    emergency_surname: '',
    emergency_relationship: '',
    emergency_contact: '',
    emergency_address: '',
    doc_id_copy: '',
    doc_proof_account: '',
    doc_sars: '',
    doc_contract: '',
    doc_supporting_docs: []
  });
  const [isConnected] = useState(isSupabaseConfigured());

  useEffect(() => {
    const fetchData = async () => {
      setNotices(await getNotices());
      setMessages(await getMessages());
      setEmployees(await getEmployees());
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... existing notice submit logic ...
    const newNotice: Notice = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      type: formData.type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = await saveNotice(newNotice);
    setNotices(updated);
    setFormData({ title: '', content: '', type: 'important' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      const updated = await deleteNotice(id);
      setNotices(updated);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm('Delete this message?')) {
      const updated = await deleteMessage(id);
      setMessages(updated);
    }
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedForm = { ...employeeForm };
    const timestamp = Date.now();
    const folder = `${employeeForm.employee_no || 'temp'}`;

    try {

      if (idFile) {
        const url = await uploadEmployeeDoc(idFile, `${folder}/id-${timestamp}-${idFile.name}`);
        if (url) updatedForm.doc_id_copy = url;
      }
      if (proofAccountFile) {
        const url = await uploadEmployeeDoc(proofAccountFile, `${folder}/proof-${timestamp}-${proofAccountFile.name}`);
        if (url) updatedForm.doc_proof_account = url;
      }
      if (sarsFile) {
        const url = await uploadEmployeeDoc(sarsFile, `${folder}/sars-${timestamp}-${sarsFile.name}`);
        if (url) updatedForm.doc_sars = url;
      }
      if (contractFile) {
        const url = await uploadEmployeeDoc(contractFile, `${folder}/contract-${timestamp}-${contractFile.name}`);
        if (url) updatedForm.doc_contract = url;
      }
      if (supportingFiles.length > 0) {
        const urls: string[] = [];
        for (const file of supportingFiles) {
          const url = await uploadEmployeeDoc(file, `${folder}/support-${timestamp}-${file.name}`);
          if (url) urls.push(url);
        }
        updatedForm.doc_supporting_docs = urls;
      }

      const updated = await saveEmployee(updatedForm);
      setEmployees(updated);
      
      // Reset form and files
      setEmployeeForm({
        employee_no: '',
        name: '',
        surname: '',
        id_number: '',
        gender: 'Male',
        passport_no: '',
        marital_status: 'Single',
        contact: '',
        address: '',
        employment_date: '',
        bank_name: '',
        account_no: '',
        branch_code: '',
        emergency_name: '',
        emergency_surname: '',
        emergency_relationship: '',
        emergency_contact: '',
        emergency_address: '',
        doc_id_copy: '',
        doc_proof_account: '',
        doc_sars: '',
        doc_contract: '',
        doc_supporting_docs: []
      });
      setIdFile(null);

      setProofAccountFile(null);
      setSarsFile(null);
      setContractFile(null);
      setSupportingFiles([]);
      
      alert('Employee added successfully!');
    } catch (error: any) {
      console.error('Error saving employee:', error);
      alert(error.message || 'Failed to save employee. Please try again.');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee record?')) {
      const updated = await deleteEmployee(id);
      setEmployees(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar / Navigation */}
      <nav className="bg-slate-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            {isConnected ? (
              <span className="ml-4 flex items-center gap-1 text-xs bg-green-600 px-2 py-1 rounded-full text-white">
                <Database className="h-3 w-3" />
                Live Database
              </span>
            ) : (
              <span className="ml-4 flex items-center gap-1 text-xs bg-orange-500 px-2 py-1 rounded-full text-white">
                <HardDrive className="h-3 w-3" />
                Local Mode
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="text-white hover:text-primary" onClick={() => window.location.href = '/'}>
              Home
            </Button>
            <Button variant="ghost" className="text-white hover:text-primary" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <Tabs defaultValue="notices" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] mb-8">
            <TabsTrigger value="notices" className="flex gap-2">
              <Bell className="h-4 w-4" />
              Notices
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
              {messages.filter((m) => !m.read).length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                  {messages.filter((m) => !m.read).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex gap-2">
              <Users className="h-4 w-4" />
              Employees
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notices">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Post New Notice</CardTitle>
                    <CardDescription>Add a new announcement to the public noticeboard.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Notice Type</Label>
                        <Select 
                          value={formData.type} 
                          onValueChange={(value) => setFormData({...formData, type: value as Notice['type']})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="important">Important (Red)</SelectItem>
                            <SelectItem value="alert">Alert (Orange)</SelectItem>
                            <SelectItem value="promo">Promo (Green)</SelectItem>
                            <SelectItem value="update">Update (Blue)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                          id="title" 
                          placeholder="e.g., Holiday Closing" 
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea 
                          id="content" 
                          placeholder="Enter the details..." 
                          className="h-32"
                          value={formData.content}
                          onChange={(e) => setFormData({...formData, content: e.target.value})}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Post Notice
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* List Section */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Active Notices</h2>
                <div className="grid gap-4">
                  {notices.length === 0 ? (
                    <p className="text-gray-500 italic">No active notices.</p>
                  ) : (
                    notices.map((notice) => (
                      <Card key={notice.id} className={`border-l-4 ${
                        notice.type === 'important' ? 'border-l-red-500' :
                        notice.type === 'alert' ? 'border-l-orange-500' :
                        notice.type === 'promo' ? 'border-l-green-500' :
                        'border-l-blue-500'
                      }`}>
                        <CardContent className="pt-6 flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${
                                notice.type === 'important' ? 'bg-red-100 text-red-700' :
                                notice.type === 'alert' ? 'bg-orange-100 text-orange-700' :
                                notice.type === 'promo' ? 'bg-green-100 text-green-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {notice.type}
                              </span>
                              <span className="text-xs text-muted-foreground">{notice.date}</span>
                            </div>
                            <h3 className="font-bold text-lg">{notice.title}</h3>
                            <p className="text-gray-600 text-sm">{notice.content}</p>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => handleDelete(notice.id)}
                            className="shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Inbox</h2>
              {messages.length === 0 ? (
                <Card className="p-8 text-center text-gray-500">
                  <p>No messages received yet.</p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {messages.map((msg) => (
                    <Card key={msg.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{msg.subject}</CardTitle>
                            <CardDescription>
                              From: {msg.name} ({msg.email})
                              {msg.phone && <span className="block text-xs mt-1">Phone: {msg.phone}</span>}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground block mb-2">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                variant={msg.read ? "secondary" : "default"}
                                size="sm"
                                onClick={async () => {
                                  const updated = await markMessageRead(msg.id, !msg.read);
                                  setMessages(updated);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {msg.read ? "Mark Unread" : "Mark Read"}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="employees">
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <img src={logo} alt="Company Logo" className="h-16 w-auto" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Employee Management</h2>
                  <p className="text-gray-500">Manage workforce, banking details, and emergency contacts.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Employee Form */}
                <div className="xl:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Employee</CardTitle>
                      <CardDescription>Enter the employee's personal and professional details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleEmployeeSubmit} className="space-y-6">
                        {/* Personal Details */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                            <Users className="h-4 w-4" /> Personal Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="space-y-2">
                              <Label htmlFor="employee_no">Employee No</Label>
                              <Input id="employee_no" value={employeeForm.employee_no} onChange={e => setEmployeeForm({...employeeForm, employee_no: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input id="name" value={employeeForm.name} onChange={e => setEmployeeForm({...employeeForm, name: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="surname">Surname</Label>
                              <Input id="surname" value={employeeForm.surname} onChange={e => setEmployeeForm({...employeeForm, surname: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="id_number">ID Number</Label>
                              <Input id="id_number" value={employeeForm.id_number} onChange={e => setEmployeeForm({...employeeForm, id_number: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gender">Gender</Label>
                              <Select value={employeeForm.gender} onValueChange={(val: any) => setEmployeeForm({...employeeForm, gender: val})}>
                                <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="passport_no">Passport No</Label>
                              <Input id="passport_no" value={employeeForm.passport_no} onChange={e => setEmployeeForm({...employeeForm, passport_no: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="marital_status">Marital Status</Label>
                              <Select value={employeeForm.marital_status} onValueChange={(val: any) => setEmployeeForm({...employeeForm, marital_status: val})}>
                                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Single">Single</SelectItem>
                                  <SelectItem value="Married">Married</SelectItem>
                                  <SelectItem value="Divorced">Divorced</SelectItem>
                                  <SelectItem value="Widowed">Widowed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contact">Contact Number</Label>
                              <Input id="contact" value={employeeForm.contact} onChange={e => setEmployeeForm({...employeeForm, contact: e.target.value})} required />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="address">Address</Label>
                              <Textarea id="address" value={employeeForm.address} onChange={e => setEmployeeForm({...employeeForm, address: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="employment_date">Employment Date</Label>
                              <Input type="date" id="employment_date" value={employeeForm.employment_date} onChange={e => setEmployeeForm({...employeeForm, employment_date: e.target.value})} required />
                            </div>
                          </div>
                        </div>

                        {/* Banking Details */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                            <Database className="h-4 w-4" /> Banking Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="bank_name">Bank Name</Label>
                              <Select 
                                value={employeeForm.bank_name} 
                                onValueChange={(value) => setEmployeeForm({...employeeForm, bank_name: value})}
                              >
                                <SelectTrigger id="bank_name" className="h-12">
                                  <SelectValue placeholder="Select Bank" />
                                </SelectTrigger>
                                <SelectContent>
                                  {banks.map((bank) => (
                                    <SelectItem key={bank.name} value={bank.name} className="cursor-pointer">
                                       <div className="flex items-center gap-4">
                                         <div className="h-12 w-16 rounded bg-white border p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                           <img 
                                             src={bank.logo} 
                                             alt={bank.name} 
                                             className="h-full w-full object-contain"
                                             onError={(e) => {
                                               (e.target as HTMLImageElement).style.display = 'none';
                                               (e.target as HTMLImageElement).parentElement!.innerText = bank.name.charAt(0);
                                             }} 
                                           />
                                         </div>
                                         <span className="font-medium">{bank.name}</span>
                                       </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="account_no">Account No</Label>
                              <Input id="account_no" value={employeeForm.account_no} onChange={e => setEmployeeForm({...employeeForm, account_no: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="branch_code">Branch Code</Label>
                              <Input id="branch_code" value={employeeForm.branch_code} onChange={e => setEmployeeForm({...employeeForm, branch_code: e.target.value})} required />
                            </div>
                          </div>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                            <Bell className="h-4 w-4" /> Emergency Contacts
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="emergency_name">Name</Label>
                              <Input id="emergency_name" value={employeeForm.emergency_name} onChange={e => setEmployeeForm({...employeeForm, emergency_name: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="emergency_surname">Surname</Label>
                              <Input id="emergency_surname" value={employeeForm.emergency_surname} onChange={e => setEmployeeForm({...employeeForm, emergency_surname: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="emergency_relationship">Relationship</Label>
                              <Input id="emergency_relationship" value={employeeForm.emergency_relationship} onChange={e => setEmployeeForm({...employeeForm, emergency_relationship: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="emergency_contact">Contact Number</Label>
                              <Input id="emergency_contact" value={employeeForm.emergency_contact} onChange={e => setEmployeeForm({...employeeForm, emergency_contact: e.target.value})} required />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="emergency_address">Address</Label>
                              <Textarea id="emergency_address" value={employeeForm.emergency_address} onChange={e => setEmployeeForm({...employeeForm, emergency_address: e.target.value})} required />
                            </div>
                          </div>
                        </div>

                        {/* Documents */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                            <Upload className="h-4 w-4" /> Documents
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="id_copy" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" /> ID Copy
                              </Label>
                              <Input 
                                id="id_copy" 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={e => setIdFile(e.target.files?.[0] || null)} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="proof_account" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Proof of Account
                              </Label>
                              <Input 
                                id="proof_account" 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={e => setProofAccountFile(e.target.files?.[0] || null)} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sars" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" /> SARS Document
                              </Label>
                              <Input 
                                id="sars" 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={e => setSarsFile(e.target.files?.[0] || null)} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contract" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Contract
                              </Label>
                              <Input 
                                id="contract" 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={e => setContractFile(e.target.files?.[0] || null)} 
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="supporting" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Supporting Documents (Max 5)
                              </Label>
                              <Input 
                                id="supporting" 
                                type="file" 
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={e => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length > 5) {
                                    alert('Maximum 5 files allowed');
                                    e.target.value = '';
                                    setSupportingFiles([]);
                                  } else {
                                    setSupportingFiles(files);
                                  }
                                }} 
                              />
                              <p className="text-xs text-muted-foreground">Select up to 5 additional files.</p>
                            </div>
                          </div>
                        </div>

                        <Button type="submit" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Save Employee Record
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Employee List */}
                <div className="xl:col-span-1 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Staff List</h2>
                    <Badge variant="secondary" className="text-sm">{employees.length} Employees</Badge>
                  </div>
                  
                  <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                    <div className="space-y-4">
                      {employees.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed rounded-lg">
                          <Users className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                          <p className="text-gray-500 italic">No employees added yet.</p>
                        </div>
                      ) : (
                        employees.map((emp) => (
                          <Card key={emp.id} className="hover:shadow-md transition-all border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex gap-3 items-center">
                                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                    <AvatarFallback className="bg-slate-900 text-white font-bold">
                                      {emp.name.charAt(0)}{emp.surname.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-bold text-gray-900">{emp.name} {emp.surname}</h3>
                                    <p className="text-xs text-gray-500 font-mono bg-gray-100 px-1 rounded w-fit mt-0.5">{emp.employee_no}</p>
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                      <Phone className="h-3 w-3" /> {emp.contact}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 mt-4 pt-4 border-t">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex-1">
                                      <Eye className="h-3 w-3 mr-1" /> View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <div className="flex items-center gap-4 mb-4">
                                        <Avatar className="h-16 w-16 border-2 border-slate-200">
                                          <AvatarFallback className="bg-slate-900 text-white text-xl font-bold">
                                            {emp.name.charAt(0)}{emp.surname.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <DialogTitle className="text-2xl">{emp.name} {emp.surname}</DialogTitle>
                                          <DialogDescription>
                                            Employee ID: <span className="font-mono text-slate-900">{emp.employee_no}</span>
                                          </DialogDescription>
                                          <Badge className={emp.gender === 'Male' ? 'bg-blue-500' : emp.gender === 'Female' ? 'bg-pink-500' : 'bg-purple-500'}>
                                            {emp.gender}
                                          </Badge>
                                        </div>
                                      </div>
                                    </DialogHeader>

                                    <div className="space-y-6">
                                      {/* Personal Info */}
                                      <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-slate-50">
                                        <h4 className="col-span-2 font-semibold flex items-center gap-2 text-slate-900">
                                          <User className="h-4 w-4" /> Personal Information
                                        </h4>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">ID Number</Label>
                                          <p className="font-medium">{emp.id_number}</p>
                                        </div>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Passport No</Label>
                                          <p className="font-medium">{emp.passport_no || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Marital Status</Label>
                                          <p className="font-medium">{emp.marital_status}</p>
                                        </div>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Date Joined</Label>
                                          <p className="font-medium">{new Date(emp.employment_date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="col-span-2">
                                          <Label className="text-xs text-muted-foreground">Address</Label>
                                          <p className="font-medium">{emp.address}</p>
                                        </div>
                                      </div>

                                      {/* Banking Info */}
                                      <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-slate-50">
                                        <h4 className="col-span-2 font-semibold flex items-center gap-2 text-slate-900">
                                          <CreditCard className="h-4 w-4" /> Banking Details
                                        </h4>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Bank Name</Label>
                                          <p className="font-medium">{emp.bank_name}</p>
                                        </div>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Account Number</Label>
                                          <p className="font-medium font-mono">{emp.account_no}</p>
                                        </div>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Branch Code</Label>
                                          <p className="font-medium">{emp.branch_code}</p>
                                        </div>
                                      </div>

                                      {/* Emergency Contact */}
                                      <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-red-50/50 border-red-100">
                                        <h4 className="col-span-2 font-semibold flex items-center gap-2 text-red-900">
                                          <Bell className="h-4 w-4" /> Emergency Contact
                                        </h4>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Contact Person</Label>
                                          <p className="font-medium">{emp.emergency_name} {emp.emergency_surname}</p>
                                        </div>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Relationship</Label>
                                          <p className="font-medium">{emp.emergency_relationship}</p>
                                        </div>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Phone</Label>
                                          <p className="font-medium">{emp.emergency_contact}</p>
                                        </div>
                                        <div className="col-span-2">
                                          <Label className="text-xs text-muted-foreground">Address</Label>
                                          <p className="font-medium">{emp.emergency_address}</p>
                                        </div>
                                      </div>

                                      {/* Documents */}
                                      <div className="border p-4 rounded-lg bg-blue-50/50 border-blue-100">
                                        <h4 className="font-semibold flex items-center gap-2 text-blue-900 mb-4">
                                          <FileText className="h-4 w-4" /> Documents
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {emp.doc_id_copy && (
                                            <a href={emp.doc_id_copy} target="_blank" rel="noopener noreferrer">
                                              <Badge variant="outline" className="bg-white hover:bg-blue-50 cursor-pointer py-2 px-3 flex gap-2">
                                                ID Copy <Upload className="h-3 w-3" />
                                              </Badge>
                                            </a>
                                          )}
                                          {emp.doc_proof_account && (
                                            <a href={emp.doc_proof_account} target="_blank" rel="noopener noreferrer">
                                              <Badge variant="outline" className="bg-white hover:bg-blue-50 cursor-pointer py-2 px-3 flex gap-2">
                                                Proof of Acc <Upload className="h-3 w-3" />
                                              </Badge>
                                            </a>
                                          )}
                                          {emp.doc_sars && (
                                            <a href={emp.doc_sars} target="_blank" rel="noopener noreferrer">
                                              <Badge variant="outline" className="bg-white hover:bg-blue-50 cursor-pointer py-2 px-3 flex gap-2">
                                                SARS <Upload className="h-3 w-3" />
                                              </Badge>
                                            </a>
                                          )}
                                          {emp.doc_contract && (
                                            <a href={emp.doc_contract} target="_blank" rel="noopener noreferrer">
                                              <Badge variant="outline" className="bg-white hover:bg-blue-50 cursor-pointer py-2 px-3 flex gap-2">
                                                Contract <Upload className="h-3 w-3" />
                                              </Badge>
                                            </a>
                                          )}
                                          {emp.doc_supporting_docs && emp.doc_supporting_docs.map((doc, i) => (
                                            <a key={i} href={doc} target="_blank" rel="noopener noreferrer">
                                              <Badge variant="outline" className="bg-white hover:bg-blue-50 cursor-pointer py-2 px-3 flex gap-2">
                                                Support Doc {i+1} <Upload className="h-3 w-3" />
                                              </Badge>
                                            </a>
                                          ))}
                                          {(!emp.doc_id_copy && !emp.doc_proof_account && !emp.doc_sars && !emp.doc_contract && (!emp.doc_supporting_docs || emp.doc_supporting_docs.length === 0)) && (
                                            <p className="text-sm text-gray-500 italic">No documents uploaded.</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  onClick={() => handleDeleteEmployee(emp.id)}
                                  className="px-3"
                                  title="Delete Employee"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
