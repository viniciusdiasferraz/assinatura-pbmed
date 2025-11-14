## PBMed Assinatura — Checkout

Fluxo de checkout simples com duas páginas:
- Página de Compra (Checkout): seleção de plano, dados do cartão, aplicação de cupom e submissão.
- Página de Sucesso: exibe os dados da contratação após o request.

A aplicação consome um json-server que expõe endpoints para:
- planos
- validação/lista de cupons
- submissão de compra
- consulta da assinatura criada

### Stack
- Next.js 16, React 19, TypeScript 5
- Tailwind CSS v4
- State: Zustand
- Validações: Zod
- HTTP: Axios
- Lint/Format: Biome
- Testes: Jest + Testing Library
- API fake: json-server

---

## Como rodar

1) Instale as dependências
```bash
npm install
```

2) Configure variáveis de ambiente (IMPORTANTE)

```bash
# bash
cp .env.example .env
```

3) Suba o JSON Server (porta 3001)
```bash
npm run server
```
O servidor lê `db.json` e loga cada request (vide `server.js`). Endpoints disponíveis:
- GET `http://localhost:3001/plans`
- GET `http://localhost:3001/coupons`
- GET `http://localhost:3001/subscription`
- POST `http://localhost:3001/subscription`

4) Rode a aplicação web (porta 3000)
```bash
npm run dev
```
Acesse `http://localhost:3000`.

Observação: o cliente HTTP usa `lib/api.ts` lendo `NEXT_PUBLIC_API_BASE_URL`. Garanta o `json-server` rodando quando estiver usando a URL local.

---

## Scripts úteis

Dev/Build:
```bash
npm run dev         # Next dev
npm run build       # Next build
npm run start       # Next start
npm run server      # json-server em :3001
```

Lint/Format (Biome):
```bash
npm run lint              # checagens
npm run lint:fix          # corrige o que for seguro
npm run lint:fix:unsafe   # tenta correções adicionais (cuidado)
npm run format            # formata (dry-run)
npm run format:write      # formata escrevendo em disco
```

Testes:
```bash
npm test                 # roda testes
npm run test:watch       # modo watch
npm run test:coverage    # cobertura + relatório em coverage/lcov-report/index.html
```

---

## Convencional Commits

Siga o padrão para padronizar as mensagens:
```
<type>(<scope>): <subject>
```
Tipos comuns:
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: documentação
- `test`: testes
- `refactor`: refatoração (sem alterar comportamento)
- `chore`: tarefas diversas (build, configs)
- `build`/`ci`: alterações de build/CI

Exemplos:
- `feat(checkout): aplicar cupom no resumo`
- `fix(success): tratar installments 0 no cálculo`
- `test(ui): cobrir input-group com foco por teclado`

Scopes recomendados: `checkout`, `success`, `ui`, `store`, `helpers`, `api`.

---

## Rodar lint/format antes de commitar

Rodagem manual (recomendada):
```bash
npm run format:write && npm run lint:fix && npm test

```

## Estrutura
```
app/
  checkout/
    components/
      CardDataForm.tsx
      CheckoutClient.tsx
      CheckoutSummary.tsx
    helpers/
      masks.ts
      schema.ts
      validators.ts
    store/
      useCheckoutStore.ts
    types/
      plan.ts
    page.tsx
  success/
    components/
      SubscriptionData.tsx
      SubscriptionStatus.tsx
    helpers/
      validators.ts
    store/
      useSubscriptionStore.ts
    page.tsx
components/
  signatureCard.tsx
  ui/...(componentes de UI base)
lib/
  api.ts            # axios usando NEXT_PUBLIC_API_BASE_URL
server.js           # inicializa json-server + logs
db.json             # base de dados fake
biome.json          # config do Biome
```

---

## Produção (Vercel) — endpoint público da API

- A Vercel não consegue acessar `localhost:3001` em produção. Para isso, foi feito o deploy do `json-server` no Render e a URL pública é:
  
  `https://json-server-pbmed.onrender.com/`

- Importante: nos planos grátis do Render, a API entra em standby após ~15 minutos sem uso. Ao “acordar”, a primeira requisição pode demorar ~20–30s. Isso é esperado.
