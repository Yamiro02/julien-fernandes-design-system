# Journal des versions

Ce fichier est **celui du projet que vous fabriquez**, pas celui du squelette. Il démarre
vide exprès : l'historique d'un autre design system n'apprend rien sur le vôtre.

La procédure de version est dans [`GOVERNANCE.md`](GOVERNANCE.md), et `node check-version.mjs`
vérifie que la version de `package.json`, la ligne d'installation du README et le tag git
concordent.

---

## 0.1.0 — squelette

Point de départ : 37 composants, 9 pages de vitrine, le contrat de marque, les six scripts
de contrôle (`check-contract`, `check-contrast`, `check-dark-substitution`,
`check-utility-collisions`, `check-literals`, `check-version`) — `npm run lint` en agrège
une partie avec le typecheck — et une marque d'exemple à remplacer.
