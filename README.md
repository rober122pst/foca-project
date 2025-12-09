# Foca

Sistema de foco, produtividade e rotina pensado para quem luta diariamente contra distrações, procrastinação e disfunção executiva - especialmente indivíduos com TDAH.

O Foca não é “só mais um app de Pomodoro”. Ele é um **ecossistema completo** que combina gamificação, timer inteligente, rotinas flexíveis, bloqueio de distrações e uma camada social, tudo integrado, nada fragmentado.

_O projeto ainda está em desenvolvimento e em sua versão pré-alpha. Apresenta vários bugs e funcionalidades inacabadas._

## Visão geral

O Projeto Foca nasceu para resolver um problema real:  
**o cérebro TDAH funciona como uma Ferrari com freios de bicicleta.**  
Muita potência, pouca inibição.  
Muita criatividade, pouca capacidade de iniciar e manter o foco.

- Arquitetura: `client` — frontend React (Vite) com Tailwind; `server` — API Node/Express com Socket.IO, Prisma e PostgreSQL.
- Persistência: banco gerenciado com Prisma — o schema está em `server/prisma/schema.prisma`. Use `npx prisma db push` ou `npx prisma migrate dev` para sincronizar alterações e `npx prisma db seed` para dados iniciais.

- Funcionalidades principais:

  - **Gamificação dopaminérgica**
  - **Pomodoro com gerenciamento ambiental**
  - **Bloqueio automático de distrações**
  - **Rotinas adaptativas com IA**
  - **Ranking, conquistas e amigos**
  - **Calendário estilo Google com rrule**
  - **Sistema completo de tarefas, projetos, eventos e hábitos**

- Backend e tempo real: o servidor expõe rotas REST e endpoints para rotinas, tarefas, usuários e autenticação; usa Socket.IO para sincronizar timers e eventos em tempo real.
- Segurança: autenticação JWT com suporte a refresh tokens (modelo `refreshToken`), e rotas protegidas pelo middleware de autenticação.

- Público-alvo e objetivo: ajudar estudantes e profissionais a criar e manter hábitos de estudo/produção com suporte a sessões focadas (pomodoro), rotinas recorrentes e motivação por gamificação.

Veja as seções abaixo para detalhes de instalação, variáveis de ambiente, comandos Prisma e execução em desenvolvimento.

## Objetivo do Projeto

Criar um sistema integrado que:

1. Reduza a aversão ao início de tarefas (procrastinação).
2. Mantenha motivação através de recompensas rápidas e feedback imediato.
3. Diminua a sobrecarga cognitiva do planejamento.
4. Regule o ambiente para impedir distrações.
5. Transforme consistência em um ciclo prazeroso, não doloroso.

## Funcionalidades

### **🟣 Pomodoro & Foco**

- Iniciar, pausar, parar Pomodoro
- Selecionar tarefa vinculada ao Pomodoro
- Bloqueio de apps durante foco
- Notificações de fim de bloco
- Acompanhamento do ciclo completo

### **🟢 Tarefas, Projetos, Eventos e Hábitos**

Tipo da atividade segue padrão `rrule` (Google Calendar style):

| Tipo        | Como funciona                          |
| ----------- | -------------------------------------- |
| **task**    | Acontece 1 vez e tem prazo             |
| **event**   | Acontece 1 vez (festas, reuniões etc.) |
| **habit**   | Rotina recorrente infinita             |
| **project** | Rotina recorrente com data de fim      |

Ações disponíveis:

- Criar, editar, excluir
- Calendário integrado
- Checklist diário
- Geração automática com IA

### **🔵 Gamificação**

- XP e Level
- Conquistas
- Rank global e entre amigos
- Streak diário
- Perfis públicos

### **🟡 Social**

- Adicionar/amigos
- Chat
- Feed de atividades
- Turmas com CRUD completo
- Postagens e avisos para membros
- Agendamentos automáticos via Scheduler

### **⚙️ Sistema & Integrações**

- Login / SSO
- Bloqueador externo
- Serviço de IA
- Sistema de notificações

### **👤 Perfil**

- Nome, bio, foto e banner
- Tema visual
- Dashboard geral

### 📚 Sistema de Classes (Futuro)

