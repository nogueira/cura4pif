
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, ChevronRight, Edit2, Cake, Scissors, Activity, Flag, Calendar, Share, ArrowLeft, Scale, User, TrendingUp, TrendingDown, Minus, PawPrint, ChevronDown, Trash2, Loader2, RefreshCw, Camera, Star } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { Header, Card, Button, Input } from '../components/UI';
import { supabase } from '../supabaseClient';
import { Cat, WeightRecord } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchCats();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
          const { data } = await supabase.from('profiles').select('name').eq('id', session.user.id).single();
          if (data && data.name) setUserName(data.name.split(' ')[0]);
      }
  }

  const fetchCats = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .eq('owner_id', session.user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      
      // Fetch latest weight records for trends
      const { data: weightData } = await supabase
        .from('weight_records')
        .select('cat_id, weight, date')
        .order('date', { ascending: false });

      // Map database fields (snake_case) to typescript interface (camelCase)
      const formattedCats = data.map((cat: any) => {
        // Find trend
        const catWeights = weightData?.filter((w: any) => w.cat_id === cat.id) || [];
        // Sort by date desc (just to be safe, though query did it)
        catWeights.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        
        if (catWeights.length >= 2) {
            const current = catWeights[0].weight;
            const previous = catWeights[1].weight;
            if (current > previous) trend = 'up';
            else if (current < previous) trend = 'down';
        }

        return {
            id: cat.id,
            name: cat.name,
            breed: cat.breed,
            birthDate: cat.birth_date,
            gender: cat.gender,
            neutered: cat.neutered,
            weight: cat.weight,
            goalWeight: cat.goal_weight,
            image: cat.image_url || 'https://placekitten.com/200/200',
            activityLevel: cat.activity_level,
            weightHistory: [],
            trend 
        };
      });

      setCats(formattedCats);
    } catch (error: any) {
      console.error('Error fetching cats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable' | undefined) => {
      if (trend === 'up') return <TrendingUp className="w-4 h-4 text-orange-500" />;
      if (trend === 'down') return <TrendingDown className="w-4 h-4 text-primary" />;
      return <Minus className="w-4 h-4 text-slate-400" />;
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen pb-24">
      {/* Modern Header */}
      <div className="pt-8 pb-6 px-6 bg-white dark:bg-dark-card rounded-b-[2.5rem] shadow-sm mb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex justify-between items-start mb-4">
              <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
                    {userName ? `Olá, ${userName}` : 'Bem-vindo(a)'} <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  </p>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Meus Gatos</h1>
              </div>
              <button 
                  onClick={() => navigate('/cats/new/edit')} 
                  className="bg-primary text-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-transform hover:bg-primary-400"
              >
                 <Plus className="w-6 h-6" />
              </button>
          </div>
          
          <div className="flex items-center justify-between">
             <div className="flex -space-x-3">
                 {cats.slice(0, 3).map(cat => (
                     <div key={cat.id} className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card bg-cover bg-center" style={{backgroundImage: `url('${cat.image}')`}}></div>
                 ))}
                 {cats.length > 3 && (
                     <div className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-slate-500">+{cats.length - 3}</div>
                 )}
             </div>
             <button onClick={fetchCats} className="text-xs font-bold text-primary flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                 <RefreshCw className="w-3 h-3" /> Atualizar
             </button>
          </div>
      </div>

      {/* Content */}
      <div className="px-5 flex flex-col gap-5">
        {cats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-32 h-32 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
               <PawPrint className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nenhum gatinho por aqui</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">Adicione seu primeiro gato para começar a acompanhar a saúde e o peso dele.</p>
            <Button className="w-auto px-8" onClick={() => navigate('/cats/new/edit')}>
               Cadastrar Agora
            </Button>
          </div>
        ) : (
          cats.map((cat) => (
            <div 
                key={cat.id} 
                onClick={() => navigate(`/cats/${cat.id}`)} 
                className="group relative bg-white dark:bg-dark-card rounded-[2rem] p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden active:scale-[0.98] transition-all duration-200"
            >
              {/* Decorative background element */}
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full opacity-50 blur-2xl group-hover:opacity-80 transition-opacity"></div>
              
              <div className="flex gap-5 relative z-10">
                 {/* Large Image on Left */}
                 <div className="w-28 h-28 shrink-0 rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shadow-inner relative">
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${cat.image}')` }}></div>
                    {/* Gender Badge */}
                    <div className={`absolute bottom-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm ${cat.gender === 'Macho' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                        {cat.gender === 'Macho' ? 'M' : 'F'}
                    </div>
                 </div>
                 
                 {/* Info Section */}
                 <div className="flex-1 flex flex-col justify-center py-1">
                    <div className="flex justify-between items-start mb-1">
                       <div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{cat.name}</h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{cat.breed || 'SRD'}</p>
                       </div>
                       <ChevronRight className="text-slate-300 dark:text-slate-600 w-5 h-5" />
                    </div>

                    <div className="mt-auto">
                       <div className="flex items-end gap-2 mb-3">
                          <div className="flex flex-col">
                             <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">Peso Atual</span>
                             <div className="flex items-center gap-1.5">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{cat.weight || '--'}</span>
                                <span className="text-sm font-medium text-slate-400">kg</span>
                                {cat.weight && <div className="ml-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md">{getTrendIcon(cat.trend)}</div>}
                             </div>
                          </div>
                          
                          {cat.goalWeight && (
                             <div className="flex flex-col items-end ml-auto">
                                <span className="text-[10px] text-slate-400 mb-0.5">Meta</span>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cat.goalWeight} kg</span>
                             </div>
                          )}
                       </div>

                       {/* Progress Bar for Goal */}
                       {cat.weight && cat.goalWeight && (
                          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden relative">
                             {/* Indicator Logic: 
                                 Visual representation relative to goal and slight buffer
                             */}
                             <div 
                                className="absolute left-0 top-0 bottom-0 bg-primary rounded-full" 
                                style={{ width: `${Math.min((cat.weight / Math.max(cat.weight, cat.goalWeight * 1.2)) * 100, 100)}%` }}
                             ></div>
                             
                             {/* Marker for Goal */}
                             <div 
                                className="absolute top-0 bottom-0 w-1 bg-slate-900 dark:bg-white z-10" 
                                style={{ left: `${Math.min((cat.goalWeight / Math.max(cat.weight, cat.goalWeight * 1.2)) * 100, 100)}%` }}
                             ></div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="text-center mt-8 pb-4 opacity-30">
        <PawPrint className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Cura4Pif</p>
      </div>
    </div>
  );
};

export const CatDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatDetail = async () => {
      if (!id) return;
      
      const { data: catData, error } = await supabase
        .from('cats')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      // Fetch weight history
      const { data: weightData } = await supabase
        .from('weight_records')
        .select('*')
        .eq('cat_id', id)
        .order('date', { ascending: true });

      setCat({
        id: catData.id,
        name: catData.name,
        breed: catData.breed,
        birthDate: catData.birth_date,
        gender: catData.gender,
        neutered: catData.neutered,
        weight: catData.weight,
        goalWeight: catData.goal_weight,
        image: catData.image_url || 'https://placekitten.com/300/300',
        activityLevel: catData.activity_level,
        weightHistory: weightData || []
      });
      setLoading(false);
    };

    fetchCatDetail();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!cat) return <div>Cat not found</div>;

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen pb-24">
      <Header 
        title="Detalhes do Gato" 
        onBack={() => navigate('/home')}
        rightElement={
          <button 
            onClick={() => navigate(`/cats/${id}/edit`)}
            className="text-primary font-bold"
          >
            Editar
          </button>
        } 
      />

      <main className="flex flex-col gap-6 p-4">
        <div className="flex flex-col items-center gap-4">
           <div className="relative">
             <div className="h-64 w-64 rounded-2xl bg-cover bg-center border-4 border-white dark:border-zinc-800 shadow-md" style={{ backgroundImage: `url('${cat.image}')` }}></div>
             <div className="absolute bottom-0 right-0 p-2 bg-green-100 dark:bg-primary/20 rounded-full border-4 border-white dark:border-dark-bg text-primary-700 dark:text-primary">
                <PawPrint className="w-6 h-6" />
             </div>
           </div>
           <div className="text-center">
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{cat.name}</h2>
             <p className="text-slate-500 dark:text-slate-400">{cat.breed}</p>
           </div>
        </div>

        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 px-1">Informações Gerais</h3>
          <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800">
            {[
              { label: 'Data de Nascimento', value: cat.birthDate ? new Date(cat.birthDate).toLocaleDateString('pt-BR') : 'N/A', icon: <Cake className="w-5 h-5" /> },
              { label: 'Gênero', value: cat.gender, icon: <User className="w-5 h-5" /> },
              { label: 'Castrado', value: cat.neutered ? 'Sim' : 'Não', icon: <Scissors className="w-5 h-5" /> },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 ${i !== 2 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}>
                <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-primary/10 flex items-center justify-center text-primary-700 dark:text-primary">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 px-1">Saúde</h3>
          <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800">
            {[
              { label: 'Peso Atual', value: cat.weight ? `${cat.weight} kg` : 'N/A', icon: <Scale className="w-5 h-5" /> },
              { label: 'Meta de Peso', value: cat.goalWeight ? `${cat.goalWeight} kg` : 'N/A', icon: <Flag className="w-5 h-5" /> },
              { label: 'Nível de Atividade', value: cat.activityLevel, icon: <Activity className="w-5 h-5" /> },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 ${i !== 2 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}>
                <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-primary/10 flex items-center justify-center text-primary-700 dark:text-primary">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-3 px-1">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">Histórico de Peso</h3>
             <button onClick={() => navigate(`/cats/${id}/progress`)} className="text-sm font-bold text-primary hover:text-primary-600">Ver Completo</button>
          </div>
          <Card className="h-48 flex items-center justify-center" onClick={() => navigate(`/cats/${id}/progress`)}>
             {cat.weightHistory.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cat.weightHistory}>
                     <defs>
                      <linearGradient id="colorWeightPreview" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#13ec5b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#13ec5b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="weight" stroke="#13ec5b" strokeWidth={3} fillOpacity={1} fill="url(#colorWeightPreview)" />
                  </AreaChart>
               </ResponsiveContainer>
             ) : (
               <p className="text-slate-400 text-sm">Sem histórico de peso ainda</p>
             )}
          </Card>
        </section>

      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white dark:from-dark-bg via-white/80 dark:via-dark-bg/80 to-transparent">
        <Button onClick={() => navigate(`/cats/${id}/weight/add`)} className="bg-zinc-900 text-white dark:bg-primary dark:text-slate-900 gap-2">
           <Plus className="w-5 h-5" /> Adicionar Pesagem
        </Button>
      </div>
    </div>
  );
};

export const EditCat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [loading, setLoading] = useState(false);
  
  // Refs for inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSqlHelp, setShowSqlHelp] = useState<{show: boolean, type: 'storage' | 'db', message: string}>({ show: false, type: 'db', message: '' });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    gender: 'Macho',
    birthDate: '',
    neutered: false,
    weight: '',
    goalWeight: '',
    activityLevel: 'Médio',
    image_url: ''
  });

  useEffect(() => {
    if (!isNew && id) {
      const fetchCat = async () => {
        const { data } = await supabase.from('cats').select('*').eq('id', id).single();
        if (data) {
          setFormData({
            name: data.name,
            breed: data.breed || '',
            gender: data.gender || 'Macho',
            birthDate: data.birth_date || '',
            neutered: data.neutered || false,
            weight: data.weight?.toString() || '',
            goalWeight: data.goal_weight?.toString() || '',
            activityLevel: data.activity_level || 'Médio',
            image_url: data.image_url || ''
          });
          if (data.image_url) {
            setImagePreview(data.image_url);
          }
        }
      };
      fetchCat();
    }
  }, [id, isNew]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const openCamera = () => {
    if (cameraInputRef.current) {
        cameraInputRef.current.click();
    }
  };

  const openGallery = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const getErrorMessage = (error: any) => {
      if (typeof error === 'string') return error;
      if (error?.message) return error.message;
      return JSON.stringify(error);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `cats/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cat-photos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        // Check for RLS error
        if (getErrorMessage(uploadError).includes('row-level security') || getErrorMessage(uploadError).includes('new row violates')) {
            throw new Error('RLS_STORAGE_ERROR');
        }
        throw uploadError;
      }

      const { data } = supabase.storage.from('cat-photos').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: any) {
      if (error.message === 'RLS_STORAGE_ERROR') {
          throw error;
      }
      console.error(error);
      return null;
    }
  };

  const saveCatData = async (imageUrl: string | null) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const cleanNumber = (val: any) => {
        if (!val) return null;
        const strVal = String(val);
        const normalized = strVal.replace(',', '.');
        const num = parseFloat(normalized);
        return isNaN(num) ? null : num;
      };

      const basePayload = {
        owner_id: session.user.id,
        name: formData.name.trim(),
        breed: formData.breed?.trim() || null,
        gender: formData.gender,
        birth_date: formData.birthDate || null,
        neutered: formData.neutered,
        weight: cleanNumber(formData.weight),
        goal_weight: cleanNumber(formData.goalWeight),
        activity_level: formData.activityLevel,
        image_url: imageUrl || formData.image_url
      };

      if (isNew) {
        // Only use random image if NO image was uploaded and NO image url existed
        const finalImage = basePayload.image_url || `https://placekitten.com/300/300?image=${Math.floor(Math.random() * 16)}`;
        const { error } = await supabase.from('cats').insert([{...basePayload, image_url: finalImage}]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('cats').update(basePayload).eq('id', id);
        if (error) throw error;
      }
  };

  const handleSave = async (ignoreImageError = false) => {
    if (!formData.name.trim()) {
      alert('Por favor, informe o nome do gato.');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Usuário não autenticado. Por favor, faça login novamente.');
        navigate('/login');
        return;
      }

      let uploadedUrl: string | null = null;
      
      // Try to upload image if selected and not ignoring errors
      if (imageFile && !ignoreImageError) {
        try {
            uploadedUrl = await uploadImage(imageFile);
        } catch (err: any) {
            if (err.message === 'RLS_STORAGE_ERROR') {
                setShowSqlHelp({ 
                    show: true, 
                    type: 'storage', 
                    message: 'Erro de permissão ao salvar a foto. O banco de dados (Storage) bloqueou o upload.' 
                });
                setLoading(false);
                return; // Stop here to show modal
            }
        }
      }

      // Save cat data
      try {
          await saveCatData(uploadedUrl);
          navigate('/home');
      } catch (err: any) {
          const msg = getErrorMessage(err);
          if (msg.includes('row-level security') || msg.includes('new row violates')) {
              setShowSqlHelp({ 
                  show: true, 
                  type: 'db', 
                  message: 'Erro de permissão ao salvar os dados. O banco de dados bloqueou a gravação.' 
              });
          } else {
              alert(`Erro ao salvar: ${msg}`);
          }
      }

    } catch (error: any) {
      console.error('General Error:', error);
      alert(`Erro inesperado: ${getErrorMessage(error)}`);
    } finally {
      if (!showSqlHelp.show) {
          setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este gato?')) return;
    try {
      const { error } = await supabase.from('cats').delete().eq('id', id);
      if (error) throw error;
      navigate('/home');
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir.');
    }
  };

  // SQL Fix snippets
  const SQL_FIX_STORAGE = `
-- Habilitar Storage Público (Run in SQL Editor)
insert into storage.buckets (id, name, public) 
values ('cat-photos', 'cat-photos', true)
on conflict (id) do update set public = true;

-- Remover políticas antigas para evitar conflito
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Allow Uploads" on storage.objects;
drop policy if exists "Allow Updates" on storage.objects;

-- Criar Políticas de Acesso
create policy "Public Access" on storage.objects for select using ( bucket_id = 'cat-photos' );
create policy "Allow Uploads" on storage.objects for insert with check ( bucket_id = 'cat-photos' );
create policy "Allow Updates" on storage.objects for update with check ( bucket_id = 'cat-photos' );
`;

  const SQL_FIX_DB = `
-- Remover políticas antigas para evitar conflito
drop policy if exists "Users can manage their own cats" on public.cats;
drop policy if exists "Users can manage their own weight records" on public.weight_records;
drop policy if exists "Users can manage their own reminders" on public.reminders;
drop policy if exists "Users can manage their own profile" on public.profiles;

-- Habilitar RLS nas tabelas
alter table public.cats enable row level security;
alter table public.weight_records enable row level security;
alter table public.reminders enable row level security;
alter table public.profiles enable row level security;

-- Criar Políticas de Acesso (CRUD total para o dono)
create policy "Users can manage their own cats" on public.cats for all using (auth.uid() = owner_id);
create policy "Users can manage their own weight records" on public.weight_records for all using (auth.uid() = (select owner_id from public.cats where id = cat_id));
create policy "Users can manage their own reminders" on public.reminders for all using (auth.uid() = owner_id);
create policy "Users can manage their own profile" on public.profiles for all using (auth.uid() = id);

-- Criar tabela keep_alive se não existir
create table if not exists public.keep_alive (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.keep_alive enable row level security;
drop policy if exists "Allow anonymous insert keep_alive" on public.keep_alive;
create policy "Allow anonymous insert keep_alive" on public.keep_alive for insert with check (true);
create policy "Allow anonymous read keep_alive" on public.keep_alive for select using (true);
`;

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen flex flex-col relative">
      
      {/* Help Modal for RLS Errors */}
      {showSqlHelp.show && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold text-red-600 mb-2">Erro de Permissão (RLS)</h3>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">{showSqlHelp.message}</p>
                  
                  <div className="mb-4">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Solução:</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Copie o código SQL abaixo e execute no <strong>Editor SQL</strong> do seu painel Supabase.
                      </p>
                      <div className="bg-slate-100 dark:bg-black p-3 rounded-lg relative group">
                          <pre className="text-xs text-slate-800 dark:text-green-400 whitespace-pre-wrap break-all font-mono">
                              {showSqlHelp.type === 'storage' ? SQL_FIX_STORAGE : SQL_FIX_DB}
                          </pre>
                          <button 
                            onClick={() => navigator.clipboard.writeText(showSqlHelp.type === 'storage' ? SQL_FIX_STORAGE : SQL_FIX_DB)}
                            className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                              Copiar
                          </button>
                      </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={() => { setShowSqlHelp({...showSqlHelp, show: false}); setLoading(false); }}>
                          Fechar
                      </Button>
                      
                      {showSqlHelp.type === 'storage' && (
                          <Button variant="secondary" onClick={() => { setShowSqlHelp({...showSqlHelp, show: false}); handleSave(true); }}>
                              Ignorar e Continuar
                          </Button>
                      )}
                  </div>
              </div>
          </div>
      )}

      <Header title={isNew ? "Novo Gato" : "Editar Gato"} onBack={() => navigate(-1)} />
      <main className="flex-1 p-6 flex flex-col gap-6">
         <div className="flex flex-col items-center gap-3">
            <div className="h-32 w-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center relative overflow-hidden border-2 border-dashed border-zinc-400 dark:border-zinc-600">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <PawPrint className="w-12 h-12 text-slate-400" />
                )}
                
                {/* Visual Overlay to indicate camera is active */}
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                   <Camera className="text-white drop-shadow-md w-8 h-8 opacity-80" />
                </div>
            </div>
            
            <div className="flex gap-4 w-full justify-center">
                <button 
                    type="button"
                    onClick={openCamera}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary-700 dark:text-primary rounded-lg text-sm font-bold active:scale-95 transition-transform"
                >
                    <Camera className="w-4 h-4" /> Câmera
                </button>
                <button 
                    type="button"
                    onClick={openGallery}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold active:scale-95 transition-transform"
                >
                    <Share className="w-4 h-4" /> Galeria
                </button>
            </div>

            {/* Hidden Inputs */}
            <input 
              type="file" 
              ref={cameraInputRef} 
              className="hidden" 
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
         </div>

         <div className="flex flex-col gap-4">
            <Input label="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Miau" />
            <Input label="Raça" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} placeholder="Ex: Siamês" />
            
            <div className="grid grid-cols-2 gap-4">
               <label className="flex flex-col w-full">
                  <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">Gênero</p>
                  <div className="flex w-full items-center rounded-xl bg-white dark:bg-dark-card border border-zinc-200 dark:border-zinc-700 overflow-hidden h-14 px-4 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                     <select 
                        className="w-full bg-transparent text-slate-900 dark:text-white outline-none" 
                        value={formData.gender}
                        onChange={e => setFormData({...formData, gender: e.target.value})}
                     >
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                     </select>
                  </div>
               </label>
               <Input label="Nascimento" type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input label="Peso (kg)" type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="0.0" />
                <Input label="Meta (kg)" type="number" step="0.1" value={formData.goalWeight} onChange={e => setFormData({...formData, goalWeight: e.target.value})} placeholder="0.0" />
            </div>

            <div className="flex items-center gap-3 p-4 bg-white dark:bg-dark-card rounded-xl border border-zinc-200 dark:border-zinc-700">
               <input 
                  type="checkbox" 
                  checked={formData.neutered} 
                  onChange={e => setFormData({...formData, neutered: e.target.checked})}
                  className="w-5 h-5 accent-primary rounded cursor-pointer" 
               />
               <label className="text-slate-900 dark:text-white font-medium cursor-pointer">Castrado</label>
            </div>
         </div>

         <div className="flex-1"></div>
         
         <div className="flex flex-col gap-3">
            <Button onClick={() => handleSave(false)} disabled={loading}>{loading ? 'Salvando...' : 'Salvar Alterações'}</Button>
            {!isNew && (
              <button 
                  onClick={handleDelete} 
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl text-base font-bold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors active:scale-[0.98]"
              >
                  <Trash2 className="w-5 h-5" />
                  Excluir Gato
              </button>
            )}
         </div>
      </main>
    </div>
  );
};

