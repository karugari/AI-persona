# 🤖AI Persona Chatbot
私のスキル、経験、ビジョンを対話形式で紹介するインタラクティブなAIポートフォリオです。

🔗**[Live Demoはこちら (AI Persona Chatbot)](https://ai-persona-nu.vercel.app/)**

## 📌プロジェクト紹介
このプロジェクトは、フロントエンドエンジニアとしてのポートフォリオのために制作された、対話型の自己紹介ウェブアプリケーションです。Google Gemini API を活用し、私の履歴書、技術スタック、そして開発に対する情熱を AI に学習させました。

## 🛠開発環境
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
* **Backend / Deploy:** Vercel Serverless Functions (Node.js)
* **AI / API:** Google Generative AI SDK (`@google/generative-ai`)

## ✨ 主要機能とアピールポイント

### 1. セキュアなアーキテクチャ (Security Consideration)
* **APIキーの完全隠蔽:** 静的ウェブサイトの弱点であるAPIキーの露出を防ぐため、**Vercel API Routes** を用いて独自のバックエンドプロキシを構築。クライアント側には一切キーを露出させないセキュアな通信を実現しました。

### 2. カスタマイズされた人格 (Custom Persona)
* 最先端の `gemini-2.5-flash` モデルに、私の実体験（ワーキングホリデーでの挑戦、毎日のコーディングチャレンジなど）をプロンプトエンジニアリングによって学習させ、まるで私本人と面接しているかのような体験を提供します。
* **関心の分離 (Separation of Concerns):** ペルソナ設定のプロンプトを独立したモジュール（`persona.js`）に分離し、将来的な設定変更にも強い、保守性の高いコード構造を意識しました。

### 3. 文脈の維持 (Context Memory)
* 単発の質問応答ではなく、これまでの対話履歴（`chatHistory`）を配列として管理・送信することで、人間のような文脈に沿った自然なチャットが可能です。

### 4. UXを追求したUI設計 (UX-Focused Design)
* **Quick Reply Buttons:** 面接官の利便性を考慮し、「自己紹介」「強み」「技術スタック」など頻出の質問をワンクリックで送信できるサジェストUIを実装。
* **シームレスなスクロール体験:** モバイルアプリのような洗練された見た目を目指し、スクロール機能は維持したまま、視覚的にノイズとなるデフォルトのスクロールバーをCSS（`::-webkit-scrollbar`等）で非表示にしています。
