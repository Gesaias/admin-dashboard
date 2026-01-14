# Admin Dashboard - Backend API

Esta é a API do Admin Dashboard, construída com NestJS e Prisma.

## 🛠️ Tecnologias Principais

- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** PostgreSQL (via Docker)
- **Segurança:** Passport.js, JWT, Bcrypt
- **Validação:** Class-validator, Class-transformer

## 🚀 Como Iniciar

### 1. Instalar dependências
```bash
pnpm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz desta pasta baseando-se no `.env.example`.

### 3. Gerenciamento do Banco de Dados
O projeto utiliza scripts facilitados para interagir com o Prisma:

- **Preparar banco:**
  ```bash
  pnpm db:migrate
  pnpm db:generate
  pnpm db:seed
  ```

- **Visualizar dados (Interface Web):**
  ```bash
  pnpm db:studio
  ```

- **Resetar banco:**
  ```bash
  pnpm db:clean
  ```

### 4. Executar a aplicação

```bash
# Modo de desenvolvimento (watch mode)
pnpm start:dev

# Modo de produção
pnpm build
pnpm start:prod
```

## 📜 Endpoints Principais (Exemplos)

- `POST /auth/register` - Registro de novos usuários
- `POST /auth/login` - Autenticação
- `GET /users` - Listagem de usuários (Protegido)
- `GET /users/:id` - Detalhes do usuário
- `PUT /users/:id` - Atualização de usuário/senha
- `DELETE /users/:id` - Remoção de usuário

## 📂 Estrutura de Pastas

- `src/app`: Módulos da aplicação (Auth, Users, etc.)
- `src/generated`: Cliente Prisma gerado automaticamente.
- `src/services`: Serviços globais (Database, etc.)
- `prisma/`: Schema do banco de dados e seeders.