export const WeightEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!weight || !id) return;
    setLoading(true);
    try {
        // Insert record
        const { error } = await supabase.from('weight_records').insert([{
            cat_id: id,
            weight: parseFloat(weight.replace(',', '.')),
            date: date,
            unit: 'kg'
        }]);
        if (error) throw error;

        // Update cat current weight
        await supabase.from('cats').update({ weight: parseFloat(weight.replace(',', '.')) }).eq('id', id);

        navigate(`/cats/${id}`);
    } catch (error) {
        console.error(error);
        alert('Erro ao salvar peso');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen flex flex-col">
       <Header title="Registrar Peso" onBack={() => navigate(-1)} />
       
       <main className="flex-1 p-6 flex flex-col items-center">
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl w-full flex flex-col items-center gap-6 shadow-sm">
             <div className="text-center">
                <p className="text-sm text-slate-500 mb-2">Peso em Kg</p>
                <input 
                    type="number" 
                    autoFocus
                    placeholder="0.00"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="text-6xl font-bold text-primary bg-transparent text-center w-full outline-none placeholder:text-slate-200" 
                />
             </div>

             <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-slate-500">Data do Registro</label>
                <input 
                    type="date" 
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none outline-none text-slate-900 dark:text-white" 
                />
             </div>
          </div>

          <div className="flex-1"></div>

          <Button className="mb-6" onClick={handleSave} disabled={loading || !weight}>
            {loading ? 'Salvando...' : 'Salvar Peso'}
          </Button>
       </main>
    </div>
  );
};

