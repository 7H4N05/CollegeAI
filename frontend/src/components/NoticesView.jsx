import React, { useState, useEffect } from 'react';
import { Bell, Search, Megaphone } from 'lucide-react';
import { api } from '../services/api';

export default function NoticesView() {
  const [announcements, setAnnouncements] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getAnnouncements();
        setAnnouncements(res.announcements);
      } catch (err) {
        console.error("Error loading announcements", err);
      }
    }
    loadData();
  }, []);

  const categories = ['ALL', 'ACADEMIC', 'EXAM', 'ADMIN', 'FEST'];

  const filtered = announcements.filter(a => {
    const matchesCat = categoryFilter === 'ALL' || a.category === categoryFilter;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Campus Notices Board</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official announcements, examination circulars, and administration notices.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input text-xs py-2 pl-8 pr-3"
          />
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-3" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
              categoryFilter === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notice List */}
      <div className="flex flex-col gap-4">
        {filtered.map((anc) => (
          <div key={anc.id} className="glass-card p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase">
                {anc.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">{anc.date}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{anc.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{anc.content}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
