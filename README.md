## För att starta denna applikation behöver du navigera till "Server" och ladda ner de krav som behövs ==

cd Server
npm install
node server.js

## Sedan öppnar du en ny terminal och navigerar till "React" och laddar ner de krav som behövs ==

cd React
npm install
npm run dev

## För att köra enhetstesterna för frontend

cd React
npm test

## För att köra integrationstesterna för backend

installera först hurl på din dator: https://hurl.dev/
säkerställ att databas är tömd från data
cd Server
hurl -v apitests.hurl
