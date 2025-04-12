# Documento de Análise de Requisitos

**Produto:** Gestor Fácil de Assinaturas (Nome Provisório)
**Versão:** 1.1 (Inclui Versão Web)
**Data:** 12 de Abril de 2025

**Histórico de Revisões:**
| Versão | Data        | Autor       | Alterações                                                  |
| :----- | :---------- | :---------- | :---------------------------------------------------------- |
| 1.1    | 12/04/2025 | IA (Gemini) | Adição de requisitos para a Versão Web. Ajustes gerais.     |
| 1.0    | 12/04/2025 | IA (Gemini) | Criação inicial baseada na descrição do produto (Mobile). |

**Índice:**
1. Introdução
2. Descrição Geral
3. Requisitos Específicos
    3.1 Requisitos Funcionais
    3.2 Requisitos de Interface Externa
    3.3 Requisitos Não Funcionais
    3.4 Requisitos de Dados
4. Apêndices (Opcional)

---

## 1. Introdução

### 1.1 Propósito
Este documento define os requisitos funcionais e não funcionais para a plataforma **"Gestor Fácil de Assinaturas"**, compreendendo um aplicativo móvel (iOS e Android) e uma versão web. Seu objetivo é fornecer uma descrição clara e completa do que o sistema deve fazer, servindo como guia para as equipes de design, desenvolvimento e testes.

### 1.2 Escopo
O sistema permitirá aos usuários cadastrar, rastrear, categorizar e gerenciar suas assinaturas e contas recorrentes através de interfaces móveis e web. Incluirá funcionalidades como cálculo de gastos totais, alertas de vencimento, relatórios, insights para otimização e, opcionalmente (para usuários Premium), conexão com contas bancárias via Open Finance para automação. O sistema *não* realizará pagamentos diretos de contas ou assinaturas, nem fornecerá consultoria de investimentos. O aplicativo móvel será desenvolvido para as plataformas iOS e Android, e a versão web será acessível através dos principais navegadores modernos.

### 1.3 Definições, Acrônimos e Abreviações
* **App:** Aplicativo móvel "Gestor Fácil de Assinaturas" (iOS/Android).
* **Web App:** Versão web do "Gestor Fácil de Assinaturas", acessível via navegador.
* **Plataforma:** O conjunto do App Móvel e do Web App.
* **Assinatura:** Serviço pago de forma recorrente (ex: Netflix, Spotify, Academia).
* **Conta Recorrente:** Despesa fixa ou variável paga periodicamente (ex: Aluguel, Água, Luz, Internet).
* **Usuário:** Pessoa que utiliza a plataforma.
* **Freemium:** Modelo de negócio onde funcionalidades básicas são gratuitas e avançadas são pagas.
* **Premium:** Versão paga da plataforma com funcionalidades completas.
* **Open Finance:** Sistema financeiro aberto regulamentado pelo Banco Central do Brasil.
* **API:** Interface de Programação de Aplicações.
* **LGPD:** Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
* **UI:** Interface do Usuário (User Interface).
* **UX:** Experiência do Usuário (User Experience).
* **Push Notification:** Alerta enviado pelo App Móvel para o dispositivo do usuário.
* **Browser Notification:** Alerta enviado pelo Web App através da API de notificações do navegador.
* **Backend:** Infraestrutura do servidor que suporta a plataforma.
* **Frontend:** Interface com a qual o usuário interage (App Móvel ou Web App).
* **Widget:** [Móvel] Componente de interface que exibe informações do app na tela inicial do dispositivo.
* **OAuth2:** Protocolo de autorização aberto.
* **WCAG:** Web Content Accessibility Guidelines.

### 1.4 Referências
* Documento de Descrição Consolidada do Produto v1.0
* Documentação oficial do Open Finance Brasil
* Texto da Lei Geral de Proteção de Dados (LGPD)
* Diretrizes de Interface Humana da Apple (iOS)
* Diretrizes de Design Material Design (Android)
* Web Content Accessibility Guidelines (WCAG) 2.1

### 1.5 Visão Geral
A Seção 2 fornece uma perspectiva geral do produto. A Seção 3 detalha os requisitos específicos, divididos em funcionais, de interface, não funcionais e de dados, considerando ambas as plataformas (móvel e web). Apêndices podem ser incluídos posteriormente.

---

## 2. Descrição Geral

