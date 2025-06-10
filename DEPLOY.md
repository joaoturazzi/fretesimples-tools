
# Instruções de Deploy - Frete Simples

## Pré-requisitos
- Node.js 18 ou superior
- NPM (incluído com Node.js)
- Conta no Lovable

## Configuração no Lovable

### 1. Build Configuration
No painel do Lovable, configure:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x

### 2. Variáveis de Ambiente
Configure as seguintes variáveis no painel do Lovable:

```env
VITE_HERE_API_KEY=sua_chave_api_here_maps
```

**Importante**: A chave da HERE Maps API é necessária para o funcionamento das calculadoras de frete e rotas.

### 3. Scripts Disponíveis no Projeto

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Visualiza build localmente
- `npm run lint` - Verificação de código

## Estrutura de Rotas

- `/` - Página principal com todas as ferramentas
- `/dashboard` - Redireciona para a página principal
- Outras rotas retornam 404

## Solução de Problemas Comuns

### 1. Erro 404 em Assets
- Verifique se o `base: '/'` está configurado no `vite.config.ts`
- Confirme se os caminhos dos assets começam com `/` (não `./`)

### 2. HERE Maps API não funcionando
- Verifique se a variável `VITE_HERE_API_KEY` está configurada
- Confirme se a chave da API está ativa e tem permissões corretas
- Verifique o console do navegador para erros de API

### 3. Componentes não aparecem
- Verifique se não há erros de CSS que escondem componentes
- Confirme se o estado `activeSection` está sendo gerenciado corretamente
- Verifique os logs do console para debug

### 4. Problemas de Build
- Execute `npm run build` localmente para verificar erros
- Verifique se todas as dependências estão listadas no package.json
- Confirme se não há imports quebrados

## Otimizações de Performance

### Bundle Size
O projeto já está configurado com:
- Code splitting automático
- Lazy loading de componentes pesados (mapas)
- Chunks separados para vendors e bibliotecas específicas

### Cache
- Service Worker configurado para cache de assets
- Headers de cache otimizados
- Manifest.json para PWA

## Monitoramento

### Logs Importantes
Monitore os seguintes logs no console:
- Erros da HERE Maps API
- Estados de componentes (activeSection)
- Erros de routing

### Métricas de Performance
- Tempo de carregamento inicial: < 3s
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s

## Configurações de Produção

### Headers de Segurança
O projeto está configurado com:
- Content Security Policy básica
- HTTPS obrigatório em produção
- CORS configurado para APIs externas

### PWA
- Manifest configurado
- Service Worker ativo
- Ícones e tema definidos

## Suporte

Para problemas específicos:
1. Verifique os logs do console do navegador
2. Confirme se todas as variáveis de ambiente estão configuradas
3. Teste o build localmente antes do deploy
4. Verifique a documentação da HERE Maps API se houver problemas de geolocalização

## Notas Importantes

- O projeto é uma SPA (Single Page Application)
- Todas as ferramentas estão na rota principal `/`
- A navegação é feita via sidebar interno
- Não há backend próprio, apenas integração com APIs externas
