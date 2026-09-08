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

## Skills incorporadas

Incorporar código é exceção. Prefira um link ao repositório canônico. Skills de manutenção deste projeto ficam em `.agents/skills/<nome-da-skill>/`. Outras coleções incorporadas exigem proposta de estrutura no pull request, licença compatível, atribuição e somente os recursos realmente usados.

Pastas e nomes no frontmatter usam letras minúsculas, números e hífens. Todo `SKILL.md` precisa de uma `description` específica e discriminante.

## Processo de revisão

Os mantenedores podem classificar a submissão como aceita, pendente de evidência, duplicada, insegura ou fora do escopo. A inclusão é editorial e pode ser revista se o projeto ficar abandonado, comprometido, enganoso ou incompatível.

Use `Add <nome>` para uma entrada nova ou `Update <nome>` para uma correção.
