import { NextRequest, NextResponse } from 'next/server';

const MAX_FILES = 10;
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const sanitizeText = (value: FormDataEntryValue | null): string =>
  typeof value === 'string' ? value.trim() : '';

const stripHtml = (text: string): string => text.replace(/<[^>]*>/g, '');

const isSafeText = (value: string, max = 12000): boolean =>
  value.length > 0 && value.length <= max;

async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string
): Promise<{ ok: true; messageId: number } | { ok: false; error: string }> {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  });

  const data = await response.json();
  if (!response.ok || !data?.ok) {
    return { ok: false, error: data?.description || 'Failed to send Telegram message' };
  }

  return { ok: true, messageId: Number(data?.result?.message_id || 0) };
}

async function sendTelegramFile(
  botToken: string,
  chatId: string,
  file: File
): Promise<{ ok: true } | { ok: false; error: string }> {
  const body = new FormData();
  body.append('chat_id', chatId);

  const isImage = file.type.startsWith('image/');
  if (isImage) {
    body.append('photo', file, file.name);
  } else {
    body.append('document', file, file.name);
  }

  const method = isImage ? 'sendPhoto' : 'sendDocument';
  const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: 'POST',
    body,
  });

  const data = await response.json();
  if (!response.ok || !data?.ok) {
    return { ok: false, error: data?.description || 'Failed to send Telegram file' };
  }

  return { ok: true };
}

export async function POST(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Telegram is not configured on server. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.',
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const formTypeTitle = sanitizeText(formData.get('formTypeTitle'));
    const answersMarkdown = sanitizeText(formData.get('answersMarkdown'));
    const howLearned = sanitizeText(formData.get('howLearned'));
    const recommendationName = sanitizeText(formData.get('recommendationName'));
    const contactSummary = sanitizeText(formData.get('contactSummary'));

    if (!isSafeText(formTypeTitle, 120) || !isSafeText(answersMarkdown)) {
      return NextResponse.json(
        { success: false, error: 'Validation failed: invalid form payload.' },
        { status: 400 }
      );
    }

    if (!isSafeText(howLearned, 120)) {
      return NextResponse.json(
        { success: false, error: 'Validation failed: source field is required.' },
        { status: 400 }
      );
    }

    if (!isSafeText(contactSummary, 500)) {
      return NextResponse.json(
        { success: false, error: 'Validation failed: contact data is required.' },
        { status: 400 }
      );
    }

    if (howLearned === 'По рекомендации' && !isSafeText(recommendationName, 200)) {
      return NextResponse.json(
        { success: false, error: 'Validation failed: recommendation name is required.' },
        { status: 400 }
      );
    }

    const files = formData
      .getAll('files')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `Validation failed: maximum ${MAX_FILES} files allowed.` },
        { status: 400 }
      );
    }

    if (files.some((file) => file.size > MAX_FILE_SIZE_BYTES)) {
      return NextResponse.json(
        { success: false, error: 'Validation failed: one or more files exceed 50MB.' },
        { status: 400 }
      );
    }

    const answersText = stripHtml(answersMarkdown).slice(0, 3000);

    let message = `<b>Новая анкета</b>\n`;
    message += `<b>Тип анкеты:</b> ${escapeHtml(formTypeTitle)}\n\n`;
    message += `<b>Ответы пользователя:</b>\n${escapeHtml(answersText)}\n\n`;
    message += `<b>Откуда узнали:</b> ${escapeHtml(howLearned)}\n`;
    if (howLearned === 'По рекомендации' && recommendationName) {
      message += `<b>Рекомендовал:</b> ${escapeHtml(recommendationName)}\n`;
    }
    message += `\n<b>Контакт пользователя:</b>\n${escapeHtml(contactSummary)}`;

    const sendResult = await sendTelegramMessage(botToken, chatId, message);
    if (!sendResult.ok) {
      return NextResponse.json({ success: false, error: sendResult.error }, { status: 502 });
    }

    if (files.length > 0) {
      for (const file of files) {
        const fileResult = await sendTelegramFile(botToken, chatId, file);
        if (!fileResult.ok) {
          return NextResponse.json({ success: false, error: fileResult.error }, { status: 502 });
        }
      }
    }

    return NextResponse.json({ success: true, messageId: sendResult.messageId });
  } catch (error) {
    console.error('Send form API error:', error);
    return NextResponse.json(
      { success: false, error: 'Unexpected server error while sending form.' },
      { status: 500 }
    );
  }
}

