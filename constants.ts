import { Cat, User, Reminder, Achievement, FaqItem, UpdateItem } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Ana Souza',
  email: 'ana.souza@email.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPK6MfpQSuoeu_7vD4c2ales7dXl-ztrOi00TDxHRRl-7A9Vj-aB-UgUtiNzdhJZcAl4msicw-xJuYehnk8huFsfLBdaeLVpSUGiGEMXR6fIROP7LUbrwjO1b9tmnwNzN7E6nFDgafonws78fln7ah23lprXiL-f1j9c46VgFrpuMJZyEga8sjGjU0xFPv8ZJ3w_cPLDAzSWR1OB3yDOZ9Lz1kOsZT9YeDgaWZPeqvNDTF5RGkZB8x40MCPnjonvmiz1VpLzX8Cd5k'
};

export const MOCK_CATS: Cat[] = [
  {
    id: 'c1',
    name: 'Frajola',
    breed: 'SRD',
    birthDate: '2022-08-15',
    gender: 'Macho',
    neutered: true,
    weight: 5.2,
    goalWeight: 5.0,
    activityLevel: 'Médio',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuG5CucWn5L7oJ8GgBGg1XNinM8s4qrx94PSu_JK2vIpq0FutxDjippRImeSGbj-YZCmtjnfzmTK2mdW0a_yeaDoHVsv5qVnDVUDdviTmZUAB4pcEE7Qa2-fuGHF0gijzssZEq_35KuIfKGdm9Cr6IJePuc1M4ukvoo63lyhuViKpefg06D-c31u2jQ0CGbSHGxJ4sN1dSuMEaulZtwhyMmkpPrchds5IQPtfoqv2XXWMUK9y5kdofSiPOt63xzuNoG7E-RfPjpiMc',
    weightHistory: [
      { id: 'w1', weight: 5.0, date: '2024-06-01', unit: 'kg' },
      { id: 'w2', weight: 5.1, date: '2024-06-15', unit: 'kg' },
      { id: 'w3', weight: 5.2, date: '2024-07-01', unit: 'kg' },
    ]
  },
  {
    id: 'c2',
    name: 'Garfield',
    breed: 'Tabby',
    birthDate: '2020-05-20',
    gender: 'Macho',
    neutered: true,
    weight: 6.8,
    goalWeight: 6.0,
    activityLevel: 'Baixo',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPjiq-GgQmvA2FRCtg6cwrolcKAHDm35fDg5l2AX-j18TC1cWoLmNVxzoTVAKtpaJN5xeRzrbzK_KD-_gKKSeDfkHnNi6iXXsgosCC33Zvacr4tANc-Ew5_Nx6euwqsUWxI-xnTt3I_hcAAOWb2lnH-LHszklxdp-2fxnrvxVMeNylpqd7f4VSoMEgxm3U1OnLXpLvFZZjFpVFYUPO2ADKVdHBYbArP8PAoYuSafWyDSeTLldulA9vMPWBc_w0irjU3B-vItL9ovvg',
    weightHistory: [
      { id: 'w4', weight: 7.0, date: '2024-05-01', unit: 'kg' },
      { id: 'w5', weight: 6.9, date: '2024-06-01', unit: 'kg' },
      { id: 'w6', weight: 6.8, date: '2024-07-01', unit: 'kg' },
    ]
  },
  {
    id: 'c3',
    name: 'Miau',
    breed: 'Siamês',
    birthDate: '2022-05-15',
    gender: 'Macho',
    neutered: true,
    weight: 5.2,
    goalWeight: 4.8,
    activityLevel: 'Médio',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDueuh56bm5_XSiwWm-vCg_PfCqOYyNuovHWCMkzyu7P4wk3nwckY4B5AV0k1W7VLj5JW_b5ZwXv2-tQBiNFSF7I3LA6qFiG1kVebu96f_FbxfOFaeaWsfaHmA-qudyae7KGfp_GjpXXlBA5kKonLSM-kduoje2sgRYXZ9IiqQGkuH-1wLbeV3sxgheB58pkqh5DsDEy7WKMFdjFGvNpUhhrmoWIIMSiRlN7mV372kcJAq0QzlTr6SA6J6DqeK3lYRav8afvv0qqFGN',
    weightHistory: [
      { id: 'w7', weight: 4.8, date: '2024-04-01', unit: 'kg' },
      { id: 'w8', weight: 5.0, date: '2024-05-15', unit: 'kg' },
      { id: 'w9', weight: 5.2, date: '2024-07-23', unit: 'kg' },
    ]
  }
];

