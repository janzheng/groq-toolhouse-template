// joke.js
// Simple script to call the public Toolhouse joke agent

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const AGENT_ID = 'd4bc11f4-f993-441e-83f1-efac294fe317';
const ENDPOINT = `https://agents.toolhouse.ai/${AGENT_ID}`;

// Get topic from CLI args, default to 'bananas'
const topic = process.argv[2] || 'bananas';
const body = JSON.stringify({ vars: { topic } });

(async () => {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });
  if (!res.ok) {
    console.error('Error:', res.status, await res.text());
    process.exit(1);
  }
  
  let fullOutput = '';
  for await (const chunk of res.body) {
    const chunkText = chunk.toString();
    fullOutput += chunkText;
    process.stdout.write(chunk);
  }
  
  // Look for Toolhouse image URLs in the output
  const imageUrlRegex = /https:\/\/img\.toolhouse\.[^\s)]+/g;
  const imageUrls = fullOutput.match(imageUrlRegex);
  
  if (imageUrls && imageUrls.length > 0) {
    const fs = await import('fs');
    const path = await import('path');
    
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      try {
        console.log(`\nDownloading image: ${imageUrl}`);
        const imageRes = await fetch(imageUrl);
        if (imageRes.ok) {
          const buffer = await imageRes.arrayBuffer();
          const filename = `joke-image-${Date.now()}-${i}.png`;
          await fs.promises.writeFile(filename, Buffer.from(buffer));
          console.log(`Image saved as: ${filename}`);
        }
      } catch (error) {
        console.error(`Failed to download image ${imageUrl}:`, error.message);
      }
    }
  }
})();