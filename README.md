# 🤖 VideoMaker Bot - Automação de Vídeos para o YouTube

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Node.js](https://img.shields.io/badge/Node.js-Require-green)
![FFmpeg](https://img.shields.io/badge/FFmpeg-Required-blue)
![ImageMagick](https://img.shields.io/badge/ImageMagick-Required-orange)

Bem-vindo ao **VideoMaker**, um projeto de código aberto focado em automatizar 100% o processo de criação de vídeos para o YouTube. A partir de um simples termo de pesquisa, o sistema busca textos na Wikipedia, sintetiza o conteúdo, faz o download de imagens relacionadas, edita um vídeo completo com música de fundo e efeitos de transição, e faz o upload automático para o seu canal do YouTube!

🎬 **Veja o projeto em ação!** Dá uma olhada no vídeo sobre **Churrasco** que este robô gerou de forma totalmente autônoma. Acesse o meu canal do YouTube para conferir o resultado:
👉 [[Link para o meu Canal no YouTube](https://youtu.be/69XNmRz-Gbs)]

---

## 📜 A Evolução do Projeto (A História)

Este projeto passou por diversas iterações para chegar ao seu estado atual de independência e eficiência. 

**As Ideias Iniciais:**
No começo do desenvolvimento, o fluxo dependia fortemente de serviços pagos ou com limites rígidos. Utilizávamos o **Algorithmia** para o processamento e resumo dos textos e o **Google Search Engine API** (junto com o Custom Search JSON API) para buscar imagens no Google. Embora funcionasse, criava uma dependência de chaves de API difíceis de configurar para novos usuários e que se esgotavam rapidamente.

**O Estado Atual (A Revolução):**
Para tornar o projeto mais acessível, rápido e robusto, reformulamos os motores ("robôs"):
1. **Busca de Texto:** Agora consumimos a **API direta da Wikipedia**, trazendo o conteúdo puro e gratuito.
2. **Inteligência Artificial (NLU):** Integramos o **IBM Watson** para analisar as frases e extrair as palavras-chave mais precisas (Keywords).
3. **Banco de Imagens:** Trocamos o Google Search pela **API do Pexels**, garantindo imagens de alta resolução, gratuitas e livres de direitos autorais.
4. **Edição de Vídeo:** Deixamos dependências externas complexas de lado e abraçamos o **FFmpeg** em conjunto com o **GraphicsMagick**. Agora, o vídeo é renderizado localmente, com efeitos de blur, fade, overlay de textos e trilha sonora sincronizada.

---

## ⚙️ Pré-requisitos do Sistema

Antes de baixar os pacotes do Node.js, você **precisa** instalar alguns softwares no seu sistema operacional, pois o robô de imagem e de vídeo dependem deles para funcionar:

1. **Node.js** (Ambiente de execução JavaScript)
2. **ImageMagick** ou **GraphicsMagick** (Necessário para a biblioteca `gm` processar, redimensionar e escrever textos nas imagens).
3. **FFmpeg** (O "motor" responsável por juntar imagens, textos e áudio em um arquivo `.mp4`).

---

## 📦 Bibliotecas Utilizadas (Dependencies)

Para fazer tudo isso funcionar, o projeto utiliza as seguintes bibliotecas via NPM (que você deve baixar usando `npm install`):

* `readline-sync`: Permite criar interfaces interativas no terminal para o usuário digitar o tema do vídeo.
* `axios`: Cliente HTTP poderoso usado para fazer requisições para a Wikipedia e para a API do Pexels.
* `sbd` *(Sentence Boundary Detection)*: Inteligência para quebrar textos gigantes em frases menores e coerentes.
* `ibm-watson`: SDK oficial da IBM para nos conectarmos ao Natural Language Understanding (extração de palavras-chave).
* `image-downloader`: Utilitário simples e direto para baixar os arquivos de imagem das URLs do Pexels para a nossa máquina.
* `gm`: Wrapper para o GraphicsMagick. Usado para tratar as imagens baixadas (adicionar fundo desfocado, redimensionar) e gerar imagens transparentes contendo as legendas.
* `express`: Usado pontualmente no robô do YouTube para subir um servidor local temporário (localhost:5000) e capturar o token de autenticação do Google (OAuth2).
* `googleapis`: SDK oficial do Google para nos conectarmos à API do YouTube, subir o arquivo de vídeo e definir título, tags e descrição.

---

## 🗂️ Arquitetura e Entendendo os Arquivos

O projeto é dividido em **Robôs** pequenos, onde cada um tem uma responsabilidade única. O estado do projeto flui entre eles através do arquivo `state.js`.

* **`index.js` (O Maestro):** É o ponto de entrada. Ele orquestra a chamada de todos os robôs de forma sequencial (síncrona).
* **`state.js`:** Gerencia o estado da aplicação salvando a estrutura de dados (frases, imagens, URLs) em um arquivo físico `content.json`. Isso permite que você pare a execução do bot em qualquer etapa e retome depois sem perder os dados já processados.
* **`robots/input.js`:** Faz as perguntas iniciais ao usuário via terminal (ex: "Qual termo você quer pesquisar na Wikipedia?").
* **`robots/text.js`:** Vai até a Wikipedia, baixa o artigo, limpa o texto (remove marcações e datas), quebra tudo em pequenas frases (limite de 7 frases) e manda essas frases para o IBM Watson para descobrir do que cada uma se trata.
* **`robots/image.js`:** Pega as palavras-chave geradas pelo Watson e pesquisa imagens no Pexels. Em seguida, faz o download delas para a pasta `content/`.
* **`robots/video.js`:** A estrela do projeto. Ele converte as imagens (adicionando um fundo desfocado para manter a proporção 1920x1080), gera as imagens de texto (legendas), e chama o FFmpeg para juntar as imagens, aplicar efeitos de *fade in/out*, e adicionar a música (`music.mp3`).
* **`robots/youtube.js`:** Autentica o usuário com o Google via OAuth2, pega o `.mp4` gerado, cria título, tags e descrição baseados no conteúdo, e faz o upload automático do vídeo e da thumbnail (capa) para o YouTube.

---

## 🔑 Configurando as Credenciais (O que você precisa fazer)

Para rodar este projeto na sua máquina, você precisa das suas próprias chaves de API. Crie uma pasta chamada `credentials/` na raiz do projeto e adicione os seguintes arquivos:

### 1. `watson-nlu.json`
Crie uma conta na [IBM Cloud](https://cloud.ibm.com/), instancie o serviço **Natural Language Understanding** e pegue as credenciais. O arquivo deve ficar assim:
```json
{
  "apikey": "SUA_API_KEY_AQUI",
  "url": "SUA_URL_AQUI"
}
```

### 2. `pexels.json`
Crie uma conta no Pexels e gere uma chave de API para desenvolvedores.

```json
{
  "apiKey": "SUA_API_KEY_AQUI"
}
```

### 3. `google-youtube.json`
Vá até o Google Cloud Console, crie um projeto, ative a YouTube Data API v3. Depois, crie credenciais do tipo OAuth 2.0 Client IDs (selecione a opção "Aplicativo da Web" com URI de redirecionamento http://localhost:5000/oauth2callback). Baixe o JSON gerado, renomeie para google-youtube.json e coloque na pasta.

---

## 🚀 Como Rodar o Projeto Passo a Passo

Siga este roteiro rigorosamente para ver a mágica acontecer:

### 1. Clone o repositório:

```Bash
git clone https://github.com/BernardoSantDev/VideoMaker.git
cd VideoMaker
```

### 2. Instale as dependências Node:

```Bash
npm install
```

### 3. Prepare a trilha sonora:

Você precisa colocar um arquivo de música chamado `music.mp3` dentro da pasta raiz `content/`. (Caso a pasta `content/` não exista, crie-a manualmente ou rode o robô de input/text primeiro para que ele crie).

### 4. Inicie o Bot:

```Bash
node index.js
```

### 5. Interação e Autenticação:

* O terminal vai pedir um termo para pesquisar. Digite, por exemplo, `Churrasco`.
* Escolha o prefixo da pesquisa (ex: `O que é`).
* O robô vai baixar o texto, processar imagens e renderizar o vídeo localmente (Isso pode demorar alguns minutos dependendo do seu computador, pois o FFmpeg exige processamento).
* No final, o terminal vai exibir um link do Google (`Please give your consent`). Clique nele, faça login com sua conta do YouTube, autorize o aplicativo e feche a aba.
* Pronto! O vídeo será upado e o terminal vai te devolver o Link do vídeo recém-criado!

---

## Nota sobre a Thumbnail (Capa do YouTube) ⚠️

O código já está preparado para subir a capa personalizada (`youtube-thumbnail.jpg`). Porém, o YouTube exige que seu canal tenha recursos avançados ativados (verificação por telefone, etc.) para aceitar uploads de thumbnails via API. Se o seu canal não tiver essa permissão, o robô exibirá um aviso de segurança, mas o vídeo será upado normalmente com uma capa automática gerada pelo próprio YouTube.

---

***Desenvolvido com café e muito código por Bernardo Silva Sant Ana de Oliveira! Se você curtiu o projeto, não esquece de deixar uma ⭐ no repositório e se inscrever no canal!***
