
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Calendar, Bell, ChevronLeft, ChevronRight, Check, Syringe, Stethoscope, Pill, SlidersHorizontal, Plus, Loader2 } from 'lucide-react';
import { Header, Card, Button } from '../components/UI';
import { supabase } from '../supabaseClient';
import { Reminder } from '../types';

const getReminderIcon = (type: string) => {
  switch (type) {
    case 'vaccine': return <Syringe className="w-6 h-6" />;
    case 'consultation': return <Stethoscope className="w-6 h-6" />;
    case 'medication': return <Pill className="w-6 h-6" />;
    default: return <Bell className="w-6 h-6" />;
  }
};

export const RemindersList: React.FC = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
            .from('reminders')
            .select('*')
            .eq('owner_id', session.user.id)
            .order('date', { ascending: true });

        if (error) throw error;
        setReminders(data || []);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const toggleComplete = async (id: string, currentStatus: boolean) => {
      // Optimistic update
      setReminders(prev => prev.map(r => r.id === id ? {...r, completed: !currentStatus} : r));
      
      await supabase.from('reminders').update({ completed: !currentStatus }).eq('id', id);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen pb-24">
      <Header title="Lembretes de Saúde" rightElement={
        <button onClick={() => navigate('/reminders/calendar')} className="text-slate-900 dark:text-white">
           <SlidersHorizontal className="w-6 h-6" />
        </button>
      } />

      <main className="p-4 flex flex-col gap-4">
        {reminders.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Nenhum lembrete encontrado.</div>
        ) : reminders.map((reminder) => (
          <div key={reminder.id} className={`flex items-center gap-4 bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 ${reminder.completed ? 'opacity-60' : ''}`}>
             <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${reminder.completed ? 'bg-zinc-200 dark:bg-zinc-800 text-slate-500' : 'bg-primary/20 text-primary-700 dark:text-primary'}`}>
                {getReminderIcon(reminder.type)}
             </div>
             <div className="flex-1">
                <p className={`text-base font-medium text-slate-900 dark:text-white ${reminder.completed ? 'line-through' : ''}`}>{reminder.title}</p>
                <p className={`text-sm text-slate-500 dark:text-slate-400 ${reminder.completed ? 'line-through' : ''}`}>{new Date(reminder.date).toLocaleDateString()}</p>
             </div>
             <div 
                onClick={() => toggleComplete(reminder.id, reminder.completed)}
                className="h-6 w-6 rounded-full border-2 border-zinc-300 dark:border-zinc-600 flex items-center justify-center cursor-pointer"
             >
                {reminder.completed && <div className="h-3 w-3 bg-primary rounded-full" />}
             </div>
          </div>
        ))}
      </main>

      <div className="fixed bottom-24 right-6 z-20">
          <button onClick={() => navigate('/records/new')} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-slate-900 shadow-lg hover:bg-primary-400 transition-colors">
            <Plus className="w-6 h-6" />
          </button>
       </div>
    </div>
  );
};

export const NewRecord: React.FC = () => {
  const navigate = useNavigate();
  const [type, setType] = React.useState<'vaccine' | 'consultation'>('vaccine');
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
      if (!title || !date) return;
      setLoading(true);
      try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;

          const { error } = await supabase.from('reminders').insert([{
              owner_id: session.user.id,
              title: title,
              date: date,
              type: type,
              completed: false
          }]);

          if (error) throw error;
          navigate('/reminders');
      } catch (error) {
          console.error(error);
          alert('Erro ao salvar');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen flex flex-col">
      <Header title="Novo Registro" onBack={() => navigate(-1)} />
      
      <main className="flex-1 p-4 flex flex-col gap-6">
        <div className="bg-zinc-200 dark:bg-zinc-800 p-1 rounded-full flex">
          {[
              { label: 'Vacinas', val: 'vaccine' }, 
              { label: 'Consultas', val: 'consultation' }
          ].map((t) => (
            <button 
              key={t.val}
              onClick={() => setType(t.val as any)}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${type === t.val ? 'bg-white dark:bg-dark-card shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-5">
           <label className="block">
              <span className="text-slate-900 dark:text-white font-medium mb-2 block">Título</span>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={type === 'vaccine' ? "Ex: V5 Felina" : "Ex: Check-up"} 
                className="w-full h-14 px-4 rounded-lg bg-white dark:bg-dark-card border border-zinc-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
              />
           </label>

           <label className="block relative">
              <span className="text-slate-900 dark:text-white font-medium mb-2 block">Data</span>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full h-14 px-4 rounded-lg bg-white dark:bg-dark-card border border-zinc-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
              />
           </label>
        </div>
      </main>

      <div className="p-4 bg-gradient-to-t from-white dark:from-dark-bg to-transparent">
        <Button onClick={handleSave} disabled={loading}>{loading ? 'Salvando...' : 'Salvar Registro'}</Button>
      </div>
    </div>
  );
};

export const ReminderCalendar: React.FC = () => {
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const navigate = useNavigate();
    
    return (
        <div className="bg-gray-50 dark:bg-dark-bg min-h-screen">
            <Header title="Calendário" onBack={() => navigate(-1)} />
            <main className="p-4">
               {/* Simplified static calendar for display purpose */}
               <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-4">
                      <ChevronLeft className="text-slate-400" />
                      <h2 className="font-bold text-lg text-slate-900 dark:text-white">Julho 2024</h2>
                      <ChevronRight className="text-slate-400" />
                  </div>
                  <div className="grid grid-cols-7 gap-y-4 text-center text-sm">
                      {['D','S','T','Q','Q','S','S'].map(d => <span key={d} className="text-slate-400 font-medium">{d}</span>)}
                      <span className="text-slate-300">30</span>
                      {days.map(d => (
                          <div key={d} className="relative flex justify-center">
                              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${d === 15 ? 'bg-primary/20 text-slate-900 font-bold' : 'text-slate-900 dark:text-white'}`}>
                                  {d}
                              </span>
                              {d === 15 && <div className="absolute -bottom-1 h-1 w-1 bg-primary rounded-full"></div>}
                          </div>
                      ))}
                  </div>
               </div>
            </main>
        </div>
    )
}
