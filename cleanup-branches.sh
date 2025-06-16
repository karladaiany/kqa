#!/bin/bash

# Auto-permissão: garante que o script tenha permissão de execução
chmod +x "$0"

echo "=========================================="
echo "🔧 LIMPEZA DE BRANCHES "
echo "=========================================="
echo "📁 Projeto: $(basename "$(git rev-parse --show-toplevel)")"
echo "👤 Usuário: $(git config user.name)"
echo "📍 Branch atual: $(git branch --show-current)"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Verificar se estamos em um repositório Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ ERRO: Este diretório não é um repositório Git!${NC}"
    exit 1
fi

# Determinar branch principal (main ou master)
if git show-ref --verify --quiet refs/heads/main; then
    MAIN_BRANCH="main"
elif git show-ref --verify --quiet refs/heads/master; then
    MAIN_BRANCH="master"
else
    echo -e "${RED}❌ ERRO: Não foi possível encontrar branch principal (main/master)${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📋 1. FAZENDO BACKUP DAS BRANCHES ATUAIS...${NC}"
BACKUP_FILE="backup_branches_$(date +%Y%m%d_%H%M%S).txt"
git branch > "$BACKUP_FILE"
echo "✅ Backup salvo em: $BACKUP_FILE"

echo ""
echo -e "${BLUE}🔄 2. ATUALIZANDO INFORMAÇÕES DO REPOSITÓRIO REMOTO...${NC}"
git fetch --all --prune
echo "✅ Atualização e limpeza de referências remotas concluída!"

echo ""
echo -e "${BLUE}📊 3. MAPEANDO SITUAÇÃO ATUAL...${NC}"
echo ""
echo -e "${CYAN}📂 Todas as branches locais:${NC}"
git branch

echo ""
echo -e "${CYAN}🌐 Branches remotas ativas:${NC}"
git branch -r

echo ""
echo -e "${BLUE}✅ 4. BRANCHES JÁ MERGEADAS (SEGURAS PARA EXCLUSÃO):${NC}"
MERGED_BRANCHES=$(git branch --merged "$MAIN_BRANCH" | grep -v -E "(main|master|\*)" | sed 's/^[ \t]*//')

if [ -z "$MERGED_BRANCHES" ]; then
    echo "🎉 Nenhuma branch local já mergeada encontrada!"
    MERGED_COUNT=0
else
    echo -e "${GREEN}$MERGED_BRANCHES${NC}"
    MERGED_COUNT=$(echo "$MERGED_BRANCHES" | wc -l)
    echo ""
    echo -e "${GREEN}📊 Total: $MERGED_COUNT branch(es) já mergeada(s)${NC}"
fi

echo ""
echo -e "${BLUE}⚠️  5. BRANCHES NÃO MERGEADAS (REVISAR MANUALMENTE):${NC}"
NOT_MERGED_BRANCHES=$(git branch --no-merged "$MAIN_BRANCH" | grep -v -E "(main|master|\*)" | sed 's/^[ \t]*//')

if [ -z "$NOT_MERGED_BRANCHES" ]; then
    echo "✅ Todas as branches locais estão mergeadas!"
    NOT_MERGED_COUNT=0
else
    echo -e "${RED}$NOT_MERGED_BRANCHES${NC}"
    NOT_MERGED_COUNT=$(echo "$NOT_MERGED_BRANCHES" | wc -l)
    echo ""
    echo -e "${RED}📊 Total: $NOT_MERGED_COUNT branch(es) não mergeada(s)${NC}"
    echo ""
    echo -e "${YELLOW}💡 Para analisar uma branch específica, use:${NC}"
    echo "   git log --oneline -10 nome-da-branch"
    echo "   git diff $MAIN_BRANCH..nome-da-branch --stat"
    echo "   git show --name-only nome-da-branch"
fi

echo ""
echo "=========================================="
echo -e "${BLUE}🧹 OPÇÕES DE LIMPEZA${NC}"
echo "=========================================="

