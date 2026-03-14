import { NextRequest, NextResponse } from 'next/server';

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

    const body = (await request.json()) as { messageId?: number };
    const messageId = Number(body?.messageId);

    if (!Number.isInteger(messageId) || messageId <= 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed: invalid messageId.' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/deleteMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data?.ok) {
      return NextResponse.json(
        { success: false, error: data?.description || 'Failed to delete message.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete message API error:', error);
    return NextResponse.json(
      { success: false, error: 'Unexpected server error while deleting message.' },
      { status: 500 }
    );
  }
}

