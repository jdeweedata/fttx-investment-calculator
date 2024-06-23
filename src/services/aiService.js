import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getLocationResearch(city, municipality, province) {
  const prompt = `Conduct a comprehensive research on ${city}, ${municipality} in ${province}, South Africa. Focus on the following aspects:
  1. Demographics: population size, age distribution, income levels
  2. Number of households
  3. Number and types of businesses
  4. Internet penetration and existing broadband infrastructure
  5. Economic indicators: GDP, major industries, employment rate
  6. Future development plans or projects that might impact FTTx demand
  7. Potential challenges for FTTx deployment in this area
  
  Provide a detailed analysis that would be relevant for an FTTx investment decision. Format your response in clear, well-structured paragraphs with appropriate headings for each main point.`;

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {"role": "system", "content": "You are an AI assistant providing insights for FTTx investment decisions."},
        {"role": "user", "content": prompt}
      ],
      stream: true,
    });

    let result = '';
    for await (const chunk of stream) {
      result += chunk.choices[0]?.delta?.content || '';
    }

    return result.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return `An error occurred while fetching location insights: ${error.message}`;
  }
}

export async function getLocationInsights(city, municipality, province) {
  const prompt = `Provide insights on ${city}, ${municipality} in ${province}, South Africa, focusing on factors relevant to FTTx investment.`;

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {"role": "system", "content": "You are an AI assistant providing insights for FTTx investment decisions."},
        {"role": "user", "content": prompt}
      ],
      stream: true,
    });

    let result = '';
    for await (const chunk of stream) {
      result += chunk.choices[0]?.delta?.content || '';
    }

    return result.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return `An error occurred while fetching location insights: ${error.message}`;
  }
}

export async function getInvestmentAnalysis(inputs, results) {
  const prompt = `Analyze the following FTTx investment opportunity:

Location: ${inputs.city}, ${inputs.municipality}, ${inputs.province}
Total CAPEX: ${results.totalCapex}
Annual Revenue: ${results.annualRevenue}
NPV: ${results.npv}
IRR: ${results.irr}%
Payback Period: ${results.paybackPeriod} years
ROI: ${results.roi}%

Provide a detailed investment analysis and recommendations. Structure your response with clear headings and well-formatted paragraphs for each main point of your analysis.`;

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {"role": "system", "content": "You are a helpful assistant providing investment analysis for FTTx projects."},
        {"role": "user", "content": prompt}
      ],
      stream: true,
    });

    let result = '';
    for await (const chunk of stream) {
      result += chunk.choices[0]?.delta?.content || '';
    }

    return result.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return `An error occurred while fetching investment analysis: ${error.message}`;
  }
}