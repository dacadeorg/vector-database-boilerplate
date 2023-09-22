# Vector Database.

A vector database is like a clever tool for sorting words and numbers. Imagine you have lots of words, and you want to organize them based on what they mean or how they're related. Normally, you'd group them by categories, like animals or fruits.

But with a vector database, you organize them based on their similarities. Each group of similar words gets its own special place, and each word is represented by a bunch of numbers that describe these similarities.

So, if you want to find all the words related to 'happy,' you just look in the 'happy' place, and the vector database quickly shows you all the words that are similar in meaning.


> Embeddings are like special codes, called vectors, that computers use to understand words and phrases better. These vectors are like arrows pointing in different directions in a big space. Computers use these arrows to figure out which words are similar in meaning and how words can change their meanings in different situations. We use these vector codes to make computers read and understand text, and they're really important for making computers do things like understand language and translate between languages, example `[-0.018704185,-0.010303496,0.016113129,-0.005418276,-0.007138899]`. find more [example](./scripts/content/document.csv). 


## Goals

- Create vector database on supabase.
- Create embeddings with [langchain](https://js.langchain.com/docs/get_started/introduction/).
- Upload embeddings on supabase by using [langchain](https://js.langchain.com/docs/get_started/introduction/).
- Query vector database and use OpenAI to get readble content out of our vectores/embeddings.

## Step by step to create a vector database on Supabase.

1. Create an account on [supabase.com](https://supabase.com/dashboard/sign-in?) if you don't have any.

2. Create new project

### Home page to create new Project

![Home Page](./public/images/Home-page.png)

### Click on the button to create a new project

![Create a new project](./public/images/Create-new-project.png)

### Form to create a new project

![Create new project form](./public/images/Create-project-form.png)

### Click on create new project Button

![Click button to create the project](./public/images/Button-to-create.png)

### To enable postgres to store vector datatypes we need to extend it.

> Click on slq editor icon, the third menu icon from the top, and run the following query.

### Click the SQL editor button to go to the terminal

![Button to the sql](./public/images/Button-to-sql.png)

### Copy the follow SQL query in your project SQL editor and execute them.

```SQL
create extension if not exists vector with schema public;

-- Create a table to store your chunks
create table chunks (
  id bigserial primary key,
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(1536) -- 1536 works for OpenAI embeddings, change if needed
);

-- Create a function to similarity search for chunks
create function match_chunks (
  query_embedding vector(1536),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (chunks.embedding <=> query_embedding) as similarity
  from chunks
  where metadata @> filter
  order by chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create a function to keyword search for chunks
create function kw_match_chunks(query_text text, match_count int)
returns table (id bigint, content text, metadata jsonb, similarity real)
as $$

begin
return query execute
format('select id, content, metadata, ts_rank(to_tsvector(content), plainto_tsquery($1)) as similarity
from chunks
where to_tsvector(content) @@ plainto_tsquery($1)
order by similarity desc
limit $2')
using query_text, match_count;
end;
$$ language plpgsql;
```

![Terminal in the sql](./public/images/SQL-final-run.png)

> After running the query, no rows will be returns and you will have a success message.

### Configure supabase client and openai.

### Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (Version 12 or higher)
- [npm](https://www.npmjs.com/get-npm) (generally bundled with Node.js) 

### Installation

1.  Clone this repository:

    `git clone repo url`

2.  Move to the project directory:

    `cd vector-database-boilerplate`

3.  Install dependencies:

    `npm install`

4.  Create a `.env` file in the root directory of the project and include your OpenAI API key:

    `OPENAI_API_KEY=your_openai_api_key`

    Substitute `your_openai_api_key` with your actual OpenAI API key. Your API key can be located in your [OpenAI Dashboard](https://platform.openai.com/account/api-keys).

### Supabase

`SUPABASE_REFERENCE_ID` and `SUPABASE_PROJECT_API_KEY` are required environment for supabase client, to get them follow the following steps.

1. Click on settings icon on sidebar menu, copy the Reference ID and in your env.local file assgin it to `SUPABASE_REFERENCE_ID``.

![Setting](./public/images/project-setting.png)

2. To get `SUPABASE_PROJECT_API_KEY` click on API, click copy and assign it to your `SUPABASE_PROJECT_API_KEY` in you `.env.loca`.
  > Copy only the key with `anon` and `public` label.

![Project API key](./public/images/API-key.png)

5.  Kick start the development server:

  `npm run dev`

6.  Access the application by navigating to [http://localhost:3000](http://localhost:3000/). The boilerplate application should be live now.

## Create embeddings with langchain.

Langchain provides methodes that makes the work very easy when we are dealing with large language models.

`RecursiveCharacterTextSplitter()`: will help us to split the content into chunks and those content will be transiformend into vectors or embeddings, at this point they are called documents.

`SupabaseVectorStore`: This is an instance that megre our supabase client with the logic langachain and openAI mode that converts documents into vectors/embeddings and langchain uploads the to supabase. 

```js
await SupabaseVectorStore.fromDocuments(
  splitedDocs,
  new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  }),
  {
    client: supabase,
    tableName: "chunks",
  }
);
```

### Generate vectors from txt file.


```bash
node ./scripts/uploadEmbending.js
```
> Don't worry about this warning. `No storage option exists to persist the session, which may result in unexpected behavior when using auth.
If you want to set persistSession to true, please provide a storage option or you may set persistSession to false to disable this warning.` only wait until you see `Uploaded` logged in the terminal.


### Query our vector database.
Head over to where our app is running [http://localhost:3000](http://localhost:3000/), and ask any query related to bun, or if you changed the content inside the [document.txt](./scripts/content/document.txt) try to query anything about them.


#### Background procces.

> ./api/openai


```js

/*

This line creates an instance of the SupabaseVectorStore class by calling the fromExistingIndex method. It takes two arguments:
The first argument is an instance of the OpenAIEmbeddings class, which is initialized with an object containing the OpenAI API key.

The second argument is an object with properties client, tableName, and queryName. These properties specify the Supabase client, the name of the table, and the name of the query to be used for retrieving vectors from the Supabase database.

*/

const vectorStore = await SupabaseVectorStore.fromExistingIndex(
  new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }), 
  { client: supabase, tableName: "chunks", queryName: "match_chunks" }
);

/*

This line creates an instance of the ConversationalRetrievalQAChain class by calling the fromLLM method. It takes two arguments:
The first argument is the model object, which represents the language model to be used for conversational retrieval.
The second argument is the result of calling the asRetriever method on the vectorStore object. This method returns a retriever object that can be used for retrieving vectors from the Supabase database.

*/

const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever());


/*

This line calls the call method on the chain object to perform a conversational retrieval. It takes an object as an argument with properties question and chat_history. The question property contains the question to be asked. 
The chat_history property is an array that can be used to provide previous conversation history if needed.

*/
const answer = await chain.call({ question: question, chat_history: [] });


/*
Finally, we deliver the response to the client.
*/

return res.status(200).json({ data: answer });
```


