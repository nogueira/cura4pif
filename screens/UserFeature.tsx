
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, User as UserIcon, Bell, Info, HelpCircle, Lock, ChevronRight, Search, 
  ChevronDown, Trophy, PlusCircle, Syringe, CalendarClock, 
  PawPrint, Scale, Weight, SunMoon, Activity, RefreshCcw, Megaphone, Bug, Edit2, Loader2,
  Plus
} from 'lucide-react';
import { Header, ListItem, Input, Button } from '../components/UI';
import { ACHIEVEMENTS, FAQ_ITEMS, UPDATES } from '../constants';
import { supabase } from '../supabaseClient';

const getAchievementIcon = (iconName: string, className = "w-8 h-8") => {
  const props = { className };
  switch (iconName) {
    case 'add_chart': return <PlusCircle {...props} />;
    case 'vaccines': return <Syringe {...props} />;
    case 'event_repeat': return <CalendarClock {...props} />;
    case 'pets': return <PawPrint {...props} />;
    case 'monitor_weight': return <Scale {...props} />;
    case 'lock': return <Lock {...props} />;
    default: return <Trophy {...props} />;
  }
};

const getUpdateIcon = (type: string) => {
  const props = { className: "w-6 h-6" };
  switch (type) {
    case 'feature': return <Activity {...props} />;
    case 'improvement': return <RefreshCcw {...props} />;
    case 'announcement': return <Megaphone {...props} />;
    case 'fix': return <Bug {...props} />;
    default: return <Info {...props} />;
  }
};

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [cats, setCats] = useState<any[]>([]);
  const [stats, setStats] = useState({ weight: 0, reminders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            // Fetch Profile
            const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            setProfile(profileData);

            // Fetch Pets
            const { data: catsData } = await supabase.from('cats').select('id, name, image_url').eq('owner_id', session.user.id);
            setCats(catsData || []);

            // Fetch Stats
            // Count weight records (RLS filters by owner implicitly via cat relationship policies)
            const { count: wCount } = await supabase.from('weight_records').select('*', { count: 'exact', head: true });
            // Count reminders
            const { count: rCount } = await supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('owner_id', session.user.id);

            setStats({ weight: wCount || 0, reminders: rCount || 0 });
        }
        setLoading(false);
    };
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('cura4pif_auth');
    navigate('/login');
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen pb-24">
      <Header title="Perfil e Configurações" showBack={false} />

      <main className="p-4 flex flex-col gap-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-32 w-32 rounded-full bg-cover bg-center bg-zinc-200 border-4 border-white dark:border-zinc-800 shadow-md" style={{ backgroundImage: `url('${profile?.avatar_url || 'https://via.placeholder.com/150'}')` }}></div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile?.name || 'Usuário'}</h2>
            <p className="text-primary">{profile?.email}</p>
          </div>
          <button 
            onClick={() => navigate('/profile/edit')}
            className="bg-primary/20 text-primary-700 dark:text-primary font-bold px-6 py-2 rounded-lg text-sm hover:bg-primary/30 transition-colors"
          >
            Editar Perfil
          </button>
        </div>

        {/* My Pets Section */}
        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Meus Pets</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {cats.map(cat => (
              <div key={cat.id} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group" onClick={() => navigate(`/cats/${cat.id}`)}>
                <div className="h-16 w-16 rounded-full bg-cover bg-center border-2 border-white dark:border-zinc-800 shadow-sm group-hover:scale-105 transition-transform" style={{ backgroundImage: `url('${cat.image_url || 'https://placekitten.com/200/200'}')` }}></div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[64px] truncate text-center">{cat.name}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group" onClick={() => navigate('/cats/new/edit')}>
              <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 group-hover:border-primary group-hover:text-primary transition-colors">
                <Plus className="w-6 h-6 text-slate-400 group-hover:text-primary" />
              </div>
              <span className="text-xs font-medium text-slate-500">Adicionar</span>
            </div>
          </div>
        </section>

        {/* My Health Records Section */}
        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Meus Registros</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{stats.weight}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Pesagens</p>
              </div>
            </div>
            <div 
              className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center gap-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              onClick={() => navigate('/reminders')}
            >
              <div className="h-10 w-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{stats.reminders}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Lembretes</p>
              </div>
            </div>
          </div>
        </section>

        {/* My Achievements Section */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Minhas Conquistas</h3>
            <button onClick={() => navigate('/achievements')} className="text-xs font-bold text-primary hover:text-primary-600">Ver todas</button>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 flex gap-4 overflow-x-auto no-scrollbar">
            {ACHIEVEMENTS.filter(a => a.unlocked).slice(0, 5).map(ach => (
              <div key={ach.id} className="flex flex-col items-center gap-2 min-w-[70px] shrink-0">
                 <div className="h-12 w-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                    {getAchievementIcon(ach.icon, "w-6 h-6")}
                 </div>
                 <span className="text-[10px] font-medium text-center text-slate-700 dark:text-slate-300 truncate w-full">{ach.title}</span>
              </div>
            ))}
            {ACHIEVEMENTS.filter(a => a.unlocked).length === 0 && (
              <p className="text-sm text-slate-400 py-2">Nenhuma conquista desbloqueada ainda.</p>
            )}
          </div>
        </section>

        {/* Settings Section */}
        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Configurações</h3>
          <div className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800">
             <ListItem title="Unidades" subtitle="Métrico (kg)" icon={<Weight className="w-5 h-5"/>} />
             <ListItem title="Aparência" subtitle="Padrão do Sistema" icon={<SunMoon className="w-5 h-5"/>} />
          </div>
        </section>

        {/* Info Section */}
        <section>
          <div className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800">
             <ListItem title="Ajuda & Suporte" icon={<HelpCircle className="w-5 h-5"/>} onClick={() => navigate('/faq')} />
             <ListItem title="Sobre o App" icon={<Info className="w-5 h-5"/>} onClick={() => navigate('/updates')} />
          </div>
        </section>

        <button onClick={handleLogout} className="w-full py-4 text-red-500 font-bold bg-white dark:bg-dark-card rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">Sair</button>
      </main>
    </div>
  );
};

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const load = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
              const { data } = await supabase.from('profiles').select('name').eq('id', session.user.id).single();
              if (data) setName(data.name || '');
          }
      };
      load();
  }, []);

  const handleSave = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
          await supabase.from('profiles').update({ name }).eq('id', session.user.id);
          navigate('/profile');
      }
      setLoading(false);
  };
  
  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen flex flex-col">
      <Header title="Editar Perfil" onBack={() => navigate('/profile')} />
      <main className="flex-1 p-6 flex flex-col gap-6">
        <div className="flex justify-center mb-4">
           <div className="h-32 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800 relative flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-slate-400" />
              <button className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-slate-900 cursor-pointer hover:bg-primary-400 transition-colors shadow-sm">
                  <Edit2 className="w-5 h-5" />
              </button>
           </div>
        </div>
        
        <div className="flex flex-col gap-4">
           <Input label="Nome" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="flex-1"></div>
        
        <Button onClick={handleSave} disabled={loading}>{loading ? 'Salvando...' : 'Salvar Alterações'}</Button>
      </main>
    </div>
  );
};

