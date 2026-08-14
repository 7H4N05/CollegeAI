import React, { useState } from 'react';
import { 
  Shield, 
  Database, 
  User, 
  BookOpen, 
  Save, 
  Megaphone, 
  PlusCircle, 
  AlertCircle, 
  CheckCircle,
  Percent,
  Receipt
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const mockStudents = api.getMockStudents();
  
  // State for attendance editor
  const [selectedStudentId, setSelectedStudentId] = useState(mockStudents[0].id);
  const [selectedSubjectId, setSelectedSubjectId] = useState('SUB001');
  const [attended, setAttended] = useState('15');
  const [conducted, setConducted] = useState('20');
  
  // State for fees editor
  const [pendingFees, setPendingFees] = useState('0');
  
  // State for announcements dispatcher
  const [ancTitle, setAncTitle] = useState('');
  const [ancContent, setAncContent] = useState('');
  const [ancCategory, setAncCategory] = useState('ACADEMIC');
  
  // Status messages
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('success'); // success | error

  const activeStudent = mockStudents.find(s => s.id === selectedStudentId);

  // Sync inputs when student or subject is selected
  React.useEffect(() => {
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
      setStatusMessage(`Broadcasted announcement: "${newAnc.title}" to notice boards!`);
      setAncTitle('');
      setAncContent('');
    } else {
      setStatusType('error');
      setStatusMessage('Error: Failed to dispatch announcement.');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="p-2.5 bg-indigo-600 rounded-lg text-white">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-display font-extrabold text-slate-950 dark:text-white leading-tight">
            Administrative Control Panel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Sandbox Database Editor for live hackathon presentation flow modification.
          </p>
        </div>
      </div>

      {/* Global Status Banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border animate-fade-in ${
          statusType === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400'
        }`}>
          {statusType === 'success' ? <CheckCircle className="h-4.5 w-4.5" /> : <AlertCircle className="h-4.5 w-4.5" />}
          <p className="font-semibold">{statusMessage}</p>
        </div>
      )}

      {/* Database Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Stats */}
        <div className="glass-panel p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 text-teal-600 rounded-lg">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Database</span>
            <p className="text-xs font-bold text-slate-800 dark:text-white">SQLite (Simulated Engine)</p>
            <p className="text-[10px] text-slate-500 mt-0.5">10 Students • 10 Parents • 15 Subjects</p>
          </div>
        </div>

        {/* Database Status */}
        <div className="glass-panel p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-lg">
            <User className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Session</span>
            <p className="text-xs font-bold text-slate-800 dark:text-white">Administrator Portal</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Permissions level: READ & WRITE</p>
          </div>
        </div>

        {/* Port details */}
        <div className="glass-panel p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-lg">
            <Megaphone className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Live Broadcast Server</span>
            <p className="text-xs font-bold text-slate-800 dark:text-white">Active Channel</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Dispatches notifications immediately</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sandbox Editor Columns (Left Pane) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Persona selector & Editor */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-5">
            <h3 className="text-sm font-display font-extrabold border-b border-slate-100 dark:border-slate-850 pb-2">
              Academic Database Sandbox Editor
            </h3>
            
            {/* Student selection dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase">
                Select Target Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-teal-500 text-slate-900 dark:text-white"
              >
                {mockStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.roll_number}) • Att: {s.attendance.overall}%</option>
                ))}
              </select>
            </div>

            {/* Editing grid */}
            {activeStudent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Attendance Editor Form */}
                <form onSubmit={handleUpdateAttendance} className="flex flex-col gap-4 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200/50 dark:border-slate-850">
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                    <Percent className="h-4 w-4" /> Edit Attendance Records
                  </span>
                  
                  {/* Subject select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-slate-400">Subject</label>
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded text-xs outline-none"
                    >
                      {activeStudent.attendance.subjects.map(r => {
                        const name = api.getMockStudents()[0].attendance.subjects.find(sObj => sObj.subject_id === r.subject_id); // reference names
                        return <option key={r.subject_id} value={r.subject_id}>{r.subject_id}</option>;
                      })}
                    </select>
                  </div>

                  {/* Values */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">Attended</label>
                      <input
                        type="number"
                        min="0"
                        value={attended}
                        onChange={(e) => setAttended(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded text-xs text-center font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">Conducted</label>
                      <input
                        type="number"
                        min="1"
                        value={conducted}
                        onChange={(e) => setConducted(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded text-xs text-center font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary text-xs py-2 justify-center"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Attendance
                  </button>
                </form>

                {/* Fees Editor Form */}
                <form onSubmit={handleUpdateFees} className="flex flex-col gap-4 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200/50 dark:border-slate-850 justify-between">
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Receipt className="h-4 w-4" /> Edit Pending Fees
                    </span>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold text-slate-400">Tuition outstanding (₹)</label>
                      <input
                        type="number"
                        min="0"
                        max="75000"
                        value={pendingFees}
                        onChange={(e) => setPendingFees(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded text-xs font-bold outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Tuition base is ₹75,000. Setting this to 0 marks student as PAID. Outstanding values mark as PARTIAL.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary text-xs py-2 justify-center mt-2"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Fees Balance
                  </button>
                </form>

              </div>
            )}

          </div>

        </div>

        {/* Announcements Dispatcher (Right Pane) */}
        <div className="lg:col-span-4">
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-4 h-full">
            <h3 className="text-sm font-display font-extrabold border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
              <Megaphone className="h-4.5 w-4.5 text-indigo-500" /> Dispatch Notices
            </h3>

            <form onSubmit={handleDispatchAnnouncement} className="flex flex-col gap-4">
              
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-semibold text-slate-400">Notice Category</label>
                <select
                  value={ancCategory}
                  onChange={(e) => setAncCategory(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded text-xs outline-none"
                >
                  <option value="ACADEMIC">Academic Office</option>
                  <option value="EXAM">Examination Cell</option>
                  <option value="FEST">Student Affairs / Fest</option>
                  <option value="ADMIN">Administrative Dean</option>
                </select>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-semibold text-slate-400">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End Semester Results Declared"
                  value={ancTitle}
                  onChange={(e) => setAncTitle(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded text-xs outline-none"
                />
              </div>

              {/* Body */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-semibold text-slate-400">Message Content</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Write the public announcement text..."
                  value={ancContent}
                  onChange={(e) => setAncContent(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded text-xs outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-primary text-xs py-2.5 justify-center flex items-center gap-1.5"
              >
                <PlusCircle className="h-4 w-4" /> Broadcast Announcement
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
