# 🤖AI Persona
面接官のための「私」を学習した AI チャットボット
## 📌プロジェクト紹介
このプロジェクトは、フロントエンドエンジニアとしてのポートフォリオのために制作された、対話型の自己紹介ウェブアプリケーションです。Google Gemini API を活用し、私の履歴書、技術スタック、そして開発に対する情熱を AI に学習させました。

## 🛠開発環境
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
* **AI / API:** Google Generative AI SDK (`@google/generative-ai`)

## ✨主要機能
Custom Persona (カスタマイズされた人格): gemini-2.5-flash モデルに、私の実体験（ワーキングホリデー、100日コーディングチャレンジなど）を事前学習させ、まるで私本人と直接対話しているような体験を提供します。

Context Memory (文脈の維持): 単発の質問ではなく、以前の対話内容を記憶し、文脈に沿った自然なチャットが可能です（startChat History の活用）。

Quick Reply Buttons (おすすめ質問 UI): 面接官の利便性を考慮し、「自己紹介」「志望動機」「強み」など、頻出の質問をボタン化してワンクリックで質問できる UX を構築しました。

Security Consideration (セキュリティ対策): サーバーレス（静的ウェブ）環境での API Key 露出を防ぐため、ユーザーが直接 Key を入力してセッションを生成する方式を採用し、セキュリティに配慮しました。
