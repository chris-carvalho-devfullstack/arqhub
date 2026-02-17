import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env.local
dotenv.config({ path: './.env.local' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const projects = [
  {
    title: "Casa Horizonte Infinito",
    slug: "casa-horizonte-infinito",
    category: "Residencial",
    location: "Fazenda Boa Vista, SP",
    completion_year: 2025,
    area_sqm: 850,
    status: "Concluído",
    cover_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2560&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2560&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2560&auto=format&fit=crop"
    ],
    seo_title: "Casa de Luxo na Fazenda Boa Vista | Ruth Medeiros Carvalho",
    seo_description: "Projeto residencial premiado com integração total à natureza, uso de madeira Cumaru e concreto aparente. Uma obra-prima da arquitetura contemporânea.",
    content: "Concebida para diluir as fronteiras entre interior e exterior, a Casa Horizonte utiliza vãos livres de 12 metros..."
  },
  {
    title: "Edifício Corporativo Nexus",
    slug: "edificio-nexus-faria-lima",
    category: "Comercial",
    location: "Faria Lima, SP",
    completion_year: 2024,
    area_sqm: 4500,
    status: "Em Obra",
    cover_image: "https://images.unsplash.com/photo-1486406140926-c627a92ad1ab?q=80&w=2560&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2560&auto=format&fit=crop"
    ],
    seo_title: "Arquitetura Corporativa de Alto Padrão em SP | Nexus",
    seo_description: "Edifício sustentável com certificação LEED Platinum. Fachada ventilada e automação predial de última geração.",
    content: "O desafio era criar um ícone na avenida mais movimentada do país sem sacrificar o conforto térmico..."
  },
  {
    title: "Loft Industrial Jardins",
    slug: "loft-industrial-jardins",
    category: "Interiores",
    location: "Jardins, SP",
    completion_year: 2023,
    area_sqm: 120,
    status: "Concluído",
    cover_image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2560&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2560&auto=format&fit=crop"
    ],
    seo_title: "Reforma de Loft nos Jardins | Design de Interiores",
    seo_description: "Transformação de apartamento antigo em loft estilo industrial chique, mantendo a estrutura original de concreto.",
    content: "A curadoria de mobiliário brasileiro assinado dialoga com as paredes descascadas propositalmente..."
  },
  {
    title: "Parque Urbano da Luz",
    slug: "parque-urbano-da-luz",
    category: "Urbanismo",
    location: "Centro, SP",
    completion_year: 2026,
    area_sqm: 15000,
    status: "Concurso",
    cover_image: "https://images.unsplash.com/photo-1496564203457-11bb12075d90?q=80&w=2560&auto=format&fit=crop",
    gallery_images: [],
    seo_title: "Projeto de Revitalização Urbana | Parque da Luz",
    seo_description: "Proposta vencedora para revitalização do centro, criando pulmões verdes e áreas de convivência segura.",
    content: "O urbanismo tático foi a chave para reintegrar a população ao espaço público..."
  }
];

async function seed() {
  console.log('🌱 Iniciando o plantio dos projetos...');
  
  // Limpa projetos antigos (opcional - comente se não quiser apagar)
  // await supabase.from('projects').delete().neq('id', 0);

  const { data, error } = await supabase
    .from('projects')
    .upsert(projects, { onConflict: 'slug' })
    .select();

  if (error) {
    console.error('❌ Erro ao inserir:', error);
  } else {
    console.log(`✅ Sucesso! ${data.length} projetos premium inseridos.`);
  }
}

seed();