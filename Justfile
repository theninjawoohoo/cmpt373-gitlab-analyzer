werk:
  npm install
  npm run bootstrap
  npm run build
  cd packages/api && npm run migrate

ci:
  npm run build
  npm run lint
  npm run format
