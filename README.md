# FoodOrder

API NestJS de commande groupée de restaurant.

Stack : NestJS 12, TypeScript 6 (ESM), Kysely + PostgreSQL 18, RustFS (stockage compatible S3), Vitest, oxlint et oxfmt.

## Prérequis

- Node.js 24 (voir `.nvmrc`, minimum `22.12`)
- pnpm via Corepack (la version est fixée par le champ `packageManager` de `package.json`)
- Docker et Docker Compose

## Démarrage en local

```bash
corepack enable
pnpm install
cp .env.example .env
pnpm infra:up
pnpm migrate:latest
pnpm start:dev
```

Pensez à remplacer les secrets de `.env` (`JWT_SECRET`, `JWT_REFRESH_SECRET`, mots de passe) par vos propres valeurs.

L'API écoute sur `http://localhost:3000` (variable `PORT`) :

- `GET /health` : état de l'API et de la base de données
- `/api` : documentation Swagger
- `/api-json` : document OpenAPI

La console RustFS est accessible sur `http://localhost:9001` (identifiants `S3_ACCESS_KEY` et `S3_SECRET_KEY`).

Au premier démarrage, PostgreSQL crée la base `<POSTGRES_DB>` et la base de test `<POSTGRES_DB>_test` (script `docker/postgres/init/`). Ce script ne s'exécute que si le volume est vide : pour le rejouer, lancez `docker compose down -v` (attention, cela supprime les données).

## Commandes

| Commande                     | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| `pnpm start:dev`             | Démarre l'API en mode watch                              |
| `pnpm build`                 | Compile dans `dist/`                                     |
| `pnpm start:prod`            | Lance la version compilée                                |
| `pnpm test`                  | Tests unitaires (`src/**/*.spec.ts`)                     |
| `pnpm test:watch`            | Tests unitaires en mode watch                            |
| `pnpm test:cov`              | Tests unitaires avec couverture                          |
| `pnpm test:e2e`              | Tests e2e (`test/**/*.e2e-spec.ts`) sur la base de test  |
| `pnpm lint`                  | oxlint sur `src` et `test`, les warnings font échouer    |
| `pnpm format`                | Formate le code avec oxfmt                               |
| `pnpm format:check`          | Vérifie le formatage                                     |
| `pnpm typecheck`             | Vérifie les types avec `tsc --noEmit`                    |
| `pnpm infra:up`              | Démarre PostgreSQL et RustFS                             |
| `pnpm infra:down`            | Arrête PostgreSQL et RustFS                              |
| `pnpm migrate:make <nom>`    | Crée une migration vide horodatée (nom en snake_case)    |
| `pnpm migrate:latest [test]` | Applique toutes les migrations en attente                |
| `pnpm migrate:up [test]`     | Applique la migration suivante                           |
| `pnpm migrate:down [test]`   | Annule la dernière migration                             |
| `pnpm db:types`              | Régénère `src/database/database.types.ts` depuis la base |

L'argument optionnel `test` des commandes `migrate:*` cible `DATABASE_URL_TEST` au lieu de `DATABASE_URL`.

## Workflow des migrations

1. Créer la migration : `pnpm migrate:make create_users_table`. Un fichier `src/database/migrations/<horodatage>_create_users_table.ts` est créé avec des fonctions `up` et `down` vides.
2. Écrire `up` et `down` (renommer le paramètre `_db` en `db`). Utiliser `Kysely<unknown>` : une migration ne dépend pas des types générés.
3. Appliquer : `pnpm migrate:latest`.
4. Régénérer les types : `pnpm db:types`, puis committer la migration et `database.types.ts` ensemble.
5. Pour annuler : `pnpm migrate:down`.

Les tests e2e appliquent automatiquement les migrations sur la base de test (`globalSetup`).

`database.types.ts` est généré par `kysely-codegen` : il ne doit pas être modifié à la main. Il est exclu du lint et du formatage car il contient des `interface`.

## Structure des dossiers

```
.
├── docker/postgres/init/      Scripts exécutés au premier démarrage de PostgreSQL
├── docker-compose.yml         PostgreSQL et RustFS
├── src/
│   ├── _utils/
│   │   ├── config/            Validation de l'environnement, options du ValidationPipe et de Swagger
│   │   ├── constants/         Constantes (pas de valeur magique dans le code)
│   │   ├── decorators/        Décorateurs partagés
│   │   ├── dtos/              DTO partagés (réponses d'erreur)
│   │   └── helpers/           Fonctions utilitaires (export function)
│   ├── database/
│   │   ├── migrations/        Migrations Kysely
│   │   ├── scripts/           Scripts de migration (lancés avec tsx)
│   │   ├── database.module.ts Module global qui fournit l'instance Kysely
│   │   └── database.types.ts  Types générés par kysely-codegen
│   ├── health/                Module Health (GET /health)
│   ├── app.module.ts
│   ├── app.setup.ts           Configuration commune à main.ts et aux tests e2e
│   └── main.ts
└── test/
    ├── setup/                 globalSetup et setupFiles des tests e2e
    └── *.e2e-spec.ts
```

## Conventions

- `type` plutôt qu'`interface`.
- Pas de valeur magique : les nombres et chaînes de configuration vont dans `src/_utils/constants`.
- Variables d'environnement validées au démarrage par `EnvironmentVariables` (`src/_utils/config/env.config.ts`) : l'application refuse de démarrer si une variable manque ou est invalide. Elles se lisent avec `ConfigService.getOrThrow` (ou `getRequiredEnv` hors de Nest).
- Réponses de l'API via des DTO et des mappers.
- Imports relatifs avec l'extension `.js` (ESM).
- Pas de commentaires dans le code.

### `import type` et l'injection de dépendances

Utilisez `import type` quand un import ne sert que de type, **sauf pour une classe injectée dans un constructeur**.

Nest lit le type des paramètres du constructeur à l'exécution (`emitDecoratorMetadata`) pour savoir quoi injecter. Un `import type` est effacé à la compilation : la métadonnée devient `Object` et l'injection échoue.

```ts
import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
}
```

Avec `import type { HealthService }`, la compilation passe mais Nest ne peut plus résoudre la dépendance à l'exécution (erreur « Nest can't resolve dependencies »). C'est pour cette raison que la règle `typescript/consistent-type-imports` est désactivée dans `.oxlintrc.json`.