export const Progress: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cat, setCat] = useState<Cat | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const { data: catData } = await supabase.from('cats').select('*').eq('id', id).single();
        const { data: historyData } = await supabase.from('weight_records').select('*').eq('cat_id', id).order('date', {ascending: true});
        
        if (catData) setCat(catData);
        if (historyData) setHistory(historyData);
    };
    fetchData();
  }, [id]);

  if (!cat) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen flex flex-col">
       <header className="sticky top-0 z-20 flex items-center justify-between bg-gray-50/80 dark:bg-dark-bg/80 p-4 pb-2 backdrop-blur-sm">
          <button onClick={() => navigate(-1)} className="p-2"><ArrowLeft className="text-slate-900 dark:text-white"/></button>
          <h1 className="font-bold text-lg text-slate-900 dark:text-white">Progresso de {cat.name}</h1>
          <button className="p-2"><Share className="text-slate-900 dark:text-white" /></button>
       </header>

       <main className="flex-1">
          <div className="px-6 py-4">
             <p className="text-slate-900 dark:text-white font-medium">Histórico de Peso</p>
             <h2 className="text-4xl font-bold text-slate-900 dark:text-white mt-1">{cat.weight} kg</h2>
          </div>

          <div className="h-64 w-full px-2 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13ec5b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#13ec5b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#27272A', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#13ec5b' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#13ec5b" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
       </main>
    </div>
  );
};
