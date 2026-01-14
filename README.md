# Admin Dashboard - Full Stack Project

Este projeto consiste em um dashboard administrativo completo, com um backend robusto em NestJS e um frontend moderno em Next.js. O sistema oferece autenticação JWT, gestão de usuários e produtos, além de visualizações gráficas e relatórios.

## 🚀 Tecnologias

**Backend:**
- **NestJS**: Framework Node.js progressivo para aplicações escaláveis.
- **Prisma ORM**: ORM moderno para Node.js e TypeScript.
- **PostgreSQL**: Banco de dados relacional robusto.
- **JWT Authentication**: Segurança no tráfego de dados e controle de acesso.
- **Bcrypt**: Hashing de senhas para segurança.
- **Docker**: Containerização do banco de dados.

**Frontend:**
- **Next.js 14/15 (App Router)**: Framework React para produção.
- **TailwindCSS**: Estilização baseada em utilitários.
- **Radix UI & Shadcn/ui**: Componentes de interface acessíveis e customizáveis.
- **Lucide React**: Biblioteca de ícones moderna e leve.
- **Recharts**: Biblioteca de gráficos para visualização de dados.
- **jsPDF**: Geração de documentos PDF no lado do cliente.
- **Axios & React Hook Form**: Gestão de requisições e formulários.
- **Zod**: Validação de esquemas e tipos.

## 📦 Funcionalidades

- ✅ **Autenticação JWT**: Fluxo completo de login e registro com roles (Admin/User).
- ✅ **CRUD de Usuários**: Gestão completa de usuários do sistema.
- ✅ **CRUD de Produtos**: Gestão de catálogo com categorização.
- ✅ **Dashboard Inteligente**: Gráficos dinâmicos com Recharts para acompanhamento de dados.
- ✅ **Filtros e Busca**: Sistema de pesquisa avançada em tabelas.
- ✅ **Geração de PDF**: Exportação de relatórios em formato PDF.
- ✅ **Design Premium**: Interface responsiva, com suporte a Dark/Light mode e estética moderna.

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

1. [Node.js](https://nodejs.org/) (versão 20 ou superior)
2. [PNPM](https://pnpm.io/installation)
3. [Docker & Docker Compose](https://www.docker.com/)

---

## 🛠️ Instalação e Configuração

### 1. Clonar o repositório e instalar dependências

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd admin-dashboard

# Instale todas as dependências (root e workspaces)
pnpm install
```

### 2. Configuração do Banco de Dados (Docker)

O projeto utiliza Docker para rodar o PostgreSQL de forma isolada.

```bash
cd shared/db
docker-compose up -d
```

### 3. Configuração do Backend

Navegue até a pasta do backend e configure as variáveis de ambiente:

```bash
cd ../../backend

# Copie o arquivo de exemplo
cp .env.example .env

# O padrão para o Docker local configurado é:
# DATABASE_URL="postgresql://admin:admin123@localhost:5432/dashboard_db?schema=public"
```

### 4. Scripts de Banco de Dados (Prisma)

Dentro da pasta `backend`, você tem acesso aos seguintes comandos de banco de dados:

| Comando | Descrição |
| :--- | :--- |
| `pnpm db:migrate` | Cria e aplica novas migrações ao banco de dados. |
| `pnpm db:generate` | Gera o cliente do Prisma para uso no código. |
| `pnpm db:seed` | Popula o banco com dados iniciais (Admin padrão, etc). |
| `pnpm db:studio` | Abre uma interface gráfica (GUI) para visualizar o banco. |
| `pnpm db:clean` | Reseta o banco de dados (apaga tudo e reaplica migrações). |
| `pnpm db:pull` | Sincroniza o schema do Prisma com um banco existente. |
| `pnpm db:push` | Sincroniza o banco com o schema sem criar migrações. |

---

## 🏃 Como Rodar

Você pode rodar ambos os projetos a partir da raiz do repositório:

**Terminal 1 (Backend):**
```bash
pnpm start:backend
```

**Terminal 2 (Frontend):**
```bash
pnpm start:frontend
```

---

## 🔑 Credenciais Padrão (Seed)

Após executar `pnpm db:seed`, use as seguintes credenciais para o primeiro acesso:

- **E-mail:** `admin@admin.com`
- **Senha:** `password123`

---

## 📂 Estrutura do Projeto

- `/backend`: API NestJS com Prisma e autenticação.
- `/frontend`: Interface Next.js com Tailwind e Shadcn/ui.
- `/shared`: Infraestrutura e recursos compartilhados (Docker DB).
