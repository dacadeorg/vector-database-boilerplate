# Vector Database.

A vector database is like a clever tool for sorting words and numbers. Imagine you have lots of words, and you want to organize them based on what they mean or how they're related. Normally, you'd group them by categories, like animals or fruits.

But with a vector database, you organize them based on their similarities. Each group of similar words gets its own special place, and each word is represented by a bunch of numbers that describe these similarities.

So, if you want to find all the words related to 'happy,' you just look in the 'happy' place, and the vector database quickly shows you all the words that are similar in meaning.

## Step by step to create a vector database on Supabase.

1. Create an account on [supabase.com](https://supabase.com/dashboard/sign-in?) if you don't have any.
2. Create new project
> You will need an organization so select one in the popup which will be location of you project.
> Create password for your database, past it somewhere safe, you will need it.

3. To enable postgres to store vector datatypes we need to extend it.

4. Click on slq editor icon, the third menu icon from the top, and run the following query.

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

## Configure supabase client and openai.

### Supabase

You will `SUPABASE_PROJECT_ID` and supabase key `SUPABASE_KEY`.

1. Click on settings icon on sidebar menu, copy the Reference ID and that's the project id.

2. To get `SUPABASE_PROJECT_ID` click on API.
> Copy only the key with `anon` and `public`.

### OpenAI
`OPENAI_API_KEY`
