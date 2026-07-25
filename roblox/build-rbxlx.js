#!/usr/bin/env node
// Baut TurboSiesta.rbxlx (Roblox-Place-Datei, XML) aus den Luau-Quellen in src/.
// Die Welt entsteht komplett zur Laufzeit per Skript — die Place-Datei enthält
// nur die drei Skripte in den richtigen Services. Öffnen in Roblox Studio,
// dann File → "Publish to Roblox".
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'TurboSiesta.rbxlx');

function source(file) {
  const code = fs.readFileSync(path.join(SRC, file), 'utf8');
  if (code.includes(']]>')) {
    throw new Error(file + ' enthält "]]>" — bricht die CDATA-Sektion.');
  }
  return code;
}

let ref = 0;
const R = () => 'RBX' + (ref++);

function scriptItem(className, name, code) {
  return `    <Item class="${className}" referent="${R()}">
      <Properties>
        <string name="Name">${name}</string>
        <ProtectedString name="Source"><![CDATA[${code}]]></ProtectedString>
      </Properties>
    </Item>`;
}

const config = source('TSConfig.luau');
const server = source('TurboSiestaServer.luau');
const client = source('TurboSiestaClient.luau');

const xml = `<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">
  <Item class="Workspace" referent="${R()}">
    <Properties>
      <string name="Name">Workspace</string>
    </Properties>
  </Item>
  <Item class="ReplicatedStorage" referent="${R()}">
    <Properties>
      <string name="Name">ReplicatedStorage</string>
    </Properties>
${scriptItem('ModuleScript', 'TSConfig', config)}
  </Item>
  <Item class="ServerScriptService" referent="${R()}">
    <Properties>
      <string name="Name">ServerScriptService</string>
    </Properties>
${scriptItem('Script', 'TurboSiestaServer', server)}
  </Item>
  <Item class="StarterPlayer" referent="${R()}">
    <Properties>
      <string name="Name">StarterPlayer</string>
    </Properties>
    <Item class="StarterPlayerScripts" referent="${R()}">
      <Properties>
        <string name="Name">StarterPlayerScripts</string>
      </Properties>
${scriptItem('LocalScript', 'TurboSiestaClient', client)}
    </Item>
  </Item>
</roblox>
`;

fs.writeFileSync(OUT, xml);
console.log('geschrieben:', OUT, '(' + xml.length + ' Bytes)');