### 2.1 Perspectiva do Produto
O "Gestor Fácil de Assinaturas" é uma plataforma multi-dispositivo (aplicativo móvel e aplicação web) focada em ajudar usuários a gerenciar suas finanças pessoais relacionadas a despesas recorrentes. Interage com sistemas externos através de APIs de Open Finance (com consentimento do usuário), serviços de notificação (Push e Browser) e sistemas de autenticação. O backend é compartilhado entre as interfaces móvel e web.

### 2.2 Funções do Produto (Resumo)
* Gerenciamento de Contas de Usuário (Cadastro, Login, Perfil)
* Cadastro e Gerenciamento de Assinaturas/Contas (Manual e Automático via Open Finance)
* Categorização de Despesas
* Visualização de Gastos e Dashboard
* Emissão de Alertas de Vencimento (Push/Browser/Email)
* Geração de Relatórios Financeiros
* Fornecimento de Insights e Sugestões de Otimização
* Gerenciamento de Acesso e Segurança
* Configurações da Plataforma

### 2.3 Características dos Usuários
* **Usuário Gratuito (Freemium):** Indivíduos que desejam controle básico sobre um número limitado de assinaturas/contas, com foco em alertas e visualização de gastos. Podem usar a plataforma primariamente no móvel ou web.
* **Usuário Premium:** Indivíduos ou famílias com múltiplas assinaturas/contas buscando controle detalhado, automação, relatórios avançados, personalização e insights. Utilizam tanto a interface móvel quanto a web para diferentes tarefas (ex: cadastro rápido no móvel, análise detalhada no web).
* Os usuários podem interagir com a plataforma através do aplicativo móvel ou da interface web, ou ambos, esperando uma experiência consistente.

### 2.4 Restrições Gerais
* A funcionalidade de conexão bancária depende da infraestrutura e APIs do Open Finance Brasil.
* O desenvolvimento móvel deve seguir as diretrizes da Apple App Store e Google Play Store.
* A versão web deve ser compatível com as versões mais recentes dos principais navegadores (Chrome, Firefox, Safari, Edge).
* Todas as funcionalidades devem cumprir rigorosamente a LGPD.
* O desempenho pode ser afetado pela qualidade da conexão de internet do usuário.

### 2.5 Suposições e Dependências
* Usuários móveis possuem smartphones compatíveis (iOS/Android versões a definir).
* Usuários web possuem navegadores compatíveis e acesso à internet.
* As APIs de Open Finance estarão disponíveis e funcionais.
* Os serviços de notificação (Push e Browser) e autenticação externa (Google/Apple) estarão operacionais.
* Os usuários fornecerão dados precisos (manualmente ou via consentimento).

---

## 3. Requisitos Específicos

### 3.1 Requisitos Funcionais

* **RF-PLAT-001:** [Plataforma] Todas as funcionalidades básicas e Premium (exceto as intrinsecamente específicas de uma interface, como widgets móveis) devem estar disponíveis e oferecer uma experiência consistente tanto no App Móvel quanto no Web App. Os dados devem ser sincronizados em tempo real (ou quase real) entre as plataformas.

* **RF-USR: Gerenciamento de Contas de Usuário**
    * **RF-USR-001:** [Plataforma] O sistema deve permitir que um novo usuário se cadastre fornecendo nome, e-mail e senha.
    * **RF-USR-002:** [Plataforma] O sistema deve validar a força da senha durante o cadastro.
    * **RF-USR-003:** [Plataforma] O sistema deve permitir o login de usuários existentes via e-mail e senha.
    * **RF-USR-004:** [Plataforma] O sistema deve permitir login/cadastro via conta Google (OAuth2), com fluxos apropriados para móvel e web.
    * **RF-USR-005:** [Plataforma] O sistema deve permitir login/cadastro via conta Apple (Sign in with Apple), com fluxos apropriados para móvel e web.
    * **RF-USR-006:** [Plataforma] O sistema deve fornecer uma funcionalidade de "Esqueci minha senha" que envie um link de redefinição para o e-mail cadastrado.
    * **RF-USR-007:** [Plataforma] O sistema deve permitir ao usuário visualizar e editar seus dados de perfil (nome, e-mail, endereço, cep, cel, foto).
    * **RF-USR-008:** [Plataforma] O sistema deve permitir ao usuário alterar sua senha.
    * **RF-USR-009:** [Plataforma] O sistema deve permitir ao usuário excluir permanentemente sua conta e dados associados (conforme LGPD), a partir de qualquer interface.
    * **RF-USR-010:** [Plataforma] O sistema deve permitir ao usuário gerenciar sua assinatura Premium (visualizar status, data de renovação, acessar portal de cancelamento da app store/plataforma web).
    * **RF-USR-011:** [Web] O sistema deve gerenciar sessões de usuário seguras para a versão web (ex: usando cookies seguros).

