import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, SectionTitle } from '@/components/ui/Section';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const categories = [
  { id: 'All', label: 'All', icon: '📸' },
  { id: 'Events', label: 'Events', icon: '🎉' },
  { id: 'Activities', label: 'Activities', icon: '🎯' },
  { id: 'Campus', label: 'Campus', icon: '🏫' }
];

const subcategories: { [key: string]: string[] } = {
  Events: ['Republic Day', 'Independence Day', 'Annual Day', 'Prize Distribution', 'Sports Day'],
  Activities: ['Club Events', 'Workshops', 'Seminars', 'Competitions', 'Performances'],
  Campus: ['Infrastructure', 'Facilities', 'Students', 'Staff', 'Events Venues']
};

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const fetchMoments = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/moments`;
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
      if (selectedYear) params.append('year', selectedYear.toString());
      if (params.toString()) url += '?' + params.toString();
      
      const res = await fetch(url);
      const data = await res.json();
      setMoments(data || []);
      
      // Extract unique years
      const years = Array.from(
        new Set(
          data
            .map((m: any) => m.eventDate ? new Date(m.eventDate).getFullYear() : null)
            .filter((y: any) => y)
        )
      ).sort((a, b) => (b as number) - (a as number)) as number[];
      setAvailableYears(years);
    } catch (err) {
      console.error('Error fetching moments:', err);
      setMoments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoments();
  }, [selectedCategory, selectedSubcategory, selectedYear]);

  const filtered = moments;

  return (
    <>
      <section className="gradient-hero py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Gallery</h1>
            <p className="text-primary-foreground/80 text-lg">
              Capturing moments of learning, celebration, and growth.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <SectionTitle title="Our Moments" subtitle="Browse through our collection of events, activities, and campus life" />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedSubcategory('');
                setSelectedYear(null);
              }}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'gradient-hero text-primary-foreground shadow-card'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Subcategory Filter */}
        {selectedCategory !== 'All' && subcategories[selectedCategory] && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedSubcategory('')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedSubcategory === ''
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All
              </button>
              {subcategories[selectedCategory].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedSubcategory === sub
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Year Filter */}
        {availableYears.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedYear(null)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedYear === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All Years
              </button>
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedYear === year
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading photos...</p>
          </div>
        ) : filtered.length > 0 ? (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((moment, i) => (
                <motion.div
                  key={moment._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedItem(i)}
                  className="cursor-pointer group"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted flex items-center justify-center p-4 group-hover:scale-[1.02] transition-transform shadow-card relative">
                    <img
                      src={moment.imagePath}
                      alt={moment.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="font-semibold text-white text-sm mb-1">{moment.title}</p>
                      {moment.eventDate && (
                        <p className="text-xs text-white/80 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(moment.eventDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No photos found in this category.</p>
          </div>
        )}
      </Section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem !== null && filtered[selectedItem] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-full max-w-4xl rounded-2xl bg-background overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-video bg-muted flex items-center justify-center">
                <img
                  src={filtered[selectedItem].imagePath}
                  alt={filtered[selectedItem].title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6 bg-card">
                <h2 className="text-2xl font-bold mb-2">{filtered[selectedItem].title}</h2>
                {filtered[selectedItem].description && (
                  <p className="text-muted-foreground mb-3">{filtered[selectedItem].description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {filtered[selectedItem].category}
                  </span>
                  {filtered[selectedItem].subcategory && (
                    <span className="bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full">
                      {filtered[selectedItem].subcategory}
                    </span>
                  )}
                  {filtered[selectedItem].eventDate && (
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(filtered[selectedItem].eventDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
