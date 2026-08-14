import React, { useState, useEffect } from 'react';
import { Shield, Database, User, Save, Megaphone, PlusCircle, AlertCircle, CheckCircle, Percent, Receipt, Users } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard({ initialTab = 'admin-dashboard' }) {
  const mockStudents = api.getMockStudents();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedStudentId, setSelectedStudentId] = useState(mockStudents[0].id);
  const [selectedSubjectId, setSelectedSubjectId] = useState('SUB001');
  const [attended, setAttended] = useState('15');
  const [conducted, setConducted] = useState('20');
  const [pendingFees, setPendingFees] = useState('0');
  
  const [ancTitle, setAncTitle] = useState('');
  const [ancContent, setAncContent] = useState('');
  const [ancCategory, setAncCategory] = useState('ACADEMIC');
  
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('success');

  const activeStudent = mockStudents.find(s => s.id === selectedStudentId);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (activeStudent) {
      const record = activeStudent.attendance.subjects.find(r => r.subject_id === selectedSubjectId);
      if (record) {
        setAttended(record.attended.toString());
        setConducted(record.conducted.toString());
      }
      setPendingFees(activeStudent.fees.pending.toString());
    }
  }, [selectedStudentId, selectedSubjectId, activeStudent]);

  const handleUpdateAttendance = (e) => {
    e.preventDefault();
    setStatusMessage('');
    
    if (parseInt(attended) > parseInt(conducted)) {
      setStatusType('error');
      setStatusMessage('Error: Attended classes cannot exceed conducted classes.');
      return;
    }

    const success = api.updateMockStudentAttendance(selectedStudentId, selectedSubjectId, attended, conducted);
    
    if (success) {
      setStatusType('success');
      setStatusMessage(`Successfully updated attendance records for ${activeStudent.name}!`);
    } else {
      setStatusType('error');
      setStatusMessage('Error: Failed to update attendance records.');
    }
  };

  const handleUpdateFees = (e) => {
    e.preventDefault();
    setStatusMessage('');

    const success = api.updateMockStudentFees(selectedStudentId, pendingFees);

    if (success) {
      setStatusType('success');
      setStatusMessage(`Successfully updated pending fees invoice for ${activeStudent.name}!`);
    } else {
      setStatusType('error');
      setStatusMessage('Error: Failed to update fees balance.');
    }
  };

  const handleDispatchAnnouncement = (e) => {
    e.preventDefault();
    setStatusMessage('');

    if (!ancTitle.trim() || !ancContent.trim()) {
      setStatusType('error');
      setStatusMessage('Error: Announcement title and content cannot be blank.');
      return;
    }

    const newAnc = api.dispatchMockAnnouncement(ancTitle, ancContent, ancCategory);
    if (newAnc) {
      setStatusType('success');
      setStatusMessage(`Broadcast dispatched: "${ancTitle}" is now live across student feeds!`);
      setAncTitle('');
      setAncContent('');
    } else {
      setStatusType('error');
      setStatusMessage('Error: Failed to post announcement broadcast.');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Admin Header */}
      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-display font-bold text-lg border border-purple-500/20">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Admin Management Console</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              System Administrator portal for modifying student attendance, fees ledger, & broadcasting notices.
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-3 ${
          statusType === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
        }`}>
          {statusType === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Editor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Attendance Modifier */}
        <div className="lg:col-span-6 glass-card p-6 flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
            <Percent className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Modify Attendance Records
          </h3>

          <form onSubmit={handleUpdateAttendance} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">Select Student:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="glass-input text-xs font-bold"
              >
                {mockStudents.map((stu) => (
                  <option key={stu.id} value={stu.id}>
                    {stu.name} ({stu.roll_number}) - Overall: {stu.attendance.overall_percentage}%
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">Select Subject Course:</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="glass-input text-xs font-bold"
              >
                {activeStudent?.attendance.subjects.map((sub) => (
                  <option key={sub.subject_id} value={sub.subject_id}>
                    {sub.subject_name} ({sub.subject_code})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">Attended:</label>
                <input
                  type="number"
                  min="0"
                  value={attended}
                  onChange={(e) => setAttended(e.target.value)}
                  className="glass-input text-xs font-bold text-center"
                />
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">Conducted:</label>
                <input
                  type="number"
                  min="1"
                  value={conducted}
                  onChange={(e) => setConducted(e.target.value)}
                  className="glass-input text-xs font-bold text-center"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary py-2.5 text-xs font-bold mt-2">
              <Save className="h-4 w-4" /> Save Attendance Changes
            </button>
          </form>
        </div>

        {/* Fees Ledger Modifier */}
        <div className="lg:col-span-6 glass-card p-6 flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
            <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Modify Fee Ledger Dues
          </h3>

          <form onSubmit={handleUpdateFees} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">Select Student:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="glass-input text-xs font-bold"
              >
                {mockStudents.map((stu) => (
                  <option key={stu.id} value={stu.id}>
                    {stu.name} - Pending Dues: ₹{stu.fees.pending.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">New Pending Amount (₹):</label>
              <input
                type="number"
                min="0"
                value={pendingFees}
                onChange={(e) => setPendingFees(e.target.value)}
                className="glass-input text-xs font-bold"
              />
            </div>

            <button type="submit" className="btn-primary py-2.5 text-xs font-bold mt-2">
              <Save className="h-4 w-4" /> Update Fees Ledger
            </button>
          </form>
        </div>

        {/* Notice Broadcaster */}
        <div className="lg:col-span-12 glass-card p-6 flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
            <Megaphone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Broadcast Notice to Campus Board
          </h3>

          <form onSubmit={handleDispatchAnnouncement} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 flex flex-col gap-1 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">Notice Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Semester Exam Schedule Released"
                  value={ancTitle}
                  onChange={(e) => setAncTitle(e.target.value)}
                  className="glass-input text-xs"
                />
              </div>

              <div className="md:col-span-4 flex flex-col gap-1 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">Category Tag:</label>
                <select
                  value={ancCategory}
                  onChange={(e) => setAncCategory(e.target.value)}
                  className="glass-input text-xs font-bold"
                >
                  <option value="ACADEMIC">ACADEMIC</option>
                  <option value="EXAM">EXAM</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="FEST">FEST</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">Notice Body Text:</label>
              <textarea
                rows="3"
                placeholder="Enter full notice body text to broadcast across student and parent feeds..."
                value={ancContent}
                onChange={(e) => setAncContent(e.target.value)}
                className="glass-input text-xs"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary py-2.5 text-xs font-bold w-fit">
              <PlusCircle className="h-4 w-4" /> Dispatch Notice
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
