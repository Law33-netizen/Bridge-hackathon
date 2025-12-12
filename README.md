# Bridge - AI Paperwork Assistant

Bridge is an AI-powered web application designed to help immigrant families navigate complex official paperwork. 

Using **Google Gemini 2.5 Flash**, it translates documents into the user's native language, summarizes key actions, detects deadlines, and allows users to chat with the document to ask clarifying questions.

## 🚀 Features
- **Instant Translation:** Converts PDFs/Images into semantic HTML while preserving layout.
- **Smart Summary:** Extracts "Things to Do," "Deadlines," and "Costs" automatically.
- **AI Chat Assistant:** Users can ask questions like "Do I need to pay this?" in their native language.
- **Multi-language Support:** Supports Spanish, Chinese, Vietnamese, Tagalog, and more.

## 🛠️ How I built it
- **Frontend:** React + TypeScript + Tailwind CSS
- **AI Model:** Google Gemini 2.5 Flash (Multimodal capabilities)
- **API:** Google GenAI SDK

## 💡 Inspiration
Navigating bureaucracy is hard enough; doing it in a second language is overwhelming. Bridge aims to close that gap.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1-wBwIUGU8an5i987z38m1XPePvSW2Rwx

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
