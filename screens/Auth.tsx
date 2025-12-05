
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, Database, Key, Globe } from 'lucide-react';
import { Button, Input } from '../components/UI';
import { supabase, configureSupabase } from '../supabaseClient';

export const SetupScreen: React.FC = () => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !key) return;
    setLoading(true);
    configureSupabase(url, key);
  };

  const handleClear = () => {
    localStorage.removeItem('sb_url');
    localStorage.removeItem('sb_key');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col p-6 items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary-700 dark:text-primary">
            <Database className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurar Supabase</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Para acessar o aplicativo, insira as credenciais do seu projeto Supabase.
          </p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input 
            label="URL do Projeto" 
            placeholder="https://seu-projeto.supabase.co" 
            icon={<Globe className="h-5 w-5" />}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          
          <Input 
            label="Chave Pública (Anon Key)" 
            placeholder="eyJhbGciOiJIUzI1NiIsInR5..." 
            icon={<Key className="h-5 w-5" />}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
            <p className="font-semibold mb-1">Onde encontrar?</p>
            <p>No painel do Supabase, vá em: <br/>Settings &gt; API &gt; Project URL & Anon Public Key</p>
          </div>
          
          <Button type="submit" className="mt-2" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Conectar'}
          </Button>
          
          <button 
            type="button" 
            onClick={handleClear}
            className="w-full py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
          >
            Limpar Configuração
          </button>
        </form>
      </div>
    </div>
  );
};

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/home');
      }
    };
    checkSession();
  }, [navigate]);
  
  return (
    <div className="relative flex h-screen w-full flex-col bg-gray-50 dark:bg-dark-bg overflow-hidden">
      <main className="flex-1 flex flex-col pt-8 pb-4">
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full items-center">
          <div className="flex flex-col items-center min-w-full snap-center px-6 gap-6">
            <div className="w-full max-w-sm aspect-square bg-cover bg-center rounded-2xl shadow-xl" 
                 style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUoidcx-Pu4vne4o3-p97DOhwTJwznFxA24bsk90Zd-VUTiBbaIRCzL8Rjb3Xpkf-kI7oSWoU8e1J1dheQ6CiZvCGfjhwbiN-mKe28KBt2giRvZ0sNCVWbfuaKauPVuZ6kC8Qh2iX0Z4BhpGJtc0W4ZvBekJDLpX4Qe0NsoRBj-cFhlsB-J_j4jZVMdHjKFsEGIbaz_3OB7UvZzurVNqPdDK_PsT465mqdixwBUUp8gr0NirCaj9qg6C_ohcF-odDxvEnRaqhsC5KP")' }}></div>
            <div className="text-center max-w-xs">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Bem-vindo ao Cura4Pif</h2>
              <p className="text-slate-600 dark:text-slate-400">Acompanhe o peso do seu gato para uma vida mais saudável.</p>
            </div>
          </div>
          <div className="flex flex-col items-center min-w-full snap-center px-6 gap-6">
            <div className="w-full max-w-sm aspect-square bg-cover bg-center rounded-2xl shadow-xl" 
                 style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDsfGlMuPxIfxNZIM3JmosPOl4_V3bBbRFPrjsZ84qi1NpXMolkeVfiOJj9n9mFTLg7zF0M9EBAvLrr2SyFd2UfpF0P1mclC1udVrEyiDfodvulRWdptYuNO8uL_uhWiSQ1TN7_WVFsrqIe8fiUT4GdQkwU9ZkWoh3xJ2GIN6w9AfOgQRIgI75jBZIFMxmbHAY0Iki5E_VKer_N8u0wxqC7_2ze747R1a3ap-BjtJEtIenWO0Dx3rCfGovUmOdCyYXgo5zgqumBGby8")' }}></div>
            <div className="text-center max-w-xs">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Seus gatos em um só lugar</h2>
              <p className="text-slate-600 dark:text-slate-400">Monitore múltiplos gatos e compartilhe com sua família.</p>
            </div>
          </div>
          <div className="flex flex-col items-center min-w-full snap-center px-6 gap-6">
            <div className="w-full max-w-sm aspect-square bg-cover bg-center rounded-2xl shadow-xl" 
                 style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvbQV98PXueCmxhkvxY0Mxs4eCsXOmhkhfKcEc8gvkKJnnY2pkzTpNYS4zxYrgueHzhBqx5sr57cFOXg72H-Q2cz0xIFsSrROTLQ4_tgeC-CP0dDZ4IbVOgnej69SN1I4fH12Z71ygOxmizsbKeSKelT_JHuFchO0KbH7aWevMGM9F4flgKjftDV_1xGqLHfFW-QiZtJHV07gFId8xmireWVd05OY4aAjKyUgyL6Mr2ADAgy4xrI1-CmYCme474nuFXDnGznLShmOJ")' }}></div>
            <div className="text-center max-w-xs">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Visualize o progresso</h2>
              <p className="text-slate-600 dark:text-slate-400">Veja gráficos, defina metas e receba lembretes importantes.</p>
            </div>
          </div>
        </div>
        
        <div className="flex w-full justify-center gap-2 py-6">
          <div className="h-2 w-2 rounded-full bg-primary"></div>
          <div className="h-2 w-2 rounded-full bg-primary/20"></div>
          <div className="h-2 w-2 rounded-full bg-primary/20"></div>
        </div>
      </main>
      
      <footer className="w-full p-6 pb-10 bg-white dark:bg-dark-card rounded-t-3xl shadow-lg">
        <Button onClick={() => navigate('/login')}>Começar</Button>
        <p className="text-center text-sm text-slate-500 mt-4 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Já tenho uma conta</p>
      </footer>
    </div>
  );
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill email if previously saved
  useEffect(() => {
    const savedEmail = localStorage.getItem('cura4pif_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/home');
      }
    };
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Save email for next time
        localStorage.setItem('cura4pif_email', email);
        navigate('/home');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: email.split('@')[0], // Nome padrão temporário
            },
          },
        });
        if (error) throw error;
        
        localStorage.setItem('cura4pif_email', email);
        
        // Se a confirmação de e-mail estiver desativada no Supabase, data.session existirá
        if (data.session) {
            navigate('/home');
        } else {
            // Tentativa de login automático (fallback)
            // Se o signUp não retornou sessão, tentamos logar explicitamente
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (loginData.session) {
                navigate('/home');
            } else {
                // Se falhar, é porque o backend realmente exige confirmação de email
                alert('Cadastro realizado! Por favor, verifique se a opção "Confirm Email" está desativada no painel do Supabase, ou verifique seu e-mail.');
                setAuthMode('login');
            }
        }
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col p-6">
      <div className="w-full h-48 rounded-2xl bg-cover bg-center mb-6 shadow-sm" 
           style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvHc2_ChTc0FZWv27XiOGYx5n3mo9lY8C9FtPorZWN36uMY-gDeCsBfbOfEYMiZrXAFbg--n-T1jrAKo8zgcEsDL2JrJoFpNePyFTNk3fQMYPrtPqTTWMCG264hkboG62a0mvsZ2gnoflrdqK3_X5FAZJj-gFCk4gKZbwmSoHh7EmNzemtK1YmWzIUvNCR-l-AbZZWpXsROp_8CNJT5HnPoRU-0JNPkxmLJ2MxJQrfdeb45emexiBAMXJbMmY6jxayDmPfgBpEHLVp")' }}>
      </div>
      
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bem-vindo(a) de volta!</h1>
        <p className="text-slate-500 dark:text-slate-400">Faça login para cuidar do seu pet.</p>
      </div>

      <div className="bg-zinc-200 dark:bg-zinc-800 p-1 rounded-xl flex mb-6">
        <button 
          onClick={() => setAuthMode('login')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === 'login' ? 'bg-white dark:bg-zinc-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>
          Login
        </button>
        <button 
          onClick={() => setAuthMode('register')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === 'register' ? 'bg-white dark:bg-zinc-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>
          Cadastrar
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleAuth} className="flex flex-col gap-4">
        <Input 
          label="Email" 
          placeholder="seuemail@exemplo.com" 
          type="email" 
          required
          icon={<Mail className="h-5 w-5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <label className="flex flex-col w-full relative">
          <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">Senha</p>
          <div className="flex w-full items-center rounded-xl bg-white dark:bg-dark-card border border-zinc-200 dark:border-zinc-700 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
            <div className="pl-4 text-slate-400">
              <Lock className="h-5 w-5" />
            </div>
            <input 
              className="flex-1 h-14 w-full bg-transparent px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-slate-400 hover:text-slate-600">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </label>
        
        <Button type="submit" className="mt-2" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (authMode === 'login' ? 'Entrar' : 'Cadastrar')}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-400 mt-8">v0.91</p>
    </div>
  );
};
