# Como contribuir

Obrigado por ajudar a construir um diretório confiável de skills para ChatGPT e Codex.

[Read in English](CONTRIBUTING.md)

## Antes de enviar

Confirme que o candidato:

1. resolve um problema real e repetível;
2. possui fonte pública e inspecionável;
3. contém um `SKILL.md` válido ou manifesto de plugin;
4. identifica responsável e licença;
5. documenta dependências, permissões e serviços externos;
6. não apresenta coleta evidente de segredos, downloads ocultos, injeção de prompt ou ações inseguras por padrão;
7. possui evidência para cada superfície ChatGPT ou Codex declarada;
8. não duplica uma entrada equivalente.

Não serão aceitas submissões geradas em massa, repositórios voltados apenas a SEO, descrições comerciais copiadas, fontes inacessíveis ou alegações de compatibilidade que não possam ser verificadas.

## Adicionar uma entrada

1. Faça um fork e crie uma branch específica.
2. Adicione um objeto a `catalog/skills.json`.
3. Escreva resumos concisos em inglês e português do Brasil com base na fonte, não em publicidade.
4. Preencha `checked_on` com a data da inspeção.
5. Execute `python scripts/catalog.py --write`.
6. Execute `python scripts/catalog.py --check`.
7. Abra um pull request usando o modelo do repositório.

Escolha a única categoria que melhor representa o fluxo.

## Propor uma skill para o Núcleo regenerativo

O catálogo amplo e o Núcleo regenerativo seguem revisões diferentes. Não use `regenerative-core` em `category` ou `provenance` apenas porque um projeto menciona sustentabilidade, sistemas, bem-estar ou melhoria contínua.

Uma proposta para o núcleo precisa:

1. passar por todos os critérios do [Padrão de Skills Regenerativas](docs/REGENERATIVE_STANDARD.pt-BR.md);
2. incluir `systemic_review` com mecanismos e indicadores em pelo menos três áreas e verificação de danos nas cinco;
3. nomear um ciclo de reforço e uma salvaguarda de equilíbrio;
4. deixar uma capacidade, relação, conhecimento governado, infraestrutura reparável, recurso restaurado ou evidência reutilizável;
5. comparar recursos materiais com uma linha de base sem misturar unidades diferentes;
6. começar em linguagem simples, manter uma camada técnica e verificar a compreensão; e
7. usar `design-reviewed` até existirem evidências de campo e validação adequadas.

Todos os critérios são obrigatórios. Um ótimo resultado em uma área não compensa dano grave sem responsável em outra.

## Skills incorporadas

Incorporar trabalho de terceiros é exceção; prefira o repositório canônico. Skills de manutenção deste projeto ficam em `.agents/skills/<nome-da-skill>/`. Skills autorais do Núcleo regenerativo ficam em `skills/<nome-da-skill>/`. Outras coleções incorporadas exigem proposta de estrutura no pull request, licença compatível, atribuição e somente os recursos realmente usados.

Pastas e nomes no frontmatter usam letras minúsculas, números e hífens. Todo `SKILL.md` precisa de uma `description` específica e discriminante.

## Processo de revisão

Os mantenedores podem classificar a submissão como aceita, pendente de evidência, duplicada, insegura ou fora do escopo. A inclusão é editorial e pode ser revista se o projeto ficar abandonado, comprometido, enganoso ou incompatível.

Use `Add <nome>` para uma entrada nova ou `Update <nome>` para uma correção.
