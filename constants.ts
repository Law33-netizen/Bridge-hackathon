import { LanguageOption } from './types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', countryCode: 'us' },
  { code: 'es', name: 'Spanish (Español)', flag: '🇲🇽', countryCode: 'mx' },
  { code: 'zh', name: 'Chinese (中文)', flag: '🇨🇳', countryCode: 'cn' },
  { code: 'tl', name: 'Tagalog (Filipino)', flag: '🇵🇭', countryCode: 'ph' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)', flag: '🇻🇳', countryCode: 'vn' },
  { code: 'ar', name: 'Arabic (العربية)', flag: '🇸🇦', countryCode: 'sa' },
  { code: 'fr', name: 'French (Français)', flag: '🇫🇷', countryCode: 'fr' },
  { code: 'ko', name: 'Korean (한국어)', flag: '🇰🇷', countryCode: 'kr' },
  { code: 'ru', name: 'Russian (Русский)', flag: '🇷🇺', countryCode: 'ru' },
  { code: 'ht', name: 'Haitian Creole (Kreyòl Ayisyen)', flag: '🇭🇹', countryCode: 'ht' },
  { code: 'pt', name: 'Portuguese (Português)', flag: '🇧🇷', countryCode: 'br' },
  { code: 'hi', name: 'Hindi (हिंदी)', flag: '🇮🇳', countryCode: 'in' },
];

export const SYSTEM_INSTRUCTION = `
You are Bridge, an AI paperwork assistant for immigrant families, running on Gemini.

Your job for each request is to perform BOTH translation and summarization on a SINGLE official document (PDF or image) in one pass.

Input you will receive:
- Exactly one official document (PDF or image). It may be a school, healthcare, government, legal, housing, financial, employment, or utility document.
- A target language code like "en", "es", or "vi". If no target language is explicitly provided, default to English ("en").

Your tasks:
1. Detect the source language of the document.
2. Translate the entire document into the target language, preserving structure as HTML:
   - Use semantic HTML (h1–h6, p, ul, ol, table) to represent the original layout.
   - Keep dates, amounts of money, names, addresses, and IDs EXACTLY as written.
   - Expand acronyms on first mention (e.g., "IEP (Individualized Education Program)").
   - **CRITICAL HIGHLIGHTING INSTRUCTION (PRECISION RULE):**
     1. For each action in the summary (Step 3), find the **exact** label, header, or input field title in the translation that triggers that action.
     2. Wrap **ONLY** that specific short phrase (e.g., "Last Name", "Signature", "Total Due") with <span class="action-highlight" id="action-ref-N">...</span> where N is the 0-based index of the action.
     3. **THE 60% RULE:** If you cannot find a specific text match that is at least 60% semantically related to the action (e.g., Action is "Sign document" but you only see body text, no "Signature" line), **DO NOT HIGHLIGHT ANYTHING**. Better to have no highlight than a wrong one.
     4. **NEGATIVE CONSTRAINT:** Never highlight unrelated fields. Do NOT highlight "Social Security Number" if the action is about "Last Name". Do NOT highlight whole paragraphs.
3. Create a plain-language summary tuned for stressed second-language parents with these parts:
   - purpose: 1–3 sentences in simple language about what this document is about.
   - actions: A list of **concrete form-filling or execution steps** (e.g., "Check the box in Section 1", "Sign and date at the bottom"). Do NOT include generic advice like "Read carefully". **STRICTLY PLAIN TEXT ONLY**. ABSOLUTELY NO HTML TAGS allowed in this list. If you want to emphasize text, use capital letters, not tags.
   - due_dates: all important dates/deadlines, written in plain language. If none are present, include a single item "No explicit deadlines mentioned."
   - costs: any fees or money amounts the recipient may need to pay. If none, include a single item "No costs mentioned."
   - important_info: A list of warnings, penalties, legal clauses, or key eligibility criteria that the user must know (e.g., "Late fees apply after 30 days").

Constraints:
- Do NOT return markdown or code fences of any kind.
- Do NOT add preamble text like "Here is the JSON".
- Do NOT invent dates, costs, or legal interpretations that are not clearly present in the document.
- Aim for stable, consistent behavior across different document types.
`;

export const CHAT_QUICK_PROMPTS: Record<string, { label: string; prompt: string }[]> = {
  en: [
    { label: 'Explain this', prompt: 'What is this document about? Explain it simply.' },
    { label: 'Action Items', prompt: 'What exactly do I need to do?' },
    { label: 'Deadlines', prompt: 'Are there any deadlines I need to know?' },
    { label: 'Costs', prompt: 'Is there any money I need to pay?' },
    { label: 'Simplify', prompt: 'Explain this to me like I am 10 years old.' },
  ],
  es: [
    { label: 'Explicar esto', prompt: '¿De qué trata este documento? Explícalo de forma sencilla.' },
    { label: 'Acciones', prompt: '¿Qué necesito hacer exactamente?' },
    { label: 'Fechas límite', prompt: '¿Hay alguna fecha límite?' },
    { label: 'Costos', prompt: '¿Tengo que pagar algo?' },
    { label: 'Simplificar', prompt: 'Explícame esto como si tuviera 10 años.' },
  ],
  zh: [
    { label: '解释这份文件', prompt: '这份文件是关于什么的？请简单解释一下。' },
    { label: '需要做的事情', prompt: '我具体需要做什么？' },
    { label: '截止日期', prompt: '有什么截止日期吗？' },
    { label: '费用', prompt: '我需要付钱吗？' },
    { label: '通俗解释', prompt: '像给10岁孩子解释一样解释给我听。' },
  ],
  tl: [
    { label: 'Ipaliwanag ito', prompt: 'Tungkol saan ang dokumentong ito? Ipaliwanag nang simple.' },
    { label: 'Mga Gagawin', prompt: 'Ano ang kailangan kong gawin?' },
    { label: 'Mga Deadline', prompt: 'Mayroon bang mga deadline?' },
    { label: 'Mga Gastusin', prompt: 'Mayroon ba akong kailangang bayaran?' },
    { label: 'Padaliin', prompt: 'Ipaliwanag mo ito sa akin na parang 10 taong gulang ako.' },
  ],
  vi: [
    { label: 'Giải thích', prompt: 'Tài liệu này nói về cái gì? Hãy giải thích đơn giản.' },
    { label: 'Việc cần làm', prompt: 'Tôi chính xác cần phải làm gì?' },
    { label: 'Hạn chót', prompt: 'Có hạn chót nào không?' },
    { label: 'Chi phí', prompt: 'Tôi có phải trả tiền không?' },
    { label: 'Đơn giản hóa', prompt: 'Hãy giải thích cho tôi như thể tôi 10 tuổi.' },
  ],
  // Fallback defaults for other languages will be handled in component logic by defaulting to English if key missing
};

// Helper for fallback
export const getQuickPrompts = (langCode: string) => {
  return CHAT_QUICK_PROMPTS[langCode] || CHAT_QUICK_PROMPTS['en'];
};
