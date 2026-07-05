import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Globe, 
  Cpu, 
  Database, 
  Lightbulb,
  Plus,
  Trash2,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { useUser } from '../context/AuthContext';

const iconMap: Record<string, any> = {
  Terminal,
  Globe,
  Cpu,
  Database,
  Lightbulb
};

export default function Skills() {
  const { user } = useUser();
  const [categories, setCategories] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null); // ID of category being edited
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', icon: 'Terminal', skills: '' });

  useEffect(() => {
    fetch('/api/skills')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Skills data is not an array:", data);
          setCategories([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching skills:", err);
        setCategories([]);
        setLoading(false);
      });
  }, []);

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          icon: form.icon,
          skills: form.skills.split(',').map(s => s.trim()),
          order: categories.length + 1
        })
      });
      if (res.ok) {
        const newSkill = await res.json();
        setCategories([...categories, newSkill]);
        setIsAdding(false);
        setForm({ title: '', icon: 'Terminal', skills: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!id) {
      alert("Invalid ID for update");
      return;
    }
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          icon: form.icon,
          skills: form.skills.split(',').map(s => s.trim())
        })
      });
      if (res.ok) {
        const updatedSkill = await res.json();
        setCategories(prev => prev.map(c => (c._id || c.id) === id ? updatedSkill : c));
        setIsEditing(null);
      } else {
        const err = await res.json();
        alert(`Update failed: ${err.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("No ID provided for deletion");
      return;
    }
    // Remove confirm() as it may be blocked in some iframe environments
    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(prev => prev.filter(c => (c._id || c.id) !== id));
      } else {
        const error = await res.json();
        console.error("Delete failed:", error);
        alert(`Failed to delete: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const startEditing = (cat: any) => {
    setIsEditing(cat._id || cat.id);
    setForm({
      title: cat.title,
      icon: cat.icon,
      skills: Array.isArray(cat.skills) ? cat.skills.join(', ') : ''
    });
  };

  return (
    <section id="skills" className="py-24 px-6 bg-brand-100/30 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-900/40 mb-4">Expertise</p>
          <h2 className="text-4xl md:text-5xl font-display font-light tracking-tight text-brand-900">Technical <span className="italic font-normal">Skillset</span></h2>
          
          {user && !isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-8 px-6 py-2 bg-brand-900 text-brand-50 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto hover:bg-brand-800 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {isAdding && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-8 bg-white border-2 border-dashed border-brand-900/20 rounded-2xl flex flex-col gap-4"
              >
                <input 
                  placeholder="Category Title"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="bg-brand-50 border border-brand-900/10 rounded-xl px-4 py-2 text-sm focus:outline-none"
                />
                <select 
                  value={form.icon}
                  onChange={e => setForm({...form, icon: e.target.value})}
                  className="bg-brand-50 border border-brand-900/10 rounded-xl px-4 py-2 text-sm focus:outline-none"
                >
                  {Object.keys(iconMap).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
                <textarea 
                  placeholder="Skills (comma separated)"
                  value={form.skills}
                  onChange={e => setForm({...form, skills: e.target.value})}
                  className="bg-brand-50 border border-brand-900/10 rounded-xl px-4 py-2 text-sm focus:outline-none resize-none h-24"
                />
                <div className="flex gap-2">
                  <button onClick={handleAdd} className="flex-1 bg-brand-900 text-brand-50 py-2 rounded-xl text-xs font-bold">Add</button>
                  <button onClick={() => setIsAdding(false)} className="flex-1 bg-brand-900/5 text-brand-900 py-2 rounded-xl text-xs font-bold">Cancel</button>
                </div>
              </motion.div>
            )}

            {Array.isArray(categories) && categories.map((category, idx) => {
              const categoryId = category._id || category.id;
              return (
                <motion.div
                  key={categoryId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-4 sm:p-8 bg-brand-50 border border-brand-900/5 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative"
                >
                  {user && isEditing !== categoryId && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEditing(category)} className="p-2 bg-white rounded-full text-brand-900 hover:bg-brand-900 hover:text-white transition-all shadow-sm">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete(categoryId)} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {isEditing === categoryId ? (
                    <div className="flex flex-col gap-4">
                      <input 
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                        className="bg-white border border-brand-900/10 rounded-xl px-4 py-2 text-sm focus:outline-none"
                      />
                      <select 
                        value={form.icon}
                        onChange={e => setForm({...form, icon: e.target.value})}
                        className="bg-white border border-brand-900/10 rounded-xl px-4 py-2 text-sm focus:outline-none"
                      >
                        {Object.keys(iconMap).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                      </select>
                      <textarea 
                        value={form.skills}
                        onChange={e => setForm({...form, skills: e.target.value})}
                        className="bg-white border border-brand-900/10 rounded-xl px-4 py-2 text-sm focus:outline-none resize-none h-24"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate(categoryId)} className="flex-1 bg-brand-900 text-brand-50 py-2 rounded-xl text-xs font-bold">Save</button>
                        <button onClick={() => setIsEditing(null)} className="flex-1 bg-brand-900/5 text-brand-900 py-2 rounded-xl text-xs font-bold">Cancel</button>
                      </div>
                    </div>
                  ) : (
                  <>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-900/5 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-brand-900 group-hover:text-brand-50 transition-colors">
                      {React.createElement(iconMap[category.icon] || Terminal, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                    </div>
                    <h3 className="text-base sm:text-xl font-display font-semibold text-brand-900 mb-4">{category.title}</h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {category.skills.map((skill: string) => (
                        <li 
                          key={skill} 
                          className="flex items-start gap-2 sm:gap-3 text-brand-900/70 text-xs sm:text-sm font-medium"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 shrink-0" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </motion.div>
            )})}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
