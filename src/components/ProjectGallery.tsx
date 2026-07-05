import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon } from 'lucide-react';
import { useUser } from '../context/AuthContext';

export default function ProjectGallery() {
  const { user } = useUser();
  const [projects, setProjects] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ title: '', category: '', imageUrl: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("Projects data is not an array:", data);
          setProjects([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        setProjects([]);
        setLoading(false);
      });
  }, []);

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          order: projects.length + 1
        })
      });
      if (res.ok) {
        const newProj = await res.json();
        setProjects([...projects, newProj]);
        setIsAdding(false);
        setForm({ title: '', category: '', imageUrl: '' });
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
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const updatedProj = await res.json();
        setProjects(prev => prev.map(p => (p._id || p.id) === id ? updatedProj : p));
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
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(prev => prev.filter(p => (p._id || p.id) !== id));
      } else {
        const error = await res.json();
        console.error("Delete failed:", error);
        alert(`Failed to delete: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const startEditing = (proj: any) => {
    setIsEditing(proj._id || proj.id);
    setForm({
      title: proj.title,
      category: proj.category,
      imageUrl: proj.imageUrl || ''
    });
  };

  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto relative group">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className="text-4xl md:text-6xl font-display font-light tracking-tight mb-4 text-brand-900">Selected <span className="italic">Works</span></h2>
          <p className="text-brand-900/60 max-w-md">A curated collection of moments captured across various environments and perspectives.</p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-brand-900/40 border-b border-brand-900/10 pb-1">Archive</span>
          {user && !isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="px-6 py-2 bg-brand-900 text-brand-50 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-brand-800 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-12 lg:gap-20">
        <AnimatePresence mode="popLayout">
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 bg-white border-2 border-dashed border-brand-900/20 rounded-3xl flex flex-col gap-4"
            >
              <h3 className="font-display font-bold text-brand-900">New Project</h3>
              <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-brand-50 border border-brand-900/10 rounded-xl px-4 py-2 text-sm focus:outline-none" />
              <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="bg-brand-50 border border-brand-900/10 rounded-xl px-4 py-2 text-sm focus:outline-none" />
              
              <div className="relative group/upload">
                {form.imageUrl ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-brand-900/10 mb-2">
                    <img src={form.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      onClick={() => setForm({...form, imageUrl: ''})}
                      className="absolute top-2 right-2 p-1.5 bg-brand-900 text-white rounded-full opacity-0 group-hover/upload:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video bg-brand-50 border-2 border-dashed border-brand-900/10 rounded-xl cursor-pointer hover:bg-brand-900/5 transition-colors mb-2">
                    <ImageIcon className="w-8 h-8 text-brand-900/20 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40">Upload Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              <div className="flex gap-2">
                <button onClick={handleAdd} className="flex-1 bg-brand-900 text-brand-50 py-2 rounded-xl text-xs font-bold">Add</button>
                <button onClick={() => setIsAdding(false)} className="flex-1 bg-brand-900/5 text-brand-900 py-2 rounded-xl text-xs font-bold">Cancel</button>
              </div>
            </motion.div>
          )}

          {Array.isArray(projects) && projects.map((project, index) => {
            const projectId = project._id || project.id;
            return (
              <motion.div
                key={projectId}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group cursor-pointer relative"
              >
                {user && isEditing !== projectId && (
                  <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEditing(project)} className="p-2 bg-white rounded-full text-brand-900 hover:bg-brand-900 hover:text-white transition-all shadow-md">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(projectId)} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {isEditing === projectId ? (
                  <div className="p-8 bg-white border border-brand-900/10 rounded-3xl flex flex-col gap-4">
                    <h3 className="font-display font-bold text-brand-900">Edit Project</h3>
                    <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-brand-50 border border-brand-900/10 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                    <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="bg-brand-50 border border-brand-900/10 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                    
                    <div className="relative group/upload">
                      {form.imageUrl ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-brand-900/10 mb-2">
                          <img src={form.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                          <button 
                            onClick={() => setForm({...form, imageUrl: ''})}
                            className="absolute top-2 right-2 p-1.5 bg-brand-900 text-white rounded-full opacity-0 group-hover/upload:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-video bg-brand-50 border-2 border-dashed border-brand-900/10 rounded-xl cursor-pointer hover:bg-brand-900/5 transition-colors mb-2">
                          <ImageIcon className="w-8 h-8 text-brand-900/20 mb-2" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40">Change Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(projectId)} className="flex-1 bg-brand-900 text-brand-50 py-2 rounded-xl text-xs font-bold">Save</button>
                      <button onClick={() => setIsEditing(null)} className="flex-1 bg-brand-900/5 text-brand-900 py-2 rounded-xl text-xs font-bold">Cancel</button>
                    </div>
                  </div>
                ) : (
                <>
                  <div className="relative aspect-[4/5] overflow-hidden bg-brand-900/5 mb-6">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-brand-900/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/10 transition-colors duration-500" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40 mb-1">{project.category}</p>
                    <h3 className="text-base sm:text-xl font-display text-brand-900 group-hover:translate-x-2 transition-transform duration-500">{project.title}</h3>
                    </div>
                    <div className="h-px w-12 bg-brand-900/10 mt-6" />
                  </div>
                </>
              )}
            </motion.div>
          )})}
        </AnimatePresence>
      </div>
    </section>
  );
}
