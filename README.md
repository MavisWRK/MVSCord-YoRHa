# MVSCord — projeto modular

Versão visual 1.2.5 · MavisWRK

Temas Light (YoRHa bege), Dark, Pink e Midnight. Esta organização mantém o layout e as correções atuais; a versão NerdFont continua separada e não foi alterada.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `src/styles/base/oldcord.css` | Base de layout herdada do MVSCord/Oldcord |
| `src/styles/components/` | Regras compartilhadas: grades, perfis, campos, código e outros componentes |
| `src/themes/light/` | Paleta e diferenças da versão bege |
| `src/themes/dark/` | Paleta e diferenças da versão escura |
| `src/themes/pink/` | Paleta e diferenças da versão rosa |
| `src/themes/midnight/` | Paleta e diferenças da versão Midnight |
| `src/themes/*/palette.css` | Cores principais e textura da variante |
| `src/themes/*/theme.json` | Metadados e sequência explícita dos módulos |
| `assets/wallpapers/` | Wallpapers horizontal e vertical |
| `assets/icons/` | Emblema e ícones extraídos da base |
| `assets/decorations/` | Seletores e bordas decorativas |
| `assets/manifest.json` | Inventário dos assets, tipos e hashes |
| `scripts/build.mjs` | Montagem e validação, sem dependências npm |
| `project.json` | Variantes incluídas e endereço público dos assets |
| `*.theme.css` na raiz | Arquivos gerados para os links públicos existentes |
| `dist/portable/` | Arquivos autocontidos para teste local |

Não há frontend React, backend ou JavaScript executado dentro do Discord. O Node é usado somente para preparar os arquivos. O Discord recebe CSS e carrega as imagens referenciadas por ele.

## Build

Use Node.js 18 ou superior. Não é necessário executar `npm install`.

```sh
npm run build
npm test
npm run build:portable
```

O build concatena os módulos na ordem indicada em cada `theme.json`. Não usa imports entre módulos em tempo de execução, minificação ou `@layer`: isso conserva a prioridade das regras e torna a saída linear. O import já existente de variáveis do Oldcord é mantido.

O CSS publicado na raiz contém URLs para assets separados, sem imagens em base64. A saída portátil incorpora as imagens e fica maior; ela é opcional e serve para testar localmente antes de publicar.

## Instalar agora, sem publicar

1. Abra `dist/portable/` neste pacote.
2. Copie somente a variante desejada para a pasta de temas do Vencord.
3. Desative as outras variantes e ative a escolhida.

A versão portátil ainda depende do import de variáveis do Oldcord. Ela não é totalmente offline.

## Publicar no repositório existente

O endereço configurado em `project.json` é:

```text
https://raw.githubusercontent.com/MavisWRK/MVSCord-YoRHa/main/
```

1. Copie o conteúdo deste projeto para seu checkout do repositório existente.
2. Preserve seus screenshots, licenças e outras alterações próprias; integre a documentação conforme necessário.
3. Execute `npm run build` e `npm test`.
4. Publique os quatro `*.theme.css` da raiz junto com `assets/`, `src/`, `scripts/`, `project.json`, `package.json` e a documentação.
5. Confira que os assets estão acessíveis e recarregue o tema no Discord.

Os nomes dos três temas anteriores foram preservados; o Midnight usa `MVSCord-Midnight.theme.css`. Não publique somente o CSS: os novos caminhos de imagens só funcionarão depois que a pasta `assets/` estiver no GitHub. Este pacote não publica nada automaticamente.

Para outro repositório ou branch, altere `assetBase` em `project.json` e gere novamente. Para um build temporário, também é possível definir a variável de ambiente `MVSCORD_ASSET_BASE` com uma URL absoluta terminada em `/`.

## Como editar

- Cores principais: `src/themes/<variante>/palette.css`.
- Cores específicas de componentes: arquivos da variante, como `spotify.css`, `header-contrast.css` e `surface-tokens.css`.
- Regra comum: procure o módulo em `src/styles/components/` e veja quais manifestos o incluem.
- Layout herdado: `src/styles/base/oldcord.css`.
- Wallpaper: substitua a imagem em `assets/wallpapers/`, conservando o nome e atualizando seu hash no manifesto.
- Novo módulo: crie o CSS e registre sua posição em `theme.json`.

Módulos com sufixos como `-light` são compartilhados apenas pelas variantes que os listam. A organização mantém diferenças explícitas em vez de forçar uma paleta comum sobre perfis Nitro. Alguns overrides históricos foram preservados intencionalmente: fundi-los ou mudar a ordem pode causar regressões. Não edite os CSS gerados na raiz, pois o build os sobrescreve.

## Verificação

A migração foi comparada com os quatro arquivos anteriores: após normalizar URLs, a ordem e o conteúdo das regras são idênticos, e os 14 assets mantêm os mesmos bytes. Os builds hospedado e portátil passaram nessa comparação. Isso não substitui uma verificação visual no Discord.

`npm test` confere a integridade dos assets, as referências dos módulos e o hash da cascata aprovada. Uma edição intencional de CSS muda esse hash. Depois de revisar o diff e validar visualmente, execute:

```sh
npm run baseline:accept
npm test
```

Não aceite a baseline apenas para esconder uma falha inesperada. Para trocar imagens, atualize `sha256` e `bytes` do arquivo correspondente em `assets/manifest.json` antes de gerar.

Confira especialmente perfis claros e escuros, caixa de mensagem do perfil, prévias de JSON/TXT, loja, configurações, player Spotify e chamadas.

## Créditos

Veja [CREDITS.md](CREDITS.md). Os assets extraídos mantêm suas origens; reorganizá-los não altera sua autoria.
