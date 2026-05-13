export async function POST(request) {
  try {
    const { projectName, items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'No items provided' }, { status: 400 });
    }

    const itemsList = items
      .map((item) => `- Floor: ${item.floor} | Category: ${item.category} | ${item.description} | ${item.qty} ${item.unit}`)
      .join('\n');

    const prompt = `You are a professional demolition contractor writing a Statement of Work document.

Project Name: ${projectName || 'Commercial Demo Project'}

Selected demolition line items:
${itemsList}

Write a professional contractor Statement of Work with these sections:
1. Project Overview
2. Scope of Work (organized by floor)
3. Key Assumptions
4. Exclusions

Use clear, professional contractor language. Be specific about quantities and materials.`;

    const body = {
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return Response.json({ error: 'Anthropic API request failed', detail: err }, { status: response.status });
    }

    const data = await response.json();
    const sow = data.content?.[0]?.text ?? '';

    return Response.json({ sow });
  } catch (err) {
    console.error('generate-sow route error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