* **RF-SUB: Gerenciamento de Assinaturas/Contas (Manual)**
    * **RF-SUB-001:** [Plataforma] O sistema deve permitir ao usuário cadastrar manualmente uma nova assinatura/conta informando: Nome do Serviço, Valor, Moeda (padrão BRL, selecionável para Premium), Ciclo de Pagamento (Mensal, Anual, etc.), Data do Próximo Vencimento/Cobrança, Categoria, Notas (opcional).
    * **RF-SUB-002:** [Plataforma] O sistema deve permitir ao usuário editar todos os campos de uma assinatura/conta cadastrada.
    * **RF-SUB-003:** [Plataforma] O sistema deve permitir ao usuário marcar um ciclo de pagamento como "Pago".
    * **RF-SUB-004:** [Plataforma] O sistema deve calcular automaticamente a próxima data de vencimento com base no ciclo e na última data informada/paga.
    * **RF-SUB-005:** [Plataforma] O sistema deve permitir ao usuário excluir uma assinatura/conta cadastrada.
    * **RF-SUB-006:** [Plataforma] O sistema deve limitar o número de assinaturas/contas ativas a [Definir Limite, ex: 10] para usuários gratuitos.
    * **RF-SUB-007:** [Plataforma] O sistema não deve impor limite no número de assinaturas/contas para usuários Premium.
    * **RF-SUB-008:** [Plataforma] O sistema deve permitir anexar um ícone/logo padrão ou personalizado à assinatura/conta.

* **RF-CAT: Categorização**
    * **RF-CAT-001:** [Plataforma] O sistema deve fornecer uma lista de categorias padrão pré-definidas.
    * **RF-CAT-002:** [Plataforma] O sistema deve permitir ao usuário criar, editar e excluir categorias personalizadas.
    * **RF-CAT-003:** [Plataforma] O sistema deve associar cada assinatura/conta a uma única categoria.

* **RF-DSH: Dashboard e Visualização**
    * **RF-DSH-001:** [Plataforma] O sistema deve exibir um dashboard principal com o valor total das assinaturas/contas a vencer no mês atual.
    * **RF-DSH-002:** [Plataforma] O sistema deve exibir uma lista das próximas N assinaturas/contas a vencer no dashboard.
    * **RF-DSH-003:** [Plataforma] O sistema deve fornecer uma tela/página de listagem de todas as assinaturas/contas, permitindo filtrar e ordenar.
    * **RF-DSH-004:** [Plataforma] O sistema deve exibir um calendário mensal destacando os dias com vencimentos.
    * **RF-DSH-005:** [Plataforma] O sistema deve exibir um histórico de pagamentos registrados.
    * **RF-DSH-006:** `[Premium]` [Plataforma] O sistema deve exibir um gráfico (ex: pizza) mostrando a distribuição dos gastos por categoria.
    * **RF-DSH-007:** `[Premium]` [Plataforma] O sistema deve exibir um gráfico (ex: linha) mostrando a evolução do gasto total mensal.

* **RF-ALR: Alertas e Notificações**
    * **RF-ALR-001:** [Plataforma] O sistema deve gerar alertas X dias antes da data de vencimento (X configurável globalmente para Free).
    * **RF-ALR-002:** [Plataforma] O sistema deve enviar os alertas via E-mail.
    * **RF-ALR-003:** [Móvel] O sistema deve enviar os alertas via Notificação Push, se permitido pelo usuário.
    * **RF-ALR-004:** [Web] O sistema deve solicitar permissão e enviar alertas via Notificação do Navegador, se permitido pelo usuário.
    * **RF-ALR-005:** `[Premium]` [Plataforma] O sistema deve permitir ao usuário configurar a antecedência do alerta individualmente por item.
    * **RF-ALR-006:** `[Premium]` [Plataforma] O sistema deve permitir ao usuário escolher o canal de notificação preferencial (Email, Push/Browser).
    * **RF-ALR-007:** `[Premium]` [Plataforma] O sistema deve alertar o usuário sobre detectados aumentos de preço.

