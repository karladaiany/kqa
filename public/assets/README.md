# 📸 Como Adicionar sua Imagem de Avatar

## Passos para adicionar sua foto:

1. **Prepare sua imagem:**

    - Formato recomendado: JPG, PNG ou WebP
    - Tamanho ideal: 200x200 pixels (quadrada)
    - Nome do arquivo: `karla-avatar.jpg`

2. **Adicione a imagem:**

    - Coloque o arquivo nesta pasta: `public/assets/`
    - O caminho final deve ser: `public/assets/karla-avatar.jpg`

3. **A imagem aparecerá automaticamente em:**
    - Footer do site (avatar grande)
    - Badge discreto no header (avatar pequeno)
    - README.md do projeto

## 🎨 Dicas de Edição:

-   Use uma foto com boa iluminação
-   Prefira fundo neutro ou transparente
-   Certifique-se de que seu rosto esteja centralizado
-   Evite imagens muito pesadas (máximo 500KB)

## 🔄 Fallback Automático:

Se a imagem não carregar, o sistema automaticamente mostrará suas iniciais "KD" em um círculo colorido com o tema do site.

## 📝 Personalizando Informações:

Para alterar nome, cargo ou links sociais, edite os arquivos:

-   `src/components/Footer.jsx`
-   `src/components/CreatorBadge.jsx`
-   `README.md`
