export async function POST(request) {
  try {
    const { base64Data, mediaType } = await request.json();

    if (!base64Data || !mediaType) {
      return Response.json({ error: 'Missing base64Data or mediaType' }, { status: 400 });
    }

    const isPdf = mediaType === 'application/pdf';

    const contentBlock = isPdf
      ? {
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: base64Data,
          },
        }
      : {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64Data,
          },
        };

    const body = {
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      system:
        'You are analyzing a commercial building floor plan for a demolition and junk removal contractor. Identify every item that would need to be demolished or hauled away, organized by floor. For each item extract: floor, category (one of: Flooring, Drywall/Walls, Ceiling, Cabinetry, Doors, Windows, Fixtures, Other), description, qty as a number, unit (sq ft, linear ft, or units). Return ONLY a valid JSON array, no markdown, no explanation.',
      messages: [
        {
          role: 'user',
          content: [
            contentBlock,
            {
              type: 'text',
              text: 'Analyze this blueprint and return the demolition line items as a JSON array.',
            },
          ],
        },
      ],
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'pdfs-2024-09-25',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return Response.json({ error: 'Anthropic API request failed', detail: err }, { status: response.status });
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text ?? '';

    let items;
    try {
      items = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\[[\s\S]*\]/);
      if (match) {
        items = JSON.parse(match[0]);
      } else {
        return Response.json({ error: 'Failed to parse JSON from model response', raw: rawText }, { status: 500 });
      }
    }

    return Response.json({ items });
  } catch (err) {
    console.error('analyze route error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
