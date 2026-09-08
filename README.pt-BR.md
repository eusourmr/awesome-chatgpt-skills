# Awesome ChatGPT Skills

[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)
[![Validar catálogo](https://github.com/eusourmr/awesome-chatgpt-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/eusourmr/awesome-chatgpt-skills/actions/workflows/validate.yml)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)

Um diretório selecionado e conferido de skills reutilizáveis e plugins orientados por skills para ChatGPT e Codex.

[English](README.md)

> Projeto comunitário independente. Não possui afiliação nem endosso da OpenAI. ChatGPT e Codex são marcas da OpenAI.

## Por que esta lista existe

Não basta chamar uma pasta de `skill`. Este catálogo prioriza fluxos bem delimitados, licença visível, código inspecionável, compatibilidade declarada com honestidade e caminhos práticos de instalação.

A OpenAI diferencia duas formas de distribuição:

- Uma **skill independente** é uma pasta com `SKILL.md` e, opcionalmente, scripts, referências, recursos e `agents/openai.yaml`. Ela está disponível no aplicativo do ChatGPT para desktop, no Codex CLI e na extensão do Codex para IDE.
- Um **plugin** é um pacote instalável que pode reunir skills, conectores e ferramentas MCP. Plugins com skills podem operar no Chat e no Work do ChatGPT e também no Codex, conforme a disponibilidade do produto, da conta, da plataforma e das dependências.

Consulte os guias oficiais para [criar skills](https://learn.chatgpt.com/docs/build-skills) e entender [skills e plugins](https://learn.chatgpt.com/docs/skills-and-plugins).

## Selos de curadoria

| Selo | Significado |
|---|---|
| `Catálogo OpenAI` | Presente no repositório oficial de exemplos `openai/plugins`. Isso não garante endosso nem disponibilidade para todas as contas. |
| `Comunidade` | Publicação independente revisada segundo os critérios deste repositório. |
| `Chat` | Indicada para uso conversacional no ChatGPT. |
| `Work` | Indicada para fluxos e artefatos do ChatGPT Work. |
| `Codex` | Indicada para fluxos do Codex desktop, CLI, IDE ou nuvem. |

Os selos de superfície são classificações conservadoras, não garantias de disponibilidade. Examine código, permissões, scripts e dependências antes de instalar.

## Catálogo

<!-- CATALOG:START -->
<!-- Gerado por scripts/catalog.py. Não edite este bloco manualmente. -->

### Coleção oficial

- [**OpenAI Plugins**](https://github.com/openai/plugins) — Coleção oficial atual de exemplos de plugins para ChatGPT e Codex, incluindo pacotes somente com skills e pacotes apoiados por MCP. `Coleção` · `Catálogo OpenAI` · `Chat` · `Work` · `Codex` · `Licença: Per package` · OpenAI · 2026-09-08

### Desenvolvimento

- [**Build iOS Apps**](https://github.com/openai/plugins/tree/main/plugins/build-ios-apps) — Cria e depura aplicativos iOS com SwiftUI, App Intents, Xcode, Simulator e fluxos de desempenho e memória. `Plugin` · `Catálogo OpenAI` · `Codex` · `Licença: MIT` · OpenAI · 2026-09-08
- [**Build macOS Apps**](https://github.com/openai/plugins/tree/main/plugins/build-macos-apps) — Cria, testa, instrumenta e depura apps nativos para macOS com SwiftUI, AppKit, Xcode, assinatura e logs unificados. `Plugin` · `Catálogo OpenAI` · `Codex` · `Licença: MIT` · OpenAI · 2026-09-08
- [**Build Web Apps**](https://github.com/openai/plugins/tree/main/plugins/build-web-apps) — Cria aplicativos web com foco no frontend, recursos visuais, testes no navegador, componentes de UI, pagamentos e bancos de dados. `Plugin` · `Catálogo OpenAI` · `Work` · `Codex` · `Licença: MIT` · OpenAI · 2026-09-08
- [**OpenAI Developers**](https://github.com/openai/plugins/tree/main/plugins/openai-developers) — Desenvolve com as APIs da OpenAI, Agents SDK e aplicativos do ChatGPT usando documentação e fluxos oficiais. `Plugin` · `Catálogo OpenAI` · `Codex` · `Licença: Proprietary` · OpenAI · 2026-09-08
- [**Plugin Eval**](https://github.com/openai/plugins/tree/main/plugins/plugin-eval) — Avalia e compara skills e plugins do Codex com relatórios locais, explicações de pontuação e medição de tokens. `Plugin` · `Catálogo OpenAI` · `Codex` · `Licença: MIT` · OpenAI · 2026-09-08
- [**Superpowers**](https://github.com/openai/plugins/tree/main/plugins/superpowers) — Framework de skills para desenvolvimento de software com ideação, planejamento, TDD, depuração, colaboração e revisão de código. `Plugin` · `Catálogo OpenAI` · `Codex` · `Licença: MIT` · Jesse Vincent · 2026-09-08

### Dados e pesquisa

- [**Build Web Data Visualization**](https://github.com/openai/plugins/tree/main/plugins/build-web-data-visualization) — Projeta, implementa, testa e exporta gráficos, mapas, painéis, diagramas e narrativas visuais para navegador. `Plugin` · `Catálogo OpenAI` · `Work` · `Codex` · `Licença: MIT` · OpenAI · 2026-09-08
- [**Data Analytics**](https://github.com/openai/plugins/tree/main/plugins/data-analytics) — Responde perguntas de produto e negócio com validação, diagnóstico, gráficos, painéis, notebooks e relatórios. `Plugin` · `Catálogo OpenAI` · `Chat` · `Work` · `Codex` · `Licença: Proprietary` · OpenAI · 2026-09-08
- [**Life Science Research**](https://github.com/openai/plugins/tree/main/plugins/life-science-research) — Direciona e sintetiza evidências de genética, ômicas, biologia, química, pesquisa clínica e bases públicas. `Plugin` · `Catálogo OpenAI` · `Work` · `Codex` · `Licença: Proprietary` · OpenAI · 2026-09-08

### Design e mídia

- [**Creative Production**](https://github.com/openai/plugins/tree/main/plugins/creative-production) — Transforma briefings, produtos e imagens em conceitos de campanha, painéis de referência, anúncios, posts e materiais de lançamento. `Plugin` · `Catálogo OpenAI` · `Chat` · `Work` · `Codex` · `Licença: Proprietary` · OpenAI · 2026-09-08
- [**Figma**](https://github.com/openai/plugins/tree/main/plugins/figma) — Implementa designs do Figma em código, cria modelos Code Connect e gera regras de design system específicas do projeto. `Plugin` · `Catálogo OpenAI` · `Work` · `Codex` · `Licença: LicenseRef-Figma-Developer-Terms` · Figma · 2026-09-08
- [**Product Design**](https://github.com/openai/plugins/tree/main/plugins/product-design) — Transforma ideias, URLs, capturas e briefings em direções de produto, auditorias de UX e protótipos interativos. `Plugin` · `Catálogo OpenAI` · `Work` · `Codex` · `Licença: Proprietary` · OpenAI · 2026-09-08
- [**Remotion**](https://github.com/openai/plugins/tree/main/plugins/remotion) — Cria vídeos programáticos com React usando orientações para animação, áudio, legendas, gráficos, 3D e transições. `Plugin` · `Catálogo OpenAI` · `Codex` · `Licença: MIT` · Remotion · 2026-09-08

### Produtividade e colaboração

- [**Google Drive**](https://github.com/openai/plugins/tree/main/plugins/google-drive) — Usa uma entrada única para pesquisar, organizar e compartilhar no Drive e trabalhar com Docs, Sheets e Slides. `Plugin` · `Catálogo OpenAI` · `Chat` · `Work` · `Codex` · `Licença: MIT` · OpenAI · 2026-09-08
- [**Notion**](https://github.com/openai/plugins/tree/main/plugins/notion) — Transforma especificações, pesquisas, reuniões e contexto do workspace em planos, documentação e conhecimento durável. `Plugin` · `Catálogo OpenAI` · `Chat` · `Work` · `Codex` · `Licença: MIT` · Notion · 2026-09-08

### Segurança e qualidade

- [**Codex Security**](https://github.com/openai/plugins/tree/main/plugins/codex-security) — Executa fluxos reutilizáveis de varredura, análise, validação, triagem e investigação de segurança em código e diffs. `Plugin` · `Catálogo OpenAI` · `Codex` · `Licença: Proprietary` · OpenAI · 2026-09-08
<!-- CATALOG:END -->

## O que pode entrar

Uma submissão deve resolver uma tarefa real e repetível; expor um `SKILL.md` ou manifesto inspecionável; identificar responsável e licença; revelar dependências e acesso a dados; respeitar autorizações de segurança; e apresentar evidência para cada superfície declarada.

Leia [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md) antes de enviar um pull request.

## Curador integrado ao repositório

O projeto inclui a skill [`$catalog-curator`](.agents/skills/catalog-curator/SKILL.md), disponível no escopo do repositório para revisar contribuições no Codex. Clone o projeto, abra-o no Codex e peça:

```text
Use $catalog-curator para revisar https://github.com/dono/repositorio para inclusão.
```

## Validar localmente

```bash
python scripts/catalog.py --check
```

Depois de alterar `catalog/skills.json`, atualize as duas edições:

```bash
python scripts/catalog.py --write
```

## Pontos de partida oficiais

- [OpenAI: criar skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI: Skills e Plugins](https://learn.chatgpt.com/docs/skills-and-plugins)
- [Repositório OpenAI Plugins](https://github.com/openai/plugins)
- [Padrão aberto Agent Skills](https://agentskills.io/)

## Agradecimentos

Inspirado pelo modelo de curadoria comunitária de [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills). O conteúdo de lá não é espelhado aqui; cada item é revisado e descrito para o ecossistema ChatGPT e Codex.

## Licença

O conteúdo autoral e o código de validação deste repositório usam a [Licença MIT](LICENSE). Projetos indicados mantêm suas próprias licenças.