if [ $MERGED_COUNT -gt 0 ]; then
    echo -e "${YELLOW}Escolha uma opção:${NC}"
    echo "1) 🗑️  Excluir TODAS as branches já mergeadas automaticamente"
    echo "2) 📋 Apenas listar comandos para exclusão manual"
    echo "3) ❌ Não fazer nenhuma exclusão"
    echo ""
    echo -n "Digite sua escolha (1-3): "
    read -r choice
    
    case $choice in
        1)
            echo ""
            echo -e "${YELLOW}🚨 CONFIRMAÇÃO FINAL${NC}"
            echo "Isso irá excluir permanentemente as seguintes branches:"
            echo -e "${RED}$MERGED_BRANCHES${NC}"
            echo ""
            echo -n "Tem certeza? Digite 'SIM' para confirmar: "
            read -r confirmation
            
            if [ "$confirmation" = "SIM" ]; then
                echo ""
                echo -e "${GREEN}🗑️ Excluindo branches mergeadas...${NC}"
                DELETED_COUNT=0
                
                while IFS= read -r branch; do
                    if [ -n "$branch" ]; then
                        echo "   Excluindo: $branch"
                        if git branch -d "$branch" 2>/dev/null; then
                            ((DELETED_COUNT++))
                        else
                            echo -e "${RED}   ⚠️ Erro ao excluir: $branch${NC}"
                        fi
                    fi
                done <<< "$MERGED_BRANCHES"
                
                echo ""
                echo -e "${GREEN}✅ Limpeza concluída! $DELETED_COUNT branch(es) excluída(s).${NC}"
            else
                echo -e "${YELLOW}ℹ️ Limpeza cancelada pelo usuário.${NC}"
            fi
            ;;
        2)
            echo ""
            echo -e "${CYAN}📋 COMANDOS PARA EXCLUSÃO MANUAL:${NC}"
            echo ""
            while IFS= read -r branch; do
                if [ -n "$branch" ]; then
                    echo "git branch -d $branch"
                fi
            done <<< "$MERGED_BRANCHES"
            echo ""
            echo -e "${CYAN}💡 Ou execute tudo de uma vez:${NC}"
            echo "git branch --merged $MAIN_BRANCH | grep -v -E \"(main|master|\*)\" | xargs -r git branch -d"
            ;;
        3)
            echo -e "${YELLOW}ℹ️ Nenhuma exclusão realizada.${NC}"
            ;;
        *)
            echo -e "${RED}❌ Opção inválida. Nenhuma exclusão realizada.${NC}"
            ;;
    esac
else
    echo "ℹ️ Nenhuma branch disponível para limpeza automática."
fi

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 RELATÓRIO FINAL${NC}"
echo "=========================================="
echo "📊 Branches analisadas:"
echo "   ✅ Mergeadas: $MERGED_COUNT"
echo "   ⚠️  Não mergeadas: $NOT_MERGED_COUNT"
echo ""
echo "📁 Backup salvo em: $BACKUP_FILE"
echo "🕒 Concluído em: $(date '+%d/%m/%Y às %H:%M:%S')"
echo "=========================================="

# Mostrar próximos passos se houver branches não mergeadas
if [ $NOT_MERGED_COUNT -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}📝 PRÓXIMOS PASSOS RECOMENDADOS:${NC}"
    echo "1. Analise cada branch não mergeada individualmente"
    echo "2. Faça merge das que contêm código importante"
    echo "3. Execute este script novamente para limpeza final"
    echo ""
    echo -e "${CYAN}🔧 COMANDOS ÚTEIS PARA ANÁLISE:${NC}"
    while IFS= read -r branch; do
        if [ -n "$branch" ]; then
            echo "# Analisar branch: $branch"
            echo "git log --oneline -5 $branch"
            echo "git diff $MAIN_BRANCH..$branch --name-only"
            echo "echo '---'"
        fi
    done <<< "$NOT_MERGED_BRANCHES"
fi 