export const MOCK_REMINDERS: Reminder[] = [
  { id: 'r1', title: 'Vacina Antirrábica', date: '2024-07-15', type: 'vaccine', petId: 'c3', completed: false },
  { id: 'r2', title: 'Consulta de Rotina', date: '2024-07-28', type: 'consultation', petId: 'c1', completed: false },
  { id: 'r3', title: 'Remédio de Verme', date: '2024-06-02', type: 'medication', petId: 'c3', completed: true },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'Primeiro Registro', description: 'Registre o peso do seu gato pela primeira vez.', points: 25, icon: 'add_chart', unlocked: true },
  { id: 'a2', title: 'Vacinação em Dia', description: 'Complete o ciclo de vacinação anual.', points: 100, icon: 'vaccines', unlocked: true },
  { id: 'a3', title: 'Consistência', description: 'Registre o peso por 4 semanas consecutivas.', points: 50, icon: 'event_repeat', unlocked: true },
  { id: 'a4', title: 'Amigo Fiel', description: 'Complete 1 ano de uso do app.', points: 150, icon: 'pets', unlocked: false },
  { id: 'a5', title: 'Meta Atingida', description: 'Seu gato atingiu o peso ideal.', points: 200, icon: 'monitor_weight', unlocked: false },
  { id: 'a6', title: '???', description: 'Conquista secreta.', points: 100, icon: 'lock', unlocked: false },
];

export const FAQ_ITEMS: FaqItem[] = [
  { question: 'Como criar uma conta?', answer: 'Para criar uma conta, basta baixar o aplicativo, abri-lo e seguir as instruções na tela para se registrar com seu e-mail ou conta de rede social.' },
  { question: 'Como adicionar vários gatos a uma conta?', answer: 'No seu perfil, toque em "Adicionar Pet" e preencha as informações do seu novo gato. Você pode adicionar quantos gatos quiser à sua conta.' },
  { question: 'Como compartilhar o acesso com outro usuário?', answer: 'Vá para as configurações do perfil do gato que deseja compartilhar e selecione a opção "Compartilhar Acesso". Insira o e-mail do usuário e ele receberá um convite.' },
  { question: 'Como editar perfis de gatos ou de usuários?', answer: 'Para editar um perfil, navegue até a página do perfil desejado (seu ou de um de seus gatos) e toque no ícone de edição para fazer as alterações.' },
  { question: 'Como registrar o peso de um gato?', answer: 'Na tela principal, selecione o perfil do seu gato e toque no botão "Registrar Peso". Insira o valor e a data para adicionar um novo registro.' },
  { question: 'Como interpretar o gráfico de peso?', answer: 'O gráfico mostra a evolução do peso do seu gato ao longo do tempo. Uma linha ascendente indica ganho de peso, enquanto uma descendente indica perda. A meta de peso é mostrada como uma linha pontilhada.' },
  { question: 'Como funcionam os lembretes?', answer: 'Você pode configurar lembretes nas configurações para ser notificado sobre os dias de pesagem. Isso ajuda a manter a consistência no monitoramento do seu pet.' },
];

export const UPDATES: UpdateItem[] = [
  { title: 'Gráficos de Evolução de Peso', date: '15 de Outubro de 2024', description: 'Agora você pode visualizar o progresso de peso do seu gato em gráficos interativos. Acompanhe a evolução de forma fácil e visual!', type: 'feature' },
  { title: 'Sincronização Mais Rápida', date: '01 de Outubro de 2024', description: 'Melhoramos a velocidade de sincronização dos dados para que todos na família vejam as informações atualizadas em tempo real.', type: 'improvement' },
  { title: 'Dicas de Nutrição Felina', date: '20 de Setembro de 2024', description: 'Em breve, teremos uma nova seção com dicas de especialistas em nutrição para ajudar a manter seu gato saudável. Fique de olho!', type: 'announcement' },
  { title: 'Correção de Bugs Menores', date: '12 de Setembro de 2024', description: 'Lançamos uma atualização para corrigir pequenos bugs e melhorar a estabilidade geral do aplicativo.', type: 'fix' },
];