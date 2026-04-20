# Guia de Localização e Internacionalização (i18n) - COMP/CON

Este documento descreve a arquitetura e os processos implementados para suportar múltiplos idiomas no COMP/CON, com foco especial na transição para o Português (Brasil).

## 1. Arquitetura i18n

O projeto utiliza a biblioteca `vue-i18n` para gerenciar as traduções da interface do usuário (UI).

- **Arquivos de Localização**: Localizados em `src/locales/`.
  - `en.json`: Fonte da verdade para chaves e estrutura.
  - `pt-BR.json`: Tradução para Português Brasileiro.
- **Configuração**: O arquivo `src/i18n.ts` inicializa o plugin, definindo o idioma padrão e as mensagens.

### Boas Práticas de Tradução
- **Sem HTML em JSON**: Evite colocar tags HTML (como `<b>` ou `<span>`) dentro dos arquivos JSON. Isso evita avisos de segurança (XSS) e facilita a manutenção.
- **Interpolação de Componentes**: Use `<i18n-t>` em componentes `.vue` para mensagens que exigem estilização específica em partes do texto.
  - *Exemplo*:
    ```html
    <i18n-t keypath="chave.da.mensagem">
      <template #slot_name><b>Texto Estilizado</b></template>
    </i18n-t>
    ```

## 2. Gerenciamento de Idioma (Switcher)

O sistema de troca de idioma é centralizado e reativo.

- **Componente**: `CCLanguageSwitcher.vue` fornece a interface para o usuário.
- **Estado**: O idioma selecionado é armazenado no `UserStore` (gerenciado via Pinia).
- **Persistência**: A alteração do idioma dispara uma atualização no `localStorage`, garantindo que a preferência do usuário seja mantida entre sessões.

## 3. Proxy de Dados do Lancer (`Lancer Data Proxy`)

Diferente da interface, os dados do compêndio (itens, frames, regras) são carregados de pacotes externos (`@massif/lancer-data`).

- **Mecanismo**: Criamos um `lancer-data-proxy.ts` que atua como um intermediário.
- **Funcionamento**: 
  - O proxy observa as mudanças de idioma no sistema i18n.
  - Quando o idioma muda, o proxy troca dinamicamente o conjunto de dados carregado na memória sem a necessidade de recarregar a página.
  - Se um item não possuir tradução no pacote de dados PT-BR, o proxy tenta buscar o fallback no pacote EN original automaticamente.

## 4. Alterações de Impacto e Segurança

Algumas modificações recentes foram feitas para garantir a estabilidade do sistema:

### Decodificação e Segurança (`Decode.ts`)
- **Problema**: O sistema de conquistas e certas decodificações dependiam de uma variável de ambiente (`VITE_ACHIEVEMENT_KEY`) que, se ausente, quebrava a aplicação.
- **Solução**: Implementamos um **fallback** (chave padrão) e adicionamos a variável ao `.env`. Isso garante que a aplicação não sofra um crash fatal se as variáveis de ambiente estiverem incompletas.

### Correções de Tipagem (TypeScript)
- **Componentes de Dados**: Refatoramos componentes como `CCDiceMenu.vue` para usar interfaces TypeScript estritas. Isso remove erros de "never type" e garante que operações matemáticas com modificadores (como bônus de precisão) não falhem por incompatibilidade de tipos entre strings e números.

## 5. Como Adicionar Novas Traduções

1. Identifique a string hardcoded no componente `.vue`.
2. Adicione a chave correspondente no `en.json` (preferencialmente em `common` se for genérica, ou em um namespace específico da feature).
3. Replique a chave no `pt-BR.json` com a tradução.
4. Substitua o texto no componente por `$t('caminho.da.chave')`.

---
*Este guia deve ser atualizado sempre que novas infraestruturas de localização forem adicionadas.*