* **RF-OFN: Conexão Bancária (`[Premium]` - Open Finance)**
    * **RF-OFN-001:** [Plataforma] O sistema deve apresentar a opção de conectar contas bancárias via Open Finance.
    * **RF-OFN-002:** [Plataforma] O sistema deve guiar o usuário pelo fluxo de consentimento seguro do Open Finance.
    * **RF-OFN-003:** [Backend] O sistema deve obter permissão explícita para acessar dados de transações.
    * **RF-OFN-004:** [Backend] O sistema deve importar periodicamente as transações das contas conectadas.
    * **RF-OFN-005:** [Backend] O sistema deve aplicar algoritmos para identificar transações recorrentes ("Modo Detetive").
    * **RF-OFN-006:** [Plataforma] O sistema deve apresentar as assinaturas/contas detectadas para o usuário confirmar.
    * **RF-OFN-007:** [Backend] O sistema deve, opcionalmente, tentar conciliar transações com pagamentos cadastrados.
    * **RF-OFN-008:** [Plataforma] O sistema deve permitir ao usuário visualizar e gerenciar (desconectar) contas conectadas.

* **RF-REP: Relatórios e Exportação (`[Premium]`)**
    * **RF-REP-001:** [Plataforma] O sistema deve gerar relatórios de gastos por categoria e período.
    * **RF-REP-002:** [Plataforma] O sistema deve gerar relatórios de comparação de gastos.
    * **RF-REP-003:** [Plataforma] O sistema deve permitir a exportação dos relatórios gerados em formato PDF.
    * **RF-REP-004:** [Plataforma] O sistema deve permitir a exportação da lista de itens e histórico em formato CSV.
    * **RF-REP-005:** [Web] A interface web pode oferecer visualizações de relatório mais interativas e detalhadas.
    * **RF-REP-006:** [Web] A exportação de dados (PDF/CSV) deve iniciar o download direto no navegador.

* **RF-OPT: Otimização e Insights (`[Premium]`)**
    * **RF-OPT-001:** [Plataforma] O sistema deve analisar e alertar sobre possíveis assinaturas duplicadas.
    * **RF-OPT-002:** [Plataforma] O sistema deve identificar oportunidades de economia com planos familiares (requer modo multiusuário).
    * **RF-OPT-003:** [Plataforma] O sistema deve sugerir o cancelamento de assinaturas com baixa utilização aparente (baseado em heurísticas ou dados futuros).
    * **RF-OPT-004:** [Plataforma] O sistema deve exibir links/informações para facilitar o cancelamento dos serviços.

* **RF-MUL: Gerenciamento Multiusuário (`[Premium]`)**
    * **RF-MUL-001:** [Plataforma] O sistema deve permitir que um usuário Premium convide outros usuários para compartilhar o acesso.
    * **RF-MUL-002:** [Plataforma] O proprietário deve poder definir permissões para usuários convidados.
    * **RF-MUL-003:** [Plataforma] Os usuários convidados devem poder acessar os dados compartilhados conforme suas permissões.

* **RF-WID: Widget (`[Premium]` - Móvel Apenas)**
    * **RF-WID-001:** [Móvel] O sistema deve fornecer um widget para a tela inicial (iOS/Android).
    * **RF-WID-002:** [Móvel] O widget deve exibir um resumo configurável (próximos vencimentos ou gasto total).

* **RF-CFG: Configurações Gerais**
    * **RF-CFG-001:** [Plataforma] O sistema deve permitir ao usuário escolher o tema da interface (Claro, Escuro, Padrão do Sistema).
    * **RF-CFG-002:** `[Premium]` [Plataforma] O sistema deve permitir ao usuário definir a moeda principal padrão.
    * **RF-CFG-003:** [Plataforma] O sistema deve permitir ao usuário configurar preferências de notificação (canais, habilitar/desabilitar globalmente).
    * **RF-CFG-004:** [Plataforma] O sistema deve exibir links para Termos de Uso, Política de Privacidade e Ajuda/FAQ.

