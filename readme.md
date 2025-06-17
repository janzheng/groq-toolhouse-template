# Groq Toolhouse Agent Examples

**A collection of ready-to-run agent configurations for Groq Toolhouse, demonstrating how to use Groq's Compound Beta and Llama 4 Maverick models for agentic tasks.**

## Live Demo

*You can run these agents locally using the Toolhouse CLI. See below for instructions!*

## Overview

This repository contains example YAML agent files for use with [Groq Toolhouse](https://toolhouse.ai/), showcasing how to:
- Use Groq's Compound Beta model for web search and reasoning
- Use Llama 4 Maverick for creative tasks and tool use
- Run and deploy agents as APIs with Toolhouse
- Incorporate deployed agents into code

**Key Features:**
- Agentic web search and tool use (Compound Beta)
- Conversational AI and image generation (Llama 4 Maverick, tool use with stable diffusion)
- Sub-second response times and easy deployment

## Architecture

**Tech Stack:**
- **Agent Config:** YAML (Toolhouse format)
- **Backend/AI:** Groq API via Toolhouse
- **CLI:** [@toolhouseai/cli](https://www.npmjs.com/package/@toolhouseai/cli)


## Quick Start

### Clone the Repository

First, clone this repository to your local machine:

```bash
gh repo clone janzheng/groq-toolhouse-template
cd groq-toolhouse-template
```

### Install Dependencies

Install the required dependencies using your preferred package manager (npm, pnpm, or yarn):

```bash
# Using npm
npm install

# Or using pnpm
pnpm install

# Or using yarn
yarn install
```

### Prerequisites
- [Node.js](https://nodejs.org/) (for installing the CLI)
- [Groq API key](https://console.groq.com/keys). (get a [free Groq API key](https://console.groq.com/keys))
- [Toolhouse CLI](https://www.npmjs.com/package/@toolhouseai/cli)

### Setup

1. **Install the Toolhouse CLI:**
   ```bash
   npm i -g @toolhouseai/cli
   ```
2. **Log in to Toolhouse:**
   ```bash
   th login
   ```
3. **Set your Groq API Key:**
   ```bash
   th secrets set GROQ_API_KEY=your-groq-api-key
   ```

## Usage

### Running Agents from YAML

#### Compound Beta: Searching Hockey Schedules (`hockey.yaml`)

You can use Groq's new [Compound Beta system](https://console.groq.com/docs/agentic-tooling/compound-beta) to get real-time information about the world. For example, you can ask about the Oilers' next game, by calling the `@groq/compound-beta` model.

```yaml
# hockey.yaml
prompt: Who are the Oilers playing against next, and when/where are they playing?
model: '@groq/compound-beta'
```

**Run it:**
```bash
th run hockey.yaml
```

You will see something like this:
```bash
━━━━ Stream output for compound ━━━━
The Oilers are playing against the Florida Panthers next. The game is scheduled for June 12, 2025, at Amerant Bank Arena.
━━━━ End of stream for compound ━━━━
```

#### Llama 4 Maverick: Joke & Image (`joke.yaml`)
This example demonstrates how to combine Groq's powerful Llama 4 Maverick model with tools like image generation to create rich, multimodal responses.

This agent will generate a joke about any topic and then create a corresponding image. The `vars` section in the YAML file defines template variables (like `topic`) that get dynamically replaced in the prompt when the agent runs. You can easily override these variables when calling the agent programmatically via API or from your code.

```yaml
# joke.yaml
prompt: Tell me a joke about this topic: {topic} then generate an image!
vars:
  topic: bananas
model: '@groq/meta-llama/llama-4-maverick-17b-128e-instruct'
```

**Run it:**
```bash
th run joke.yaml
```

You will see something like this:
```bash
━━━━ Stream output for joke ━━━━
Why did the banana go to the doctor? Because it wasn't peeling well!

Using MCP Server: image_generation_flux()

Why did the banana go to the doctor? Because it wasn't peeling well!

![](https://img.toolhouse.ai/tbR5NI.jpg)
━━━━ End of stream for joke ━━━━
```

### Customizing Agent Variables

The `vars` section in your YAML lets you define variables for your prompt. These variables can be replaced at runtime, making your agents flexible and dynamic.

You can also override variables by passing a different topic when calling the agent via API or code. For example, to get a joke about cats:

```bash
curl -XPOST "https://agents.toolhouse.ai/d4bc11f4-f993-441e-83f1-efac294fe317" \
  --json '{ "topic": "cats" }'
```

### Calling Your Agent from Node.js

You can also call your deployed agent directly from a Node.js script. This repo includes a simple example script for the joke agent:

**joke.js:**
```js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const AGENT_ID = 'd4bc11f4-f993-441e-83f1-efac294fe317';
const ENDPOINT = `https://agents.toolhouse.ai/${AGENT_ID}`;

// Pass a topic as a CLI argument, e.g. node joke.js "cats"
const topic = process.argv[2] || 'bananas';
const body = JSON.stringify({ topic });

(async () => {
  const res = await fetch(ENDPOINT, { method: 'POST', body });
  if (!res.ok) {
    console.error('Error:', res.status, await res.text());
    process.exit(1);
  }
  for await (const chunk of res.body) {
    process.stdout.write(chunk);
  }
})();
```

**What does this script do?**
- Calls your public Toolhouse joke agent and prints the streamed response to the terminal.
- If the response contains any Toolhouse-generated image URLs, it will automatically download and save those images to your local folder (e.g., `joke-image-<timestamp>-<n>.png`).
- You can pass a different topic as a CLI argument:

```bash
pnpm run joke -- "cats"
# or
node joke.js "cats"
```

This will print the streamed response and save any generated images to your current directory.

### Further Customization
- **Change the prompt** in the YAML files to suit your use case
- **Switch models** by editing the `model:` field
- **Add variables** for more dynamic prompts (see the `vars` section in the YAML and how to override them above)

### Next Steps
- **Deploy as an API:**
  ```bash
  th deploy hockey.yaml
  # or
  th deploy joke.yaml
  ```
- **Explore more tools and models** in the [Toolhouse Docs](https://docs.toolhouse.ai/)
- **Join the Groq developer community**: [Groq Console](https://console.groq.com)

## License
MIT

## Credits
Created by Jan Zheng and Toolhouse.
