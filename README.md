# App e-commerce Node.js / React

## Forker puis cloner

- **Forker** ce dépôt (dans le cadre des cours)
- Cloner le fork

## Préalable

Installer `pnpm` globalement : `npm i -g pnpm`

## Installer frontend

En étant placé à la racine du dépôt :

```
cd frontend
pnpm i
```

## Installer backend

**Retourner** à la racine du dépôt : `cd ..`, puis :

```
cd backend
pnpm i
```

**Aller à cette adresse** <https://drive.google.com/file/d/1P1I2qjsxSBzJ7U6gZWSeVGcCGctut_PM/view?usp=sharing> et télécharger le fichier (icône en haut de l'écran).

Décompresser l'archive et copier le dossier `images` sous `backend/static` dans votre dépôt local.

**Lancer les commandes (dans le dossier `backend`) :**

- `npx db-migrate up -e development` (crée la base de données SQLite3 locale et les tables)
- `npx ts-node tools/seed-products.ts` (insère des produits dans la base SQLite3)
- **Optionnel** : `npx ts-node tools/create-user.ts user@test.com` (crée un utilisateur avec l'email `user@test.com` - vous pouvez le changer)

  - cette commande créera un compte utilisateur sur l'appli, et imprimera à l'écran un mot de passe aléatoire : notez la paire e-mail/mot de passe, pour pouvoir vous connecter à l'application.
  - vous pouvez, plus simplement, créer un compte sur l'application via "Inscription"

## Lancer les apps

Avoir deux terminaux ouverts, l'un dans `backend`, l'autre dans `frontend`, et dans chacun d'eux : `pnpm dev` ou `npm run dev`.

> __&rarr; Vous pouvez alors visiter <http://localhost:5173> pour accéder au frontend de l'application.__
