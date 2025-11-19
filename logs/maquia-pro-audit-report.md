# Auditoria Maquia Pro – Hana Beauty (OS 2.0)

## Escopo e premissas
- **Áreas protegidas**: checkout, preços/descontos/fidelidade, rastreamento (GTM/GA4/Meta/TikTok), campanha Black November (.bn-theme/bn_enable), header/footer originais, apps críticos. Nenhum arquivo protegido foi alterado.
- **Abordagem**: leitura estrutural do tema (layout, sections, snippets, assets, config) sem remover ou sobrescrever código. Criação apenas de prévias isoladas.

## Mapa de dependências e riscos
- **Layout e injeções**: `layout/theme.liquid` concentra pixels, GTM e integrações; mantido intacto.
- **Atendimento/WhatsApp**: centralizado em `assets/hb-professional-program.js` e `sections/central-de-atendimento.liquid`; não tocado para evitar regressão.
- **Campanhas**: classes `.bn-theme` e flag `bn_enable` preservadas; novos componentes não referenciam essas flags.
- **Apps/integrações**: arquivos de Avada, Search & Discovery, Olist/Tiny e blocos de tracking não foram modificados.
- **Performance**: novos assets (`maquia-pro-preview.css` e `maquia-pro-preview.js`) só carregam quando as seções prévias são adicionadas a uma página de teste, evitando impacto global.
- **Reversibilidade**: todas as entregas são novas seções/snippets/assets opcionais; remoção simples via Theme Editor sem tocar código existente.

## Viabilidade das funcionalidades (resumo)
- **Barra de mensagens PRO**: viável com rotação JS leve e controle via schema; entregue como seção `pro-top-bar.liquid`.
- **Mega Menu avançado**: viável como seção modular com colunas, imagem e CTA; entregue como `pro-mega-menu.liquid` (não interfere no header atual).
- **Carrosséis de alta performance**: viáveis via carrossel CSS/JS leve com suporte a coleção ou placeholders; entregue como `performance-carousel.liquid`.
- **Mini-carrinho PRO (drawer)**: viável como drawer independente; usa `cart` somente quando renderizado e permanece desligado até ser adicionado; entregue como `pro-drawer-cart.liquid`.
- **PDP Premium**: viável com blocos de benefícios, selos, timer e sticky ATC acionando botão nativo; entregue como `pdp-premium-blocks.liquid` para templates de teste.
- **Seção editorial / história**: viável e entregue como `editorial-story.liquid`.
- **Seção social / UGC**: viável e entregue como `social-ugc-mosaic.liquid`.
- **Footer PRO renovado**: viável e entregue como `footer-pro.liquid` (footer paralelo, não substitui original).

## Prévia de código entregue
- **Assets novos**: `assets/maquia-pro-preview.css` (estilos), `assets/maquia-pro-preview.js` (rotações, carrossel, drawer, countdown).
- **Seções novas**: `pro-top-bar`, `pro-mega-menu`, `performance-carousel`, `pro-drawer-cart`, `pdp-premium-blocks`, `editorial-story`, `social-ugc-mosaic`, `footer-pro`.
- **Compatibilidade**: uso apenas de APIs Shopify padrão (collections, cart, product). Sem dependências externas.

## Simulação de renderização (texto)
1. **Barra PRO**: faixa gradiente com label “Hana Pro”, mensagens rotativas e CTA “Ver novidades”.
2. **Mega Menu**: grid de colunas com imagem opcional, título, descrição e CTA individual + CTA principal.
3. **Carrossel**: cards com imagem 4:5, título e preço; navegação por botões e scroll-snap.
4. **Drawer Cart**: botão “Abrir mini-carrinho PRO”; overlay + painel com itens do cart (ou placeholder), cross-sell manual, barra de progresso de frete e CTA para o checkout/cart.
5. **PDP Premium**: blocos de benefícios, timer de oferta, selos e box sticky com botão que aciona o add-to-cart nativo.
6. **Editorial**: grid imagem + texto com CTA.
7. **Social/UGC**: mosaico responsivo com legendas em degradê.
8. **Footer PRO**: colunas de institucionais, sociais e contato em fundo escuro.

## Plano de ativação segura (prévia)
1. Criar página de teste (ex.: `/pages/preview-maquia-pro`).
2. Adicionar as novas seções na ordem desejada pelo Theme Editor; confirmar que o CSS/JS é carregado apenas nestas páginas.
3. Configurar collections no carrossel e blocos de benefícios/cross-sell conforme necessidade.
4. Validar em mobile e desktop; testar drawer com carrinho vazio e cheio.
5. Após aprovação, considerar ajustes finos e eventual migração para versões definitivas (copiar código para variantes finais), mantendo footer/header originais intactos.

## Plano de rollback
- Remover as seções adicionadas da página de teste ou excluir os arquivos criados.
- Excluir os assets `maquia-pro-preview.css/js` se não forem mais necessários.

## Próximos passos sugeridos
- Se desejado, criar PR separada para integrar os schemas propostos ao `config/settings_schema.json` (hoje não alterado).
- Mapear apps de UGC e reviews para alimentar automaticamente as seções Social/Carrossel.
- Se Black November estiver ativa, criar variações específicas em novos arquivos para evitar colisão com `.bn-theme`.
