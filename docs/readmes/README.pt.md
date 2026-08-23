# cronalize-api

> **Nota:** Esta API ainda está em desenvolvimento. Não há garantia de funcionamento estável neste momento.

O sistema automatiza o agendamento de payloads de dados para entrega em destinos específicos em datas e horários futuros precisos. Isso elimina a necessidade de as aplicações clientes gerenciarem tarefas cron locais complexas.

## Como Rodar a API

### Requisitos
* Node.js v24+
* pnpm v11+

### 1. Clone do Repositório
```bash
git clone https://github.com/9erikSantos6/cronalize-api.git
cd cronalize-api
```

### 2. Instale as Dependências
```bash
pnpm install --frozen-lockfile
```

### 3. Execute o Aplicativo
```bash
pnpm dev
```

## Como Fazer o Build

### Requisitos
* Dependências instaladas (Execute `pnpm install` primeiro)

### 1. Gerar o Build
```bash
pnpm build
```

### 2. Executar Pós-Build (Produção)
```bash
pnpm start
```
