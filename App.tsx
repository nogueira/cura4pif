
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Onboarding, Login, SetupScreen } from './screens/Auth';
import { Home, CatDetail, WeightEntry, Progress, EditCat } from './screens/CatFeature';
import { RemindersList, NewRecord, ReminderCalendar } from './screens/HealthFeature';
import { Profile, Achievements, FAQ, WhatsNew, EditProfile } from './screens/UserFeature';
import { BottomNav } from './components/UI';
import { isSupabaseConfigured, supabase } from './supabaseClient';

// Componente invisível para manter o banco ativo
const KeepAliveHeartbeat: React.FC = () => {
  useEffect(() => {
    const performHeartbeat = async () => {
      try {
        // Verificar última gravação
        const { data, error } = await supabase
          .from('keep_alive')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1);

        // Se a tabela não existir, o erro será capturado e ignorado (usuário deve rodar o SQL fix)
        if (error && error.code !== 'PGRST116') return;

        const lastPing = data?.[0]?.created_at;
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        // Se não houver registro ou for mais antigo que 3 dias, insere novo
        if (!lastPing || new Date(lastPing) < threeDaysAgo) {
          await supabase.from('keep_alive').insert({});
          console.log('Heartbeat: Database kept alive.');
        }
      } catch (err) {
        // Falha silenciosa para não atrapalhar o usuário
        console.warn('Heartbeat skipped (table might be missing).');
      }
    };

    performHeartbeat();
  }, []);

  return null;
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  // Hide bottom nav on specific screens if needed, but for now we keep it on main tabs
  const showBottomNav = ['/home', '/reminders', '/achievements', '/profile'].includes(location.pathname);

  return (
    <>
      <Outlet />
      {showBottomNav && <BottomNav />}
    </>
  );
};

export default function App() {
  const [isConfigured, setIsConfigured] = React.useState(isSupabaseConfigured());

  if (!isConfigured) {
    return <SetupScreen />;
  }

  return (
    <HashRouter>
      <KeepAliveHeartbeat />
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/reminders" element={<RemindersList />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/cats/:id" element={<CatDetail />} />
        <Route path="/cats/:id/edit" element={<EditCat />} />
        <Route path="/cats/:id/weight/add" element={<WeightEntry />} />
        <Route path="/cats/:id/progress" element={<Progress />} />
        
        <Route path="/records/new" element={<NewRecord />} />
        <Route path="/reminders/calendar" element={<ReminderCalendar />} />
        
        <Route path="/faq" element={<FAQ />} />
        <Route path="/updates" element={<WhatsNew />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </Routes>
    </HashRouter>
  );
}
