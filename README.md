# Bridge - AI Paperwork Assistant

<img width="2048" height="2048" alt="Gemini_Generated_Image_dmexyodmexyodmex" src="https://github.com/user-attachments/assets/e02423ce-a111-4475-8c3c-ec1310c6e508" />


Bridge is an AI-powered accessibility tool designed to help immigrant families navigate complex bureaucracy. It uses Google Gemini 2.5 Flash to transform dense, official documents (PDFs/Images) into clear, translated, and interactive web pages.
1. Core Architecture

    Frontend: React 19, TypeScript, Tailwind CSS.

    AI Engine: Google Gemini 2.5 Flash (via @google/genai SDK).

    Data Flow: The application sends raw binary data (images/PDFs) directly to Gemini's multimodal API and receives a structured JSON response containing both a semantic HTML translation and extracted metadata.

2. Feature Deep Dive: "Same-Format" Translation

Bridge does not merely output a block of translated text; it reconstructs the document's original visual structure using semantic HTML.
How it works:

    Multimodal Analysis: The gemini-2.5-flash model analyzes the visual layout of the uploaded file.

    Semantic Reconstruction: instead of returning plain text, the system instruction (constants.ts) forces the model to generate a full HTML string.

        It maps document headers to <h1>-<h6> tags.

        It preserves data grids by converting them into HTML <table> structures.

        It maintains lists using <ul> and <ol> tags.

    Visual Consistency: The application applies a custom typography layer (.prose in index.html) that mimics the density and spacing of official documents. This ensures that when a user sees the translated version, it "looks" like the original form, reducing cognitive dissonance.

Accuracy Note: The system instruction explicitly commands the model to keep specific entities (dates, monetary amounts, addresses, and IDs) exactly as written to prevent hallucination of critical data points.
3. Feature Deep Dive: Interactive Action Highlighting (The "Hover" Feature)

This is the application's standout feature. It bridges the gap between knowing what to do and finding where to do it on the form.
The Mechanism:

    Prompt Engineering: The system instruction contains a "Critical Highlighting Instruction".

        It asks Gemini to identify specific actionable fields (e.g., "Signature", "Total Due", "Case Number").

        Gemini wraps these specific text elements in the generated HTML with a span tag: <span class="action-highlight" id="action-ref-N">, where N corresponds to the index of the action item in the summary list.

    State Synchronization:

        In SummaryView.tsx, when a user hovers over an item in the "Things to Do" list, it triggers an event passing the index N.

        In TranslationView.tsx, a DOM query finds the matching #action-ref-N element within the translated HTML.

    Visual Feedback:

        The CSS (index.html) applies an .active class to the target span, giving it a high-contrast yellow background (#fef08a) and a sharp outline (#ca8a04).

        Auto-Scroll: If the relevant field is off-screen, the application automatically smooth-scrolls the document to center the highlighted field for the user.

Safety Protocol: The prompt includes a "60% Rule" and "Negative Constraint." If Gemini is not at least 60% sure a specific text label matches the action, it is instructed not to add the highlight tag. This prevents misleading the user by highlighting unrelated text.
4. Smart Summary Extraction

The application parses the document into a structured JSON object (types.ts -> Summary) focusing on four specific anxiety-reducing categories:

    Purpose: A 1-3 sentence explanation in simple language (e.g., "This is a bill for your electricity usage...").

    Actions: A concrete list of steps (e.g., "Sign and date at the bottom").

    Deadlines: Extracted dates are normalized and listed clearly.

    Costs: Any mentioned fees are isolated to ensure the user knows financial obligations immediately.

5. Context-Aware AI Chat

The application includes a ChatAssistant that is fully grounded in the document context.

    Context Injection: When a user asks a question, the app sends the entire extracted summary and the translated HTML text as context to Gemini.

    Guardrails: The system prompt (services/geminiService.ts) restricts the AI to answering only based on the provided document, preventing it from giving generic or potentially incorrect legal advice found on the open web.

    Multilingual Fluency: The chat automatically detects the current target language and responds in that language (e.g., if the user selected Vietnamese, the chat assistant replies in Vietnamese), supported by "Quick Prompts" (constants.ts) pre-translated into 12 languages.

## 💻 How to Run Locally

1. **Clone the repository** or download the source code.
2. **Install dependencies:**
   ```bash
   npm install
Set up your API Key:

    Create a file named .env in the root folder.

    Add your key: API_KEY=your_google_gemini_key_here

Start the app:
code Bash

    
npm run dev


<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
