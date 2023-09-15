# Next.js OpenAI Boilerplate

This is a simplified yet effective Next.js boilerplate project that showcases how to integrate the OpenAI API within a Next.js application. The boilerplate incorporates a user-friendly interface for submitting prompts and rendering the response from the OpenAI API.

## Features

-   Well-structured Next.js configuration with a minimalistic user interface.
-   Flexibly customizable prompts in a dedicated folder.
-   Utilizes OpenAI's GPT-3.5 Turbo model for chat completion (Model Version: gpt-3.5-turbo-0613).
-   Function calling mechanism included to create meaningful interactions with the AI model.
-   In-built error handling and management of loading states.

## Getting Started

### Prerequisites

Ensure the following are installed on your machine:

-   [Node.js](https://nodejs.org/en/download/) (Version 12 or higher)
-   [npm](https://www.npmjs.com/get-npm) (generally bundled with Node.js) or [Yarn](https://yarnpkg.com/getting-started/install)

### Installation

1.  Clone this repository:

    `git clone https://github.com/your-username/nextjs-openai-boilerplate.git`

2.  Move to the project directory:

    `cd nextjs-openai-boilerplate`

3.  Install dependencies:

    `npm install`

    or

    `yarn install`

4.  Create a `.env.local` file in the root directory of the project and include your OpenAI API key:

    `OPENAI_API_KEY=your_openai_api_key`

    Substitute `your_openai_api_key` with your actual OpenAI API key. Your API key can be located in your [OpenAI Dashboard](https://platform.openai.com/account/api-keys).

5.  Kick start the development server:

    `npm run dev`

    or

    `yarn dev`

6.  Access the application by navigating to [http://localhost:3000](http://localhost:3000/). The boilerplate application should be live now.

OpenAI API: Generating Chat Completions
---------------------------------------

The `openai.createChatCompletion()` function is an essential part of the OpenAI API, which enables developers to generate text utilizing machine learning models. Specifically, `createChatCompletion()` caters to the generation of completions for chat-oriented models, such as the GPT-3.5-turbo model (version gpt-3.5-turbo-0613), aimed at generating responses in a conversational format.

### Usage

```javascript
const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo-0613",
  messages: messages,
  functions: functions,
  temperature: 0,
  max_tokens: 510,
  top_p: 0,
});
```

### Parameters

> model: (string, required) - Indicates the name of the model to be utilized for generating completions. "gpt-3.5-turbo-0613" is used in this example, which is a chat-based language model.

> messages: (array of objects, required) - Indicates an array of message objects. Each object consists of a role ("system", "user", or "assistant") and content (the actual message text). Messages are processed in the order they appear in the array, and the assistant generates the response accordingly.

> functions: (array of objects, required) - Specifies an array of function objects that represent the assistant's capabilities.

> temperature: (number, optional) - Determines the randomness of the generated completions. A higher value (e.g., 0.8) will produce more random outputs, while a lower value (e.g., 0.2) will make the outputs more deterministic.

> max_tokens: (number, optional) - Determines the maximum length of the generated completion. If the limit is exceeded, the additional tokens will be discarded. However, bear in mind that very long outputs may require more time to process.

> top_p: (number, optional) - This parameter is a part of nucleus sampling, a decoding method used in language models. It determines the minimum number of tokens to consider for generating a completion. A higher value will consider more tokens, increasing the randomness.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.

## Disclaimer
The use of the OpenAI API and the output it generates depends on the usage policies set by OpenAI. Make sure to review the OpenAI use case policy before using this boilerplate to build applications.