### 3.2 Requisitos de Interface Externa
* **RIE-UI-001:** [Plataforma] A UI deve ser intuitiva, limpa e consistente entre telas e plataformas (móvel/web).
* **RIE-UI-002:** [Móvel] A navegação principal deve ser facilmente acessível (ex: barra de abas).
* **RIE-UI-003:** [Web] A navegação principal deve ser clara e persistente (ex: menu lateral ou superior).
* **RIE-UI-004:** [Móvel] O app deve seguir as diretrizes de design da plataforma nativa (iOS/Android).
* **RIE-UI-005:** [Web] O web app deve ser responsivo, adaptando-se a diferentes tamanhos de tela (desktop, tablet).
* **RIE-UI-006:** [Web] A interface web deve seguir boas práticas de acessibilidade (WCAG 2.1 Nível AA).
* **RIE-UI-007:** [Plataforma] O app deve suportar modo claro e escuro.
* **RIE-UI-008:** [Plataforma] Gráficos e visualizações de dados devem ser claros e legíveis.
* **RIE-HW-001:** [Móvel] O app deve utilizar sensores de biometria para login seguro, se habilitado.
* **RIE-SW-001:** [Plataforma] Interação com APIs de Open Finance Brasil.
* **RIE-SW-002:** [Móvel] Interação com serviços de Notificação Push (Firebase/APNS).
* **RIE-SW-003:** [Web] Interação com APIs de Notificação do Navegador.
* **RIE-SW-004:** [Plataforma] Interação com serviços de autenticação OAuth2 (Google, Apple).
* **RIE-COM-001:** [Plataforma] Toda comunicação entre frontend (móvel/web) e backend deve ocorrer sobre HTTPS/TLS 1.2+.

### 3.3 Requisitos Não Funcionais
* **RNF-DES-001 (Desempenho Móvel):** Cold start < 5s. Transição de telas < 1s. Atualização de dados < 2s.
* **RNF-DES-002 (Desempenho Web):** First Contentful Paint (FCP) < 3s (banda larga). Interação principal < 100ms.
* **RNF-DES-003 (Desempenho Backend):** Tempo médio de resposta da API < 500ms sob carga normal.
* **RNF-SEG-001 (Segurança):** Criptografia de dados sensíveis em repouso (dispositivo/banco de dados) e em trânsito.
* **RNF-SEG-002 (Segurança):** Conformidade com OWASP Top 10 (Web) e OWASP Mobile Top 10.
* **RNF-SEG-003 (Segurança):** Autenticação segura (senhas com hash forte, OAuth2 seguro, biometria segura).
* **RNF-SEG-004 (Segurança):** Conformidade estrita com normas de segurança do Open Finance.
* **RNF-SEG-005 (Segurança):** [Web] Proteção contra CSRF.
* **RNF-SEG-006 (Segurança):** [Web] Uso de cabeçalhos de segurança HTTP (CSP, HSTS, etc.).
* **RNF-SEG-007 (Segurança):** [Web] Gerenciamento seguro de cookies de sessão (HttpOnly, Secure, SameSite).
* **RNF-CNF-001 (Confiabilidade):** Disponibilidade da plataforma > 99.8%. Taxa de entrega de alertas > 99.5%. Backups regulares.
* **RNF-USA-001 (Usabilidade):** Facilidade de aprendizado e uso. Interface intuitiva. Mensagens de erro claras. Fluxos eficientes.
* **RNF-USA-002 (Usabilidade):** [Web] Conformidade com WCAG 2.1 Nível AA.
* **RNF-MAN-001 (Manutenibilidade):** Código modular, documentado, testável (cobertura de testes a definir). Uso de boas práticas de engenharia de software.
* **RNF-POR-001 (Portabilidade Móvel):** Compatibilidade com iOS [X.Y+] e Android [A.B+].
* **RNF-POR-002 (Portabilidade Web):** Compatibilidade com as 2 últimas versões estáveis de Chrome, Firefox, Safari, Edge.
* **RNF-SCA-001 (Escalabilidade):** A arquitetura do backend deve ser capaz de escalar horizontalmente para suportar aumento no número de usuários e dados.
* **RNF-LEG-001 (Legal):** Conformidade total com a LGPD.
* **RNF-LEG-002 (Legal):** Conformidade total com as normas do Open Finance Brasil.
* **RNF-LEG-003 (Legal):** Termos de Uso e Política de Privacidade claros e acessíveis.

### 3.4 Requisitos de Dados
* **RD-PER-001:** Dados do usuário e da aplicação devem ser armazenados de forma persistente e segura no backend. Dados podem ser cacheados localmente (móvel/web) para performance.
* **RD-PRI-001:** Tratamento de dados pessoais e financeiros com confidencialidade estrita (LGPD).
* **RD-PRI-002:** Anonimização/pseudonimização para análises agregadas.
* **RD-INT-001:** Garantia da integridade dos dados financeiros através de validações e consistência no banco de dados.
* **RD-RET-001:** Política clara de retenção e exclusão de dados conforme LGPD.
* **RD-SYN-001:** Os dados devem ser sincronizados consistentemente entre as interfaces móvel e web acessadas pelo mesmo usuário.

## 4. Apêndices (Opcional)
* (Esta seção pode incluir diagramas de caso de uso, modelos de dados preliminares, wireframes ou mockups de UI, etc.)

---