# Relatório de Atualização do WhatsApp

## Resumo
- Número antigo substituído: variantes de `15558043916` (incluindo links `api.whatsapp.com` e comentário com formato `+1 (555) 804-3916`).
- Novo número aplicado: `+5511947393315`, incluindo derivações `https://wa.me/5511947393315` e versão numérica `5511947393315`.
- Total de ocorrências diretas atualizadas: 7 referências em arquivos Liquid/JSON/JS + 1 referência textual em comentário.

## Arquivos modificados e substituições
| Arquivo | Contexto | Antes | Depois |
| --- | --- | --- | --- |
| sections/central-de-atendimento.liquid | CTA do hub de atendimento | `https://wa.me/15558043916?...` | `https://wa.me/5511947393315?...` |
| sections/november-pro-access.liquid | Defaults de schema e lógica de link | `default: '15558043916'` | `default: '5511947393315'` |
| assets/hb-professional-program.js | Link dinâmico com UTMs | Base `https://api.whatsapp.com/send?phone=...` e fallback `'15558043916'` | Base `https://wa.me/5511947393315?...` com fallback sanitizado `5511947393315` |
| snippets/hb-professional-program.liquid | Botão campanha Black November | Link `https://wa.me/15558043916?...` e comentário `+1 (555) 804-3916` | Link `https://wa.me/5511947393315?...` e comentário `+55 (11) 94739-3315` |
| snippets/hb-professional-program__backup.liquid | Data attribute para JS | `data-whatsapp-phone="15558043916"` | `data-whatsapp-phone="5511947393315"` |
| layout/theme.liquid__backup_central_2025-11-05 | Botão flutuante legado | `https://api.whatsapp.com/send?phone=15558043916...` | `https://wa.me/5511947393315?...` |
| logs/theme_updates.json | Log histórico | `(+15558043916)` | `(+5511947393315)` |

## Ocorrências ignoradas
- Nenhuma. Variáveis dinâmicas não continham o número antigo.

## Validações
- `rg -n "15558043916"` → sem resultados após substituição.
- `rg -n "+15558043916"`, `rg -n "804-3916"` → sem resultados.
- Links com UTMs agora seguem o formato `https://wa.me/5511947393315?...` no script dinâmico.
- Função JS normaliza o telefone para evitar prefixos duplicados (`+55+5511...`).
- CTAs (hub, bloco Black November, botão flutuante legado) abrem o novo número.

