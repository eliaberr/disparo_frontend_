export type SelectedPreview = "A" | "B" | "C";

// Configuração das 3 mensagens (cores, labels, placeholders…)
// Adicionar ou remover uma mensagem = mexer só aqui.
export const MESSAGE_CONFIGS: {
  key: SelectedPreview;
  label: string;
  badge: string;
  placeholder: string;
  borderColor: string;       // classe Tailwind da borda do textarea
  focusColor: string;        // classe focus-within
  labelColor: string;        // cor do label
  previewBorder: string;     // borda do bloco de preview
  previewText: string;       // cor do título "Visualizar Prévia"
  tabActive: string;         // borda do botão ativo no seletor
  height: string;            // altura do textarea
}[] = [
  {
    key: "A",
    label: "Mensagem A (Principal)",
    badge: "*Obrigatória",
    placeholder: "Escreva a mensagem base aqui... Ex: [Olá|Oi] {nome}, tudo bem?",
    borderColor: "border-blue-700/60",
    focusColor: "focus-within:border-blue-500",
    labelColor: "text-blue-400",
    previewBorder: "border-blue-700",
    previewText: "text-blue-400",
    tabActive: "border-blue-700",
    height: "h-24",
  },
  {
    key: "B",
    label: "Mensagem B (Variação)",
    badge: "Opcional",
    placeholder: "Uma variação da abordagem. Ex: Fala {nome}, como vão as coisas?",
    borderColor: "border-emerald-700/50",
    focusColor: "focus-within:border-emerald-500",
    labelColor: "text-emerald-500",
    previewBorder: "border-emerald-700",
    previewText: "text-emerald-400",
    tabActive: "border-emerald-700",
    height: "h-20",
  },
  {
    key: "C",
    label: "Mensagem C (Variação)",
    badge: "Opcional",
    placeholder: "Terceira opção para o robô sortear.",
    borderColor: "border-purple-700/50",
    focusColor: "focus-within:border-purple-500",
    labelColor: "text-purple-400",
    previewBorder: "border-purple-700",
    previewText: "text-purple-400",
    tabActive: "border-purple-700",
    height: "h-20",
  },
];

// Itens exibidos na HelpModal.
// Adicionar uma seção de ajuda = só inserir um item aqui.
export const HELP_ITEMS: {
  title: string;
  content: string;          // texto simples (sem JSX)
  accentBorder?: string;    // classe Tailwind opcional de borda colorida
  icon?: string;            // nome do ícone (usado no componente)
}[] = [
  {
    title: "Nome da Campanha",
    content:
      'É apenas para o seu controle interno e não será enviado ao cliente. Use nomes claros como "Oferta Consignado - Lote 1".',
  },
  {
    title: "Contatos (Lista de Envio)",
    icon: "people",
    content:
      'Clique em "Inserir Contatos" para adicionar números manualmente ou importar um arquivo CSV com duas colunas (número, nome).',
  },
  {
    title: "As 3 Mensagens (Teste A/B/C)",
    accentBorder: "border-l-4 border-l-orange-500",
    content:
      "A Mensagem A é obrigatória. A B e a C são opcionais. Se você preencher mais de uma, o sistema irá sortear qual delas enviar para cada contato, evitando que o WhatsApp bloqueie o seu número por repetição (Spam).",
  },
  {
    title: "Variável de Nome",
    content:
      "Escreva {nome} no meio do texto. O sistema vai trocar isso automaticamente pelo nome do cliente cadastrado na sua lista de contatos.",
  },
  {
    title: "Variação de Palavras (Spintax)",
    content:
      "Use colchetes e barras verticais [A|B|C] para o robô sortear palavras.\n\nExemplo: \"[Olá|Oi|E aí] {nome}\" chegará como \"Olá João\", \"Oi Maria\" ou \"E aí José\".",
  },
  {
    title: "Simulação Humana",
    content:
      "Você não precisa fazer nada aqui. O robô já está programado para aplicar pausas aleatórias e mostrar \"Digitando...\" no celular do cliente antes de cada envio, simulando um humano real.",
  },
];