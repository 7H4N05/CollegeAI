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
  Receipt,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const mockStudents = api.getMockStudents();
  
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
      setStatusMessage(`Broadcast dispatched: "${ancTitle}" is now live!`);
      setAncTitle('');
      setAncContent('');
    } else {
      setStatusType('error');
      setStatusMessage('Error: Failed to post announcement broadcast.');
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-display font-extrabold text-xl shadow-lg shadow-purple-500/30">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-extrabold text-white">
                Admin Control Console
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                FULL ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Modify mock database records, update student attendance, alter fee balances, & broadcast notices.
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3 ${
          statusType === 'success'
            ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
            : 'bg-red-950/60 border-red-500/30 text-red-300'
        }`}>
          {statusType === 'success' ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Attendance Modifier */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-teal-400 border-b border-white/10 pb-3">
            <Percent className="h-5 w-5" />
            <h3 className="font-display font-bold text-base text-white">Modify Attendance Records</h3>
          </div>

          <form onSubmit={handleUpdateAttendance} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Select Target Student:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="glass-input text-xs font-bold text-white bg-slate-900"
              >
                {mockStudents.map((stu) => (
                  <option key={stu.id} value={stu.id}>
                    {stu.name} ({stu.roll_number}) - Overall: {stu.attendance.overall_percentage}%
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Select Subject Course:</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="glass-input text-xs font-bold text-white bg-slate-900"
              >
                {activeStudent?.attendance.subjects.map((sub) => (
                  <option key={sub.subject_id} value={sub.subject_id}>
                    {sub.subject_name} ({sub.subject_code})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Attended Classes:</label>
                <input
                  type="number"
                  min="0"
                  value={attended}
                  onChange={(e) => setAttended(e.target.value)}
                  className="glass-input text-sm text-center font-bold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Conducted Classes:</label>
                <input
                  type="number"
                  min="1"
                  value={conducted}
                  onChange={(e) => setConducted(e.target.value)}
                  className="glass-input text-sm text-center font-bold"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary py-3 text-xs font-bold mt-2">
              <Save className="h-4 w-4" /> Commit Attendance Updates
            </button>
          </form>
        </div>

        {/* Fees Modifier */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-emerald-400 border-b border-white/10 pb-3">
            <Receipt className="h-5 w-5" />
            <h3 className="font-display font-bold text-base text-white">Modify Fees Ledger Balance</h3>
          </div>

          <form onSubmit={handleUpdateFees} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Select Target Student:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="glass-input text-xs font-bold text-white bg-slate-900"
              >
                {mockStudents.map((stu) => (
                  <option key={stu.id} value={stu.id}>
                    {stu.name} - Pending Dues: ₹{stu.fees.pending.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">New Outstanding Pending Amount (₹):</label>
              <input
                type="number"
                min="0"
                value={pendingFees}
                onChange={(e) => setPendingFees(e.target.value)}
                className="glass-input text-sm font-bold text-white"
              />
            </div>

            <button type="submit" className="btn-primary py-3 text-xs font-bold mt-2">
              <Save className="h-4 w-4" /> Save Fee Balance Changes
            </button>
          </form>
        </div>

        {/* Announcement Broadcaster */}
        <div className="lg:col-span-12 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-indigo-400 border-b border-white/10 pb-3">
            <Megaphone className="h-5 w-5" />
            <h3 className="font-display font-bold text-base text-white">Broadcast Announcement to Notice Board</h3>
          </div>

          <form onSubmit={handleDispatchAnnouncement} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Announcement Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Semester Exam Schedule Released"
                  value={ancTitle}
                  onChange={(e) => setAncTitle(e.target.value)}
                  className="glass-input text-xs text-white"
                />
              </div>

              <div className="md:col-span-4 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Category Tag:</label>
                <select
                  value={ancCategory}
                  onChange={(e) => setAncCategory(e.target.value)}
                  className="glass-input text-xs font-bold text-white bg-slate-900"
                >
                  <option value="ACADEMIC">ACADEMIC</option>
                  <option value="EXAM">EXAM</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="FEST">FEST</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Detailed Announcement Body:</label>
              <textarea
                rows="3"
                placeholder="Enter full notice body text to broadcast across student and parent feeds..."
                value={ancContent}
                onChange={(e) => setAncContent(e.target.value)}
                className="glass-input text-xs text-white"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary py-3 text-xs font-bold w-fit">
              <PlusCircle className="h-4 w-4" /> Broadcast Notice
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