// ... Achievements, FAQ, and WhatsNew components remain largely static or mock-based for this scope as they don't necessarily need DB storage for MVP
export const Achievements: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen pb-24">
       <Header title="Pontuação e Conquistas" onBack={() => navigate('/profile')} />
       
       <main className="p-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center">
             <p className="text-slate-500 dark:text-slate-400 text-sm">Sua Pontuação Total</p>
             <h1 className="text-5xl font-extrabold text-primary my-2">1.250</h1>
             <p className="text-xs text-slate-400">Continue cuidando bem do seu pet!</p>
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Suas Conquistas</h2>
          <div className="grid grid-cols-3 gap-4">
             {ACHIEVEMENTS.map(ach => (
                <div key={ach.id} className={`flex flex-col items-center p-3 rounded-lg text-center ${ach.unlocked ? 'bg-white dark:bg-dark-card shadow-sm border border-zinc-100 dark:border-zinc-800' : 'bg-slate-100 dark:bg-zinc-800/50 opacity-60'}`}>
                   <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-2 ${ach.unlocked ? 'bg-primary/20 text-primary-700 dark:text-primary' : 'bg-slate-200 dark:bg-zinc-700 text-slate-400'}`}>
                      {getAchievementIcon(ach.icon)}
                   </div>
                   <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight mb-1">{ach.title}</p>
                   <p className="text-[10px] text-slate-400">+{ach.points} pts</p>
                </div>
             ))}
          </div>
       </main>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen">
       <Header title="Perguntas Frequentes" onBack={() => navigate('/profile')} />
       
       <div className="px-4 py-2">
         <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input type="text" placeholder="Buscar nas perguntas..." className="w-full h-12 pl-12 pr-4 rounded-full bg-white dark:bg-dark-card border-none shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary outline-none" />
         </div>
       </div>

       <main className="p-4 pt-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 mt-2">Conta e Perfis</h3>
          <div className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800">
             {FAQ_ITEMS.map((item, i) => (
                <details key={i} className="group border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                   <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-slate-900 dark:text-white">
                      {item.question}
                      <ChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180" />
                   </summary>
                   <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400 animate-in slide-in-from-top-2">
                      {item.answer}
                   </div>
                </details>
             ))}
          </div>
       </main>
    </div>
  );
};

export const WhatsNew: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen">
       <Header title="Novidades" onBack={() => navigate('/profile')} />
       
       <main className="p-4 flex flex-col gap-4">
          {UPDATES.map((update, i) => (
             <div key={i} className={`bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex gap-4 ${i > 1 ? 'opacity-70' : ''}`}>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 
                  ${update.type === 'feature' ? 'bg-primary/20 text-primary-700 dark:text-primary' : 
                    update.type === 'improvement' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    update.type === 'announcement' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                   {getUpdateIcon(update.type)}
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-slate-900 dark:text-white">{update.title}</h3>
                   <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{update.description}</p>
                   <p className="text-xs text-slate-400 mt-2">{update.date}</p>
                </div>
             </div>
          ))}
       </main>
    </div>
  );
};
