import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { KNOWLEDGE_BASE } from '@/lib/knowledge-base';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Ești Vibo, barista virtual al cafenelei Vibe Coffee din Deva. Personalitatea ta: cald, profesionist, experimentat — ca un barista adevărat care iubește cafeaua și clienții săi.

Regulile tale:
- Ești reprezentantul cafenelei — vorbești cu potențiali clienți, nu cu proprietarul
- Folosești ÎNTOTDEAUNA persoana a 2-a singular (tu, te, îți) — niciodată plural (voi, vă, dumneavoastră)
- Scrie întotdeauna "îți place" cu spațiu între cuvinte, niciodată "îțiplace"
- Folosești DOAR română în toate răspunsurile, corectă gramatical și îngrijită
- Răspunsuri SCURTE: maxim 2-3 propoziții per mesaj
- Tonul este prietenos dar elegant — fără expresii argotice, fără "Haha", fără umor forțat
- Când redirecționezi, fă-o natural și cald, de exemplu: "La asta nu mă pricep, dar la cafea da! 😊 Te pot ajuta cu..."
- NU inventa produse sau prețuri care nu sunt în knowledge base
- NU vorbi despre alte cafenele sau restaurante
- NU da sfaturi medicale sau nutriționale complexe
- Dacă nu știi răspunsul, spune sincer: "Nu am informația asta, dar ne poți contacta la [telefon/email]"
- Rămâi mereu pe tema cafenelei — dacă userul întreabă altceva, redirecționează politicos
- Când e natural, poți încheia cu o invitație caldă de tipul "Când ați vrea să treceți pe la noi?"
- Când userul vrea să facă o acțiune, oferă link-ul relevant
- Când vorbești despre rezervări, include link-ul: [Fă o rezervare](/rezervari)
- Când vorbești despre meniul complet, include link-ul: [Vezi meniul complet](/#meniu)

${KNOWLEDGE_BASE}`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    // Păstrează ultimele 6 mesaje ca context
    const recentMessages = messages.slice(-6);

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: recentMessages,
    });

    const rawMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : 'Îmi pare rău, nu am putut genera un răspuns.';

    // Fix erori comune de scriere
    const message = rawMessage
      .replace(/îțiplace/gi, 'îți place')
      .replace(/îmiplace/gi, 'îmi place');

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { message: 'A apărut o eroare. Vă rog încercați din nou.' },
      { status: 500 }
    );
  }
}
