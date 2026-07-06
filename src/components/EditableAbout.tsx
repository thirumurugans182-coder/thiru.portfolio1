import React, { useState, useEffect } from 'react';
import { useUser } from '../context/AuthContext';
import { Edit2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function EditableAbout() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [data, setData] = useState({
    heading: "I am Thirumurugan S., an Engineering Student.",
    italicPart: "Thirumurugan S.",
    description1: "Hi, I'm Thirumurugan (Thiru), a final-year Electronics and Communication Engineering (ECE) student with a strong interest in technology, software development, and artificial intelligence. I enjoy solving problems through programming and continuously improving my technical skills.",
    description2: "I have experience in Java, Python, web development, and database technologies, and I am passionate about building practical projects that address real-world challenges. I am a quick learner who enjoys exploring new technologies, taking on challenging projects, and expanding my knowledge in the software domain."
  });

  const [editForm, setEditForm] = useState(data);

  useEffect(() => {
    fetch('/api/about')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(fetchedData => {
        if (fetchedData && fetchedData.heading) {
          const cleanedData = {
            heading: fetchedData.heading,
            italicPart: fetchedData.italicPart || "Thirumurugan S.",
            description1: fetchedData.description1 || "",
            description2: fetchedData.description2 || ""
          };
          setData(cleanedData);
          setEditForm(cleanedData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching about data:", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heading: editForm.heading,
          italicPart: editForm.italicPart,
          description1: editForm.description1,
          description2: editForm.description2
        })
      });
      if (res.ok) {
        setData(editForm);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating about data:", err);
      alert("Failed to save changes.");
    }
  };

  return (
    <section id="about" className="py-24 px-6 bg-brand-50 relative group">
      {user && !isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-8 right-8 p-3 bg-white border border-brand-900/10 rounded-full text-brand-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <Edit2 className="w-5 h-5" />
        </button>
      )}

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative">
        {/* Top decorative line */}
        <div className="w-32 h-px bg-brand-900/20 mb-16 sm:mb-24" />

        <div className="w-full max-w-4xl px-4">
          <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div 
              key="edit-about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 text-left max-w-2xl mx-auto"
            >
              <h3 className="text-xl font-display font-bold text-brand-900">Edit About Me</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40">Heading</label>
                  <input 
                    type="text" 
                    value={editForm.heading}
                    onChange={e => setEditForm({...editForm, heading: e.target.value})}
                    className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-3 text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900/5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40">Italic Highlight Word</label>
                  <input 
                    type="text" 
                    value={editForm.italicPart}
                    onChange={e => setEditForm({...editForm, italicPart: e.target.value})}
                    className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-3 text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900/5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40">Description Para 1</label>
                  <textarea 
                    rows={4}
                    value={editForm.description1}
                    onChange={e => setEditForm({...editForm, description1: e.target.value})}
                    className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-3 text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900/5 resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40">Description Para 2</label>
                  <textarea 
                    rows={4}
                    value={editForm.description2}
                    onChange={e => setEditForm({...editForm, description2: e.target.value})}
                    className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-3 text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900/5 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleSave}
                  className="bg-brand-900 text-brand-50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-800 transition-all"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
                <button 
                  onClick={() => { setIsEditing(false); setEditForm(data); }}
                  className="bg-brand-900/5 text-brand-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-900/10 transition-all"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="view-about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-900/60 mb-2 sm:mb-6">About Me</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-light tracking-tight mb-6 sm:mb-12 leading-tight text-brand-900 max-w-3xl">
                {data.heading.split(data.italicPart).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="italic underline decoration-brand-900/10 underline-offset-8">{data.italicPart}</span>
                    )}
                  </React.Fragment>
                ))}
              </h2>
              <div className="space-y-4 sm:space-y-8 text-brand-900/80 leading-relaxed max-w-2xl text-sm sm:text-lg mx-auto">
                <p>{data.description1}</p>
                <p>{data.description2}</p>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {/* Bottom decorative line */}
        <div className="w-32 h-px bg-brand-900/20 mt-16 sm:mt-24" />
      </div>
    </section>
  );
}