- Um usuário poderá criar uma **Classe** (grupo fechado).
- A plataforma gerará um **código de acesso** exclusivo.
- Qualquer pessoa poderá entrar na classe usando esse código, alunos, colegas, funcionários ou amigos.
- O criador da classe (Owner/Admin) poderá:
  - postar tarefas, atividades ou eventos com prazo,
  - enviar lembretes automáticos para todos os membros,
  - acompanhar o progresso geral da turma,
  - criar desafios semanais ou metas coletivas.
- Sempre que uma nova atividade for publicada:
  - os membros receberão uma **notificação no celular**,
  - e poderão **adicionar a tarefa ao próprio calendário** com poucos toques (compatível com `rrule`).

### 🗂️ Painel de Projetos (Futuro)

Projetos poderão abrir um **painel completo de organização**, inspirado na experiência do Notion, para ajudar o usuário a estruturar e visualizar cada etapa do trabalho.

**O que será possível fazer:**

- Criar **subtarefas / passos** dentro do projeto
- Adicionar **notas**, **reflexões**, **ideias** e **rascunhos**
- Inserir **imagens**, anexos e referências
- Criar listas, blocos de texto e seções customizadas
- Organizar tudo de forma visual, intuitiva e flexível
- Sincronizar automaticamente com o progresso do projeto e suas repetições (`rrule`)

## Estrutura principal

- [client/](./client/) — frontend React (Vite).
- [server/](./server/) — backend Node/Express, Prisma, autenticação e lógica da aplicação.
- [LICENSE.md](./LICENSE.md) — licença.

## Tech stack

- Frontend: React, Vite, Tailwind CSS, rrule, lucide-react, React Query, Zustand
- Backend: Node.js, Express, SocketIO, Prisma, PostgreSQL
- Dev tools: ESLint, Prettier, Nodemon, Prisma

## Requisitos

- Node.js (24.7.0)
- PostgreSQL
- npm (11.5.1)

## Variáveis de ambiente

Crie um arquivo `.env` na pasta `server/` com as variáveis mínimas (exemplo):

```
DATABASE_URL="postgresql://USER:PASS@HOST:PORT/DATABASE?schema=public"
PORT=1987
JWT_SECRET=algum-segredo-forte
REFRESH_SECRET=outro-segredo-forte
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK=...
GEMINI_API_KEY=sua-api-key
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
FACEBOOK_CALLBACK=...
NODE_ENV="development"
```

Ajuste conforme suas integrações (Google, Facebook, etc.).

Crie um arquivo `.env` na pasta `client/` com as variáveis mínimas (exemplo):

```
VITE_TOKEN_COOKIE=token
VITE_REFRESH_TOKEN_COOKIE=refreshToken
VITE_API_URL=...
VITE_GOOGLE_AUTH_URI=.../auth/google
VITE_FACEBOOK_AUTH_URI=.../auth/facebook
```

## Banco de dados / Prisma

No diretório `server/` você pode usar os comandos Prisma abaixo.

- Empurrar o schema para o DB (sem criar migrations):

```powershell
cd server; npx prisma db push
```

- Criar uma migration local (apenas em desenvolvimento):

```powershell
cd server; npx prisma migrate dev --name init
```

- Rodar seed:

```powershell
cd server; npx prisma db seed
```

- Abrir Prisma Studio:

```powershell
cd server; npx prisma studio
```

Observação: o `schema.prisma` está em `server/prisma/schema.prisma`.

## Rodando em desenvolvimento

Abra dois terminais (um para API e outro para frontend).

- Iniciar servidor (API):

```powershell
cd server; npm install; npm run dev
```

- Iniciar cliente (frontend):

```powershell
cd client; npm install; npm run dev
```

O `client` usa Vite (`npm run dev`) e o `server` usa `nodemon` (`npm run dev`).

## Dicas de desenvolvimento

- Se você modificar o schema do Prisma, execute `npx prisma db push` ou `npx prisma migrate dev` conforme necessário. (apenas um ou outro)
- Use `npx prisma generate` depois de alterar o schema para atualizar o client (geralmente o CLI do migrate faz isso automaticamente).

## Recursos úteis

- Prisma: https://www.prisma.io/
- RRule: https://github.com/jakubroztocil/rrule
- Vite: https://vitejs.dev/

## Licença

[© 2025 Equipe Foca - Todos os direitos reservados](./LICENSE.md)

## Contato

- Repositório: https://github.com/rober122pst/foca-project
- Email: jrobertinhor.9@gmail.com
