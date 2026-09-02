# 🛍️ MyShop - E-commerce Fullstack

[![Node.js](https://img.shields.io/badge/Node-24.x-339933?logo=node.js)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-000000?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-336791?logo=postgresql)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)
[![Status](https://img.shields.io/badge/Status-Em%20desenvolvimento-yellow)](#status-do-projeto)

---

## 📋 Visão Geral

**MyShop** é uma aplicação de **e-commerce fullstack** em desenvolvimento, pensada para praticar arquitetura de API, persistência relacional, autenticação e fluxo de pedidos em um contexto realista de loja online.

O projeto já contempla autenticação com JWT, validações no backend, cadastro e login, gestão de catálogo, pedidos e reset de senha. A estrutura está organizada para evoluir de forma incremental, mantendo boa separação entre camadas e facilitando testes automatizados.

**Objetivo do projeto**: construir uma base sólida de portfólio com **Next.js 16**, **PostgreSQL**, **Docker**, **JWT**, **Zod** e boas práticas de backend, mantendo foco em funcionalidade real e clareza de implementação.

---

## 🚀 Destaques Técnicos

| **Área**           | **Tecnologia**          | **Detalhes**                                            |
| ------------------ | ----------------------- | ------------------------------------------------------- |
| **Backend**        | Next.js 16 + Node.js 24 | API REST com autenticação JWT                           |
| **Frontend**       | React 19 + Next.js      | UI moderna com CSS Modules                              |
| **Banco de Dados** | PostgreSQL 16           | Tabelas relacionais e migrations automáticas            |
| **Autenticação**   | JWT + bcrypt + Zod      | Login, registro, reset de senha e validação de payloads |
| **Email**          | Nodemailer + Gmail      | Notificações de login e reset de senha                  |
| **Rate Limiting**  | Upstash Redis           | Proteção contra brute force (10 req/10s)                |
| **Infraestrutura** | Docker Compose          | PostgreSQL isolado, desenvolvimento reprodutível        |
| **Deploy**         | Vercel                  | Build e deploy automáticos via GitHub                   |
| **Qualidade**      | ESLint + Prettier       | Code style automático, hooks de pré-commit              |
| **Commits**        | Commitizen              | Conventional Commits e padronização de histórico        |
| **Testes**         | Jest + fetch            | Testes de integração dos endpoints                      |

---

## 📦 Pré-Requisitos

- **Node.js** 24.x ou superior ([download](https://nodejs.org/))
- **Docker** + **Docker Compose** ([install](https://docs.docker.com/compose/install/))
- **Git** para clonar o repositório
- **Conta Gmail** ou SMTP disponível (para emails)

---

## ⚡ Quick Start (5 Minutos)

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/renandelfino013/myshop.git
cd myshop
```

### 2️⃣ Instale dependências

```bash
npm install
```

### 3️⃣ Configure variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DB=myshop
POSTGRES_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=sua-chave-secreta-muito-segura-aqui

# Email (Gmail com senha de app)
EMAIL_USE=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app-gmail

# URLs
FRONTEND_URL=http://localhost:3000

# Redis (Upstash - para rate limiting)
UPSTASH_REDIS_REST_URL=https://seu-url-upstash.upstash.io
UPSTASH_REDIS_REST_TOKEN=seu-token-upstash

# Ambiente
NODE_ENV=development
```

**📌 Nota sobre Email**: Criar senha de app Gmail:

1. Ative 2-step verification em [myaccount.google.com](https://myaccount.google.com)
2. Vá em "App passwords" e gere uma para "Mail"
3. Cole a senha de app no `.env`

### 4️⃣ Inicie o servidor

```bash
npm run dev
```

**Pronto!** A aplicação rodará em:

- 🌐 **Frontend**: http://localhost:3000
- 🔌 **API**: http://localhost:3000/api/v1/

---

## 📁 Estrutura do Projeto

```
myshop/
├── .env                     # Variáveis locais do ambiente
├── .env.example             # Modelo de variáveis de ambiente
├── .gitignore               # Arquivos ignorados pelo Git
├── .husky/                  # Hooks de pre-commit
├── .vscode/                 # Configuração local do editor
├── infra/                   # Infraestrutura e banco
│   ├── compose.yaml         # Docker Compose do PostgreSQL
│   ├── database/            # Conexão e utilitários do banco
│   ├── migrations/          # Migrations do PostgreSQL
│   └── scripts/             # Script de espera do Postgres
│
├── models/                  # Models / query layer do banco
│   ├── categorys/
│   ├── marcas/
│   ├── orders/
│   ├── products/
│   ├── status/
│   └── users/
│
├── pages/                   # Next.js + rotas da API
│   ├── api/v1/              # Endpoints REST da aplicação
│   │   ├── login.js         # Login
│   │   ├── register.js      # Cadastro
│   │   ├── forgot-password.js
│   │   ├── reset-password.js
│   │   ├── categorias.js
│   │   ├── marcas.js
│   │   ├── produtos.js
│   │   ├── pedidos.js
│   │   └── status/
│   ├── _app.js              # App shell do Next
│   ├── _document.js         # Document do Next
│   ├── index.jsx            # Home
│   ├── login.jsx            # Tela de login
│   ├── register.jsx         # Tela de cadastro
│   ├── forgot-password.jsx  # Tela de recuperação
│   ├── reset-password.jsx   # Tela de redefinição
│   └── ...
│
├── schemas/                 # Validação com Zod
│   ├── brands/
│   ├── categorys/
│   ├── login/
│   ├── orders/
│   ├── products/
│   ├── register/
│   ├── reset-password./
│   ├── validator/
│   ├── variables/
│   └── ...
│
├── services/                # Lógica de negócio e integração
│   ├── auth/
│   ├── brand/
│   ├── category/
│   ├── orders/
│   └── products/
│
├── utils/                   # Helpers, erros e utilitários
│   ├── errors/
│   ├── helper/
│   ├── mail/
│   ├── Regex/
│   ├── validators/
│   └── ...
│
├── styles/                  # CSS Modules e estilos globais
│   ├── globals.css
│   ├── Home.module.css
│   ├── login.module.css
│   ├── forgotpassword.module.css
│   ├── resetpassword.module.css
│   └── ...
│
├── test/                    # Testes automatizados
│   ├── hooks/
│   ├── orchestrator.js
│   └── v1/
│       ├── brands/
│       ├── categorys/
│       ├── login/
│       ├── orders/
│       ├── products/
│       ├── register/
│       ├── reset-password/
│       └── status/
│
├── public/                  # Arquivos públicos
│   └── assets/
│
├── .github/                 # Workflows e configs do GitHub
├── commitlint.config.mjs    # Commit lint config
├── eslint.config.mjs        # ESLint config
├── jest.config.cjs          # Jest config
├── jsconfig.json            # Alias do projeto
├── LICENSE                  # Licença do projeto
├── package.json             # Dependências e scripts
├── proxy.js                 # Proxy/ajustes de ambiente
├── README.md                # Documentação do projeto
└── ...
```

---

## ⚙️ Variáveis de Ambiente

| Variável                   | Tipo   | Descrição                 | Exemplo                                 |
| -------------------------- | ------ | ------------------------- | --------------------------------------- |
| `POSTGRES_USER`            | String | Usuário do PostgreSQL     | `postgres`                              |
| `POSTGRES_PASSWORD`        | String | Senha do PostgreSQL       | `postgres123`                           |
| `POSTGRES_DB`              | String | Nome do banco de dados    | `myshop`                                |
| `POSTGRES_HOST`            | String | Host do banco (produção)  | `localhost` \| `prod-db.railway.app`    |
| `DB_PORT`                  | Number | Porta do banco (dev/test) | `5432` \| `5433`                        |
| `JWT_SECRET`               | String | Chave para assinar JWTs   | `seu-secret-aleatorio`                  |
| `EMAIL_USE`                | String | Email do remetente        | `seu-email@gmail.com`                   |
| `EMAIL_PASS`               | String | Senha de app do Gmail     | `token-de-app`                          |
| `FRONTEND_URL`             | String | URL do frontend           | `http://localhost:3000`                 |
| `NODE_ENV`                 | String | Ambiente                  | `development` \| `production` \| `test` |
| `UPSTASH_REDIS_REST_URL`   | String | URL Redis Upstash         | `https://...upstash.io`                 |
| `UPSTASH_REDIS_REST_TOKEN` | String | Token Redis               | `token`                                 |

**📄 Criar arquivo `.env.example`** (versionado no Git):

```bash
# Copie este arquivo para .env e preencha os valores
cp .env.example .env
```

---

## 🎯 Funcionalidades Principais

### 🔐 Autenticação JWT

- **Login**: Email + senha → geração de JWT com expiração de 1 hora
- **Registro**: criação de usuário com hash de senha via bcrypt
- **Reset de Senha**: fluxo por email com chave temporária
- **Validação**: headers `x-user-id`, `x-user-email` e `x-user-role`
- **Roles**: `USER` e `ADMIN`
- **Política de senha atual**: mínimo de 8 caracteres, com pelo menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial

> A regra foi mantida com um equilíbrio entre boa UX e segurança. Senhas simples demais continuam sendo rejeitadas pelos schemas.

### 🏷️ Gerenciamento de Marcas

- ✅ **Criar** (apenas ADMIN)
- ✅ **Listar** (usuário autenticado)
- ✅ **Atualizar** (apenas ADMIN)
- ✅ **Deletar** (apenas ADMIN)

### 🗂️ Gerenciamento de Categorias

- ✅ **Criar** (apenas ADMIN)
- ✅ **Listar e consultar por ID ou nome** (usuário autenticado)
- ✅ **Atualizar** (apenas ADMIN)
- ✅ **Deletar** (apenas ADMIN)

### 📦 Gerenciamento de Produtos

- ✅ **Criar** (apenas ADMIN)
- ✅ **Listar** (usuário autenticado)
- ✅ **Detalhes por ID** (usuário autenticado)
- ✅ **Atualizar** (apenas ADMIN)
- ✅ **Deletar** (apenas ADMIN)
- ✅ Validações de nome, preço, estoque, marca e categoria
- ✅ Relacionamento com marcas e categorias

### 🛒 Pedidos e Itens

- ✅ **Criar pedido** com um ou mais itens
- ✅ **Listar pedidos** (USER vê seus, ADMIN vê todos)
- ✅ Consultar pedido por ID com controle de acesso
- ✅ Excluir pedido (USER próprio pedido, ADMIN qualquer pedido)
- ✅ Validação de IDs, quantidades e produtos duplicados
- ✅ Controle transacional de estoque
- ✅ Registro de preço unitário e total do pedido
- ⏳ Pagamentos, status e processamento assíncrono são escopo futuro

### 📧 Notificações por Email

- ✅ Login bem-sucedido
- ✅ Confirmação de registro
- ✅ Link de reset de senha
- ✅ Confirmação de pedido

### ⚡ Rate Limiting

- **10 requisições por 10 segundos** (via Upstash Redis)
- Proteção contra brute force

---

## 🔌 Endpoints da API

Todos os endpoints estão em `/api/v1/`

### **Autenticação**

#### Login

```http
POST /api/v1/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "senha": "Senha123!"
}
```

Exemplo de resposta válida:

```json
{
  "sucess": true,
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Register

```http
POST /api/v1/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "Senha123!"
}
```

Resposta esperada em caso de sucesso:

```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Reset de Senha

```
POST /api/v1/rede-password
Content-Type: application/json

{
  "email": "usuario@example.com"
}

✅ Response (200):
{
  "mensagem": "Email de reset enviado com sucesso"
}
```

---

### **Marcas** (Brands)

#### Listar Marcas

```
GET /api/v1/marcas
Authorization: Bearer {JWT}

✅ Response (200):
[
  { "id": 1, "nome": "Nike" },
  { "id": 2, "nome": "Adidas" }
]
```

#### Criar Marca (apenas ADMIN)

```
POST /api/v1/marcas
Authorization: Bearer {JWT}
Content-Type: application/json

{
  "nome": "Puma"
}

✅ Response (201):
{ "success": true, "message": "Brand sucessfully created" }

❌ Response (403):
{ "erro": "Permissão negada" }
```

#### Atualizar Marca (apenas ADMIN)

```
PATCH /api/v1/marcas
Authorization: Bearer {JWT}
Content-Type: application/json

{
  "id": 1,
  "nome": "Nike Updated"
}

✅ Response (200):
{ "id": 1, "nome": "Nike Updated" }
```

#### Deletar Marca (apenas ADMIN)

```
DELETE /api/v1/marcas?id=1
Authorization: Bearer {JWT}

✅ Response (200):
{ "mensagem": "Marca deletada com sucesso" }
```

---

### **Categorias**

#### Listar Categorias

```
GET /api/v1/categorias
Authorization: Bearer {JWT}

✅ Response (200):
[
  { "id": 1, "nome": "Calçados" }
]
```

#### Consultar Categoria

```
GET /api/v1/categorias?id=1
GET /api/v1/categorias?nome=Calçados
Authorization: Bearer {JWT}
```

#### Criar Categoria (apenas ADMIN)

```
POST /api/v1/categorias
Authorization: Bearer {JWT}
Content-Type: application/json

{ "nome": "Calçados" }

✅ Response (201):
{ "success": true, "message": "Category sucessfully created" }
```

### **Produtos**

> O schema atual valida nome, preço, estoque, categoria e marca antes de persistir o registro.

#### Listar Produtos

```
GET /api/v1/produtos
Authorization: Bearer {JWT}

✅ Response (200):
[
  {
    "id": 1,
    "nome": "Tênis Nike",
    "preco": "199.99",
    "estoque": 50,
    "descricao": "Produto para uso diário",
    "categoria_id": 1,
    "marca_id": 1
  }
]
```

#### Criar Produto (apenas ADMIN)

```
POST /api/v1/produtos
Authorization: Bearer {JWT}
Content-Type: application/json

{
  "name": "Tênis Novo",
  "price": 249.99,
  "stock": 30,
  "categoryId": 1,
  "markId": 1,
  "desc": "Produto para uso diário"
}

✅ Response (201):
{ "success": true, "message": "Product created successfully" }
```

#### Atualizar Produto (apenas ADMIN)

```
PUT /api/v1/produtos
Authorization: Bearer {JWT}
Content-Type: application/json

{
  "productid": 1,
  "newname": "Tênis Atualizado",
  "price": 299.99,
  "stock": 25,
  "categoryId": 1,
  "markId": 1,
  "desc": "Produto atualizado"
}

✅ Response (200):
{ "success": true, "message": "Product updated successfully" }
```

#### Deletar Produto (apenas ADMIN)

```
DELETE /api/v1/produtos?id=1
Authorization: Bearer {JWT}

✅ Response (200):
{ "success": true, "message": "Product deleted successfully" }
```

---

### **Pedidos**

#### Criar Pedido

```
POST /api/v1/pedidos
Authorization: Bearer {JWT}
Content-Type: application/json

{
  "items": [
    { "produto_id": 1, "quantidade": 2 },
    { "produto_id": 3, "quantidade": 1 }
  ]
}

✅ Response (201):
{
  "success": true,
  "message": "Order created successfully!",
  "order_id": 5
}
```

#### Listar Pedidos

````
GET /api/v1/pedidos
Authorization: Bearer {JWT}

✅ Response (200):
[
  {
    "usuario_nome": "João Silva",
    "produto_nome": "Tênis Novo",
    "produto_preco": "249.99",
    "pedido_id": 5,
    "data_pedido": "2026-08-18T10:30:00Z",
    "produto_id": 1,
    "quantidade": 2,
    "totalprice": "499.98"
  }
]

📌 USER: consulta apenas pedidos próprios
📌 ADMIN: consulta todos os pedidos

Cada item do pedido aparece como uma linha na resposta. O campo `totalprice` representa o total daquele item.

#### Consultar Pedido por ID

```http
GET /api/v1/pedidos?order_id=5
Authorization: Bearer {JWT}
````

Usuários comuns só podem consultar pedidos próprios. Administradores podem consultar qualquer pedido.

#### Excluir Pedido

```http
DELETE /api/v1/pedidos?order_id=5
Authorization: Bearer {JWT}
```

A exclusão devolve as quantidades ao estoque dentro de uma transação. Usuários comuns só excluem pedidos próprios; administradores podem excluir qualquer pedido.

```

---

### **Status**

#### Health Check

```

GET /api/v1/status

✅ Response (200):
{
"api": "ok",
"database": "ok",
"timestamp": "2026-08-18T10:30:00Z"
}

❌ Response (503):
{
"api": "ok",
"database": "error",
"erro": "Falha ao conectar no banco"
}

```

---

## 🗄️ Banco de Dados

### Modelo Entidade-Relacionamento (ER)

```

┌─────────────┐
│ usuarios │
├─────────────┤
│ id (PK) │
│ nome │
│ email (U) │
│ senha │
│ role │
└──────┬──────┘
│ 1:N
├────────────────────────────────────┐
│ │
▼ 1:N ▼
┌─────────────┐ ┌──────────────────┐
│ pedidos │ │ password_reset │
├─────────────┤ ├──────────────────┤
│ id (PK) │ │ usuarios_id (FK) │
│ usuario_id │◄────────────────► │ key │
│ data_pedido │ (FK) │ expirado │
│ status │ └──────────────────┘
└──────┬──────┘ 1:1 relacionamento
│
▼ 1:N
┌──────────────────┐
│ itens_pedido │
├──────────────────┤
│ id (PK) │
│ pedido_id (FK) │
│ produto_id (FK) │
│ quantidade │
│ preco_unitario │
└────┬─────────┬───┘
│ │
└─┐ ├─►┌─────────────┐
│ │ │ produtos │
│ │ ├─────────────┤
│ │ │ id (PK) │
│ │ │ nome │
│ │ │ preco │
│ │ │ estoque │
│ │ │ imagem │
│ │ │ categoria_id├───────┐
│ │ │ marca_id ├───────┼─► ┌──────────┐
│ │ └─────────────┘ │ │ marcas │
│ │ N:1 │ ├──────────┤
│ └──────────────────────────────► id (PK) │
│ │ │ nome │
└────────────────────────────────┼──►└──────────┘
N:1 │ 1:N
│
▼
┌────────────┐
│ categorias │
├────────────┤
│ id (PK) │
│ nome │
└────────────┘

````

### Tabelas Principais

| Tabela                  | Colunas                                                                                         | Relacionamentos                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **usuarios**            | id, nome, email (UNIQUE), senha, role                                                           | 1:N → pedidos, 1:1 → password_reset                |
| **marcas**              | id, nome                                                                                        | 1:N → produtos                                     |
| **categorias**          | id, nome                                                                                        | 1:N → produtos                                     |
| **produtos**            | id, nome, preco (NUMERIC 10,2), estoque (INTEGER), categoria_id, marca_id, descricao            | N:1 → categorias, N:1 → marcas, 1:N → itens_pedido |
| **pedidos**             | id, usuario_id, data_pedido (TIMESTAMP), total (NUMERIC 10,2)                                    | N:1 → usuarios, 1:N → itens_pedido                 |
| **itens_pedido**        | id, pedido_id, produto_id, quantidade, preco_unitario                                           | N:1 → pedidos, N:1 → produtos                      |
| **password_reset_keys** | usuarios_id, key, expirado                                                                      | 1:1 → usuarios                                     |

### Migrations

As migrations são criadas automaticamente no startup:

```bash
infra/migrations/
├── 1783382596747_create-users.js
├── 1783383779032_create-categorias.js
├── 1783384024337_create-marcas.js
├── 1783384261239_create-produtos.js
├── 1783385211643_create-pedidos.js
├── 1783385450148_create-itens-pedidos.js
└── 1783385813523_create-password-reset-keys.js
````

---

## 🔐 Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────────┐
│                    LOGIN FLOW                               │
└─────────────────────────────────────────────────────────────┘

1. Usuário insere email + senha
   └─► POST /api/v1/login

2. Servidor valida:
   ├─ Email existe?
   ├─ Senha correta (bcrypt.compare)?
   └─ Usuário ativo?

3. Gera JWT:
   ├─ Payload: { id, email, role }
   ├─ Secret: JWT_SECRET
   └─ Expiration: 1 hour

4. Envia resposta com token:
   └─► { id, email, role, token }

5. Envia email de notificação
   └─► Nodemailer → Gmail SMTP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────┐
│               PROTECTED ENDPOINT FLOW                        │
└─────────────────────────────────────────────────────────────┘

1. Cliente faz requisição autenticada:
   ├─ Header: x-user-id: "1"
   ├─ Header: x-user-email: "user@example.com"
   └─ Header: x-user-role: "USER"

2. Middleware valida JWT:
   ├─ Token válido?
   ├─ Não expirado?
   └─ Assinatura correta?

3. Verifica autorização (role):
   ├─ USER: Acesso limitado (pedidos próprios)
   └─ ADMIN: Acesso total (CRUD, relatórios)

4. Processa requisição + retorna resposta

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────┐
│              RESET PASSWORD FLOW                            │
└─────────────────────────────────────────────────────────────┘

1. Usuário clica "Esqueci a Senha"
   └─► POST /api/v1/rede-password { email }

2. Servidor:
   ├─ Valida email
   ├─ Gera chave reset aleatória (UUID)
   └─ Salva em password_reset_keys (expirado=false)

3. Envia email com link:
   └─► $FRONTEND_URL/reset-password?key={resetKey}

4. Usuário clica link + submete nova senha

5. Servidor:
   ├─ Valida chave (existe? não expirada?)
   ├─ Atualiza senha (bcrypt.hash)
   ├─ Marca expirado=true
   └─ Usuário faz login com nova senha

```

---

## 🚀 Deploy na Vercel

### 1️⃣ Configurar GitHub

Certifique-se de que seu repositório está em `https://github.com/renandelfino013/myshop`

### 2️⃣ Conectar Vercel

1. Vá para [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique "Add New..." → "Project"
3. Selecione o repositório `myshop`
4. Clique "Import"

### 3️⃣ Configurar Variáveis de Ambiente

Na página do projeto no Vercel, vá para **Settings** → **Environment Variables** e adicione:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=*** (senha do banco)
POSTGRES_DB=myshop
POSTGRES_HOST=*** (seu host do banco em produção)
DB_PORT=5432
JWT_SECRET=*** (gere uma chave segura)
EMAIL_USE=seu-email@gmail.com
EMAIL_PASS=*** (senha de app Gmail)
FRONTEND_URL=https://seu-dominio.vercel.app
NODE_ENV=production
UPSTASH_REDIS_REST_URL=***
UPSTASH_REDIS_REST_TOKEN=***
```

### 4️⃣ Banco de Dados em Produção

**Opções recomendadas:**

| Serviço             | Custo          | Facilidade | Link                                               |
| ------------------- | -------------- | ---------- | -------------------------------------------------- |
| **Vercel Postgres** | Grátis (5GB)   | ⭐⭐⭐⭐⭐ | [vercel.com/postgres](https://vercel.com/postgres) |
| **Railway**         | $5/mês         | ⭐⭐⭐⭐   | [railway.app](https://railway.app)                 |
| **Neon**            | Grátis (3GB)   | ⭐⭐⭐⭐   | [neon.tech](https://neon.tech)                     |
| **Supabase**        | Grátis (500MB) | ⭐⭐⭐⭐   | [supabase.com](https://supabase.com)               |

**Usar Vercel Postgres** (mais integrado):

1. No dashboard Vercel, vá em **Storage** → **Create Database**
2. Selecione "Postgres"
3. Conecte ao seu projeto
4. Copie as variáveis de ambiente (serão adicionadas automaticamente)

### 5️⃣ Deploy Automático

Após configurar tudo:

```bash
# No seu repositório local:
git push origin main

# Vercel detectará mudanças automaticamente
# Deploy começará em ~2 minutos
# Seu projeto estará em: https://seu-projeto.vercel.app
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia Docker + PostgreSQL + migrations + Next.js dev

# Serviços Docker
npm run services:up     # Inicia PostgreSQL em background
npm run services:down   # Para e remove container PostgreSQL
npm run services:stop   # Para container (sem remover)

# Migrations
npm run migrate:create [name]  # Cria nova migration
npm run migrate:up            # Aplica todas as migrations pendentes
npm run migrate:down          # Reverte última migration

# Testes
npm test                # Executa testes (inicia Docker + migrations + testes)
npm run test:watch     # Modo watch para desenvolvimento

# Linting & Formatação
npm run lint:eslint:check    # Verifica ESLint sem corrigir
npm run lint:eslint:fix      # Corrige problemas ESLint automaticamente
npm run lint:prettier:check  # Verifica formatação Prettier
npm run lint:prettier:fix    # Formata arquivo com Prettier

# Build & Deploy
npm run build           # Build para produção
npm start               # Inicia servidor em produção (requires npm run build first)

# Commits (Conventional Commits)
npm run commit          # CLI interativo para criar commits convencionais
npm run prepare         # Setup Husky hooks (executado automaticamente no npm install)

# Utilitários
npm run wait-for-postgres   # Script auxiliar: aguarda PostgreSQL estar pronto
```

---

## ✅ Testes

### Rodando Testes

```bash
# Executar todos os testes (inicia Docker, migrations, testes)
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar teste específico
npm test -- login.test.js

# Executar com verbose output
npm test -- --verbose
```

### Estrutura de Testes

Testes E2E de API usando **Jest** + **Supertest**:

```
test/
├── v1/
│   ├── login/
│   │   └── login.test.js          # ✅ Login (sucesso + erro)
│   ├── register/
│   │   └── register.test.js       # ✅ Registro (validações)
│   ├── brands/
│   │   └── brands.test.js         # ✅ CRUD de marcas
│   ├── status/
│   │   └── statusGet.test.js      # ✅ Health check
│   └── reset-password/
│       └── reset-password.test.js # ✅ Reset de senha
└── hooks/
    ├── orchestrator.js            # Setup de testes
    ├── userfortests.js            # Criar usuário fake
    └── userRoleAdminForTests.js   # Criar admin fake
```

### Exemplo de Teste

```javascript
// test/v1/login/login.test.js
describe('POST /api/v1/login', () => {
  it('deve fazer login com credenciais válidas', async () => {
    const response = await request(handler)
      .post('/api/v1/login')
      .send({ email: 'user@test.com', senha: 'Senha123' })

    expect(response.status).toBe(200)
    expect(response.body.token).toBeDefined()
    expect(response.body.role).toBe('USER')
  })

  it('deve rejeitar credenciais inválidas', async () => {
    const response = await request(handler)
      .post('/api/v1/login')
      .send({ email: 'user@test.com', senha: 'errado' })

    expect(response.status).toBe(401)
    expect(response.body.erro).toBeDefined()
  })
})
```

### Configuração de Testes

- **Timeout**: 60 segundos (ideal para inicialização do banco)
- **Execução**: Serial (`--runInBand`) para evitar conflitos
- **Ambiente**: `APP_ENV=test` (desativa envio real de emails, usa mock)
- **Banco**: Usa migrations automáticas antes dos testes

---

## 🐛 Troubleshooting

### ❌ "Erro: ECONNREFUSED (conexão recusada)"

**Problema**: PostgreSQL não está rodando  
**Solução**:

```bash
# Verifique se o container está ativo
docker ps | grep my_database

# Se não aparecer, inicie os serviços
npm run services:up

# Aguarde um pouco e tente novamente
npm run wait-for-postgres
```

---

### ❌ "Erro: database "myshop" does not exist"

**Problema**: Migrations não foram executadas  
**Solução**:

```bash
# Inicie manualmente as migrations
npm run migrate:up

# Ou use o script de dev que faz tudo:
npm run dev
```

---

### ❌ "Erro: jwt malformed" ou "invalid token"

**Problema**: JWT expirado (1 hora) ou inválido  
**Solução**:

```bash
# Faça login novamente para gerar novo token:
POST /api/v1/login

# Adicione o novo token nos headers:
x-user-id: "1"
x-user-email: "user@example.com"
x-user-role: "USER"
```

---

### ❌ "Erro: 429 Too Many Requests"

**Problema**: Rate limiting ativado (10 req/10s)  
**Solução**:

```bash
# Aguarde 10 segundos antes de fazer novas requisições
# Ou desative rate limiting em .env (só para desenvolvimento):
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

---

### ❌ "Erro ao enviar email: SMTP error"

**Problema**: Credenciais Gmail inválidas  
**Solução**:

1. Verifique que `EMAIL_USE` e `EMAIL_PASS` estão corretos no `.env`
2. Gere nova **App Password** em [myaccount.google.com](https://myaccount.google.com):
   - Security → 2-Step Verification (ativar se não está)
   - App passwords → Select "Mail" e "Other (custom name)" → Copiar senha
3. Cole a nova senha em `EMAIL_PASS`
4. Teste novamente

---

### ❌ "Erro: bcrypt version mismatch"

**Problema**: Versão de bcrypt incompatível  
**Solução**:

```bash
# Reconstrua bcrypt do source
npm rebuild bcrypt --build-from-source

# Ou limpe node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ Docker não inicia no M1/M2 Mac

**Problema**: Imagem PostgreSQL não é compatível com ARM  
**Solução**: Edite `infra/compose.yaml`:

```yaml
services:
  database:
    image: postgres:16.0-alpine3.18
    # Adicione platform
    platform: linux/amd64
```

---

## 🗺️ Roadmap

### 🔄 Fase 1 - Backend MVP (Em evolução)

**Status**: O backend possui um núcleo funcional de MVP, mas a refatoração e a padronização ainda estão em andamento.

**Implementado**:

- [x] Autenticação JWT com bcrypt
- [x] CRUD de usuários (login, register, reset de senha por email)
- [x] CRUD de marcas
- [x] CRUD de produtos
- [x] Gerenciamento de pedidos e itens
- [x] Rate limiting com Redis (Upstash)
- [x] Notificações por email (Nodemailer)
- [x] Testes básicos (Jest + Supertest)
- [x] Docker + PostgreSQL + Migrations
- [x] Deploy automático (Vercel)

**Em Refatoração** 🔄 (Atual - Fase 2):

- [ ] Validação de dados com **Zod**
- [ ] Documentação OpenAPI/Swagger (auto-gerada)
- [ ] Melhorias nos testes (cobertura 80%+)
- [ ] Paginação nos endpoints GET
- [ ] Filtros avançados de produtos
- [ ] Proteção contra SQL Injection (usar prepared statements em 100%)
- [ ] Soft delete (deletar sem perder dados)
- [ ] Refatoração de queries SQL duplicadas
- [ ] Error handling mais robusto

### 🚧 Fase 1.5 - Frontend em Desenvolvimento (Incompleto ⚠️)

**Status**: Páginas básicas implementadas, mas faltam funcionalidades importantes.

**Implementado**:

- [x] Páginas: Home, Login, Register, Forgot Password, Reset Password
- [x] CSS Modules para estilização
- [x] Integração básica com API
- [x] Autenticação via JWT (guardar token)

**Faltando** 🚫 (Precisa fazer):

- [ ] **Dashboard User** - Visualizar pedidos, histórico, perfil
- [ ] **Dashboard Admin** - Gerenciar produtos, marcas, pedidos, usuários
- [ ] Catálogo de produtos com filtros/busca
- [ ] Carrinho de compras (persistente)
- [ ] Checkout e criação de pedidos
- [ ] Detalhes do pedido com status
- [ ] Páginas de erro (404, 500, etc)
- [ ] Responsividade melhorada (mobile-first)
- [ ] Loading states e skeleton screens
- [ ] Notificações (toast, alerts)
- [ ] Melhorias visuais gerais (design melhor)
- [ ] Testes (React Testing Library)

### 🚀 Fase 2 - Backend Hardening (Próximo)

**Ordem de Execução**: Evolução contínua após a estabilização dos fluxos principais

- [ ] Validação com Zod em todos os endpoints
- [ ] Documentação Swagger/OpenAPI (auto-gerada)
- [ ] Cobertura de testes 80%+
- [ ] Paginação + Filtros avançados
- [ ] Cache com Redis (produtos, marcas)
- [ ] Otimização de queries (indexes, N+1 queries)
- [ ] Soft delete para dados sensíveis
- [ ] Auditoria (log de alterações)

### 🎨 Fase 3 - Frontend Refatorado & Dashboard (Futuro)

**Ordem de Execução**: Após Backend estar refatorado

- [ ] **Dashboard Admin** completo:
  - Relatórios (vendas, produtos mais vendidos, clientes)
  - Gráficos (Chart.js ou Recharts)
  - Gerenciamento de produtos/marcas/pedidos
  - Exportação de dados (CSV, PDF)
- [ ] **Dashboard User**:
  - Histórico de pedidos
  - Perfil e configurações
  - Endereços salvos
  - Wishlist
- [ ] Catálogo profissional:
  - Filtros (preço, marca, categoria, avaliação)
  - Busca full-text
  - Paginação
  - Sorting (preço, relevância, novidade)
- [ ] Carrinho de compras e checkout
- [ ] Sistema de avaliações (reviews + ratings)
- [ ] Upload de imagens (AWS S3 ou Cloudinary)
- [ ] Notificações (toast, email, push)
- [ ] Design system e componentes reutilizáveis

### 💎 Fase 4 - Features Avançadas

**Ordem de Execução**: Após Fases 2 e 3 completas

- [ ] Autenticação social (Google, GitHub, Facebook)
- [ ] Busca com Elasticsearch
- [ ] Recomendações de produtos (ML)
- [ ] Cupons e promoções
- [ ] Sistema de pontos/rewards
- [ ] Webhook para integrações externas
- [ ] Integração com gateway de pagamento (Stripe, PayPal)
- [ ] Notificações em tempo real (WebSocket)
- [ ] Sistema de suporte (chat, tickets)
- [ ] Analytics avançado (Plausible, Mixpanel)

---

## 📌 Status do Projeto

### 🔄 Backend - Estado Real

**Backend**: 🔄 Núcleo do MVP funcional | 🚧 Refatoração, validação e documentação em andamento
**Frontend**: ⚠️ Incompleto | 🚧 Páginas básicas prontas | 🚫 Faltam dashboards, catálogo, checkout

---

### Timeline do Projeto

```
┌──────────────────────────────────────────────────────────────────┐
│                    PROGRESSO DO PROJETO                          │
└──────────────────────────────────────────────────────────────────┘

📌 AGORA (Agosto 2026)
├─ Backend MVP 🔄 (Fase 1) - Núcleo funcional
├─ Backend hardening 🔄 (Fase 2) - Validações, Testes, Docs
└─ Frontend básico ⚠️ (Fase 1.5) - Páginas prontas, mas faltam dashboards

📅 PRÓXIMO (Evolução do MVP)
├─ Backend hardening 🔄
├─ Frontend em Refatoração (Fase 3) - Dashboards, Catálogo, Checkout
└─ Testes frontend (React Testing Library)

🚀 DEPOIS (Fase 4+)
├─ Dashboards completos (Admin + User)
├─ Features avançadas (Pagamentos, OAuth, Recomendações)
└─ Analytics e Performance
```

---

### O Que Está Pronto

🔄 **Backend - Funcionalidades**:

- API REST funcional (autenticação, CRUD, pedidos, emails)
- Banco de dados normalizado (7 tabelas com relacionamentos)
- Testes básicos (login, register, brands, status)
- Rate limiting com Redis
- Docker + Postgres + Migrations
- Deploy automático na Vercel

✅ **Frontend - Páginas**:

- Home, Login, Register, Forgot Password, Reset Password
- Integração com API (JWT)
- Autenticação via token

---

### Próximas Melhorias

🔄 **Backend - Hardening**:

- Validação com Zod em todos os endpoints
- Documentação Swagger/OpenAPI
- Melhorias nos testes (cobertura 80%+)
- Refatoração de queries SQL duplicadas
- Proteção contra SQL Injection
- Error handling mais robusto

🚧 **Frontend - Desenvolvimento**:

- Dashboard do User (pedidos, perfil)
- Dashboard Admin (gerenciar produtos, marcas, pedidos)
- Catálogo com filtros e busca
- Carrinho de compras
- Checkout e criação de pedidos
- Responsividade (mobile-first)
- Testes

---

### Backlog

❌ **Frontend (Prioridade Alta)**:

- [ ] Dashboard Admin (relatórios, gráficos) - **CRÍTICO**
- [ ] Dashboard User (pedidos, perfil) - **CRÍTICO**
- [ ] Catálogo de produtos (listar, filtrar, buscar) - **CRÍTICO**
- [ ] Carrinho de compras - **CRÍTICO**
- [ ] Checkout e pedidos - **CRÍTICO**
- [ ] Responsividade melhorada - **IMPORTANTE**
- [ ] Testes (React Testing Library) - **IMPORTANTE**

❌ **Backend (Prioridade Média)**:

- [ ] Validação com Zod - **IMPORTANTE**
- [ ] Documentação Swagger - **IMPORTANTE**
- [ ] Cobertura de testes 80%+ - **IMPORTANTE**
- [ ] Paginação em todos os GETs - **IMPORTANTE**

❌ **Infraestrutura/Features Avançadas**:

- [ ] Upload de imagens (S3/Cloudinary)
- [ ] Autenticação social (OAuth)
- [ ] Integração com Stripe/PayPal
- [ ] WebSocket (notificações em tempo real)

---

### Mentalidade de Desenvolvimento

Este projeto demonstra:

- ✅ Entregar MVPs funcionais com rapidez (fase 1 backend)
- ✅ Refatorar e melhorar código continuamente (qualidade > velocidade)
- ✅ Ser honesto sobre status e limitações do projeto
- ✅ Planejar e priorizar features de forma inteligente
- ✅ Não deixar código ruim acumular (refactora iterativamente)
- ✅ Reconhecer que frontend é tão importante quanto backend
- ✅ Evoluir incrementalmente sem deixar technical debt

---

## 📚 Boas Práticas Implementadas

✅ **Arquitetura Limpa**: Models (lógica) → Services (negócio) → Pages/API (rotas)  
✅ **Autenticação Segura**: JWT + bcrypt (não salva senha em plain text)  
✅ **Rate Limiting**: Proteção contra brute force  
✅ **Validação**: Regex para emails, senhas, formatos  
✅ **Tratamento de Erros**: Respostas de erro consistentes  
✅ **Testes Automatizados**: Jest + Supertest (E2E)  
✅ **Linting**: ESLint + Prettier (code style automático)  
✅ **Commits**: Conventional Commits com Husky (git hooks)  
✅ **Migrations**: Versionamento do banco de dados  
✅ **Documentação**: README completo, endpoints documentados

---

## 🤝 Contribuindo

Gostou do projeto? Quer contribuir?

1. Faça um **Fork** do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
3. Commit com Commitizen: `npm run commit`
4. Push: `git push origin feature/minha-feature`
5. Abra um **Pull Request**

**Requisitos de PR**:

- ✅ Testes passando
- ✅ ESLint sem erros
- ✅ Prettier formatado
- ✅ Conventional Commits

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👤 Autor

**Renan Delfino**

- 🐙 GitHub: [@renandelfino013](https://github.com/renandelfino013)
- 💼 LinkedIn: [linkedin.com/in/renandelfino](https://linkedin.com/in/renandelf)
- 📧 Email: renancontaps@gmail.com

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados
- [Jest](https://jestjs.io/) - Framework de testes
- [Vercel](https://vercel.com/) - Hosting & Deploy
- [Upstash](https://upstash.com/) - Redis Serverless
- Comunidade open-source 💚

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**

---

_Última atualização: 18 de Agosto de 2026_  
_Status: Em Refatoração - [v1.0.0](https://github.com/renandelfino013/myshop/releases/tag/v1.0.0)_
