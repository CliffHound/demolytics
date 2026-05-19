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
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system:
        'You are analyzing a commercial building floor plan for a demolition and junk removal contractor. Identify every item that would need to be demolished or hauled away, organized by floor. For each item extract: floor (string), category (one of: Flooring, Drywall/Walls, Ceiling, Cabinetry, Doors, Windows, Fixtures, Other), description (string), qty (number), unit (sq ft, linear ft, or units). You MUST return ONLY a raw JSON array. No markdown, no code blocks, no backticks, no explanation. Just the JSON array.',
      messages: [
        {
          role: 'user',
          content: [
            contentBlock,
            {
              type: 'text',
              text: 'Analyze this blueprint. Return ONLY a raw JSON array of demolition items. Example format: [{"floor":"1","category":"Flooring","description":"Ceramic tile","qty":450,"unit":"sq ft"}]. Output nothing else.',
            },
          ],
        },
      ],
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    };

    if (isPdf) {
      headers['anthropic-beta'] = 'pdfs-2024-09-25';
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return Response.json({ error: 'Anthropic API request failed', detail: err }, { status: response.status });
    }

    const data = await response.json();
    const rawText = (data.content?.[0]?.text ?? '').trim();

    console.log('Raw model response (first 300 chars):', rawText.substring(0, 300));

    // Strip markdown code fences if present
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let items;
    try {
      items = JSON.parse(cleaned);
    } catch {
      // Try to extract a JSON array from anywhere in the text
      const match = cleaned.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          items = JSON.parse(match[0]);
        } catch {
          console.error('JSON extract failed. Raw:', rawText.substring(0, 500));
          return Response.json({
            error: 'Failed to parse JSON from model response',
            raw: rawText.substring(0, 500),
          }, { status: 500 });
        }
      } else {
        console.error('No JSON array found. Raw:', rawText.substring(0, 500));
        return Response.json({
          error: 'Failed to parse JSON from model response',
          raw: rawText.substring(0, 500),
        }, { status: 500 });
      }
    }

    if (!Array.isArray(items)) {
      return Response.json({ error: 'Model did not return an array', raw: rawText.substring(0, 500) }, { status: 500 });
    }

    return Response.json({ items });
  } catch (err) {
    console.error('analyze route error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
