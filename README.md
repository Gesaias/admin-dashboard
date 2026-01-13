# Admin Dashboard - Full Stack Project

Este projeto consiste em um dashboard administrativo completo, com um backend em NestJS e um frontend em Next.js.

## 🚀 Tecnologias Utilizadas

- **Backend:** NestJS, Prisma, PostgreSQL, JWT, bcrypt.
- **Frontend:** Next.js (App Router), TailwindCSS, Radix UI, Lucide React.
- **Gerenciador de Pacotes:** PNPM (Workspaces).

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

1. [Node.js](https://nodejs.org/) (versão 20 ou superior recomendada)
2. [PNPM](https://pnpm.io/installation)
3. [Docker & Docker Compose](https://www.docker.com/) (para o banco de dados)

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

O projeto utiliza Docker para rodar o PostgreSQL.

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

# Ajuste as variáveis no .env (se necessário)
# O padrão para o Docker local é:
# DATABASE_URL="postgresql://admin:admin123@localhost:5432/dashboard_db?schema=public"
```

Agora, prepare o banco de dados com o Prisma:

```bash
# Gere o cliente do Prisma
pnpm db:generate

# Rode as migrações para criar as tabelas
pnpm db:migrate

# (Opcional) Popule o banco com dados iniciais (vínculo de e-mail/senha padrão)
pnpm db:seed
```

---

## 🏃 Como Rodar

Você pode rodar ambos os projetos a partir da raiz do repositório usando os scripts configurados:

### Rodar tudo simultaneamente
Recomenda-se abrir dois terminais:

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

Se você executou o comando `pnpm db:seed`, terá o seguinte acesso inicial:

- **Login:** `admin@admin.com` ou `Administrator`
- **Senha:** `password123`

---

## 📂 Estrutura do Projeto

- `/backend`: API construída com NestJS.
- `/frontend`: Interface construída com Next.js.
- `/shared`: Recursos compartilhados (atualmente contém o Docker do DB).
