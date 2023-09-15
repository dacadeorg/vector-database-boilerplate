import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MarkdownTextSplitter, RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { v4 as uuidv4 } from 'uuid';
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { supabase } from "@/utils/supabase";

export default async function handler(req, res) {
    try {
        const markdown = req.body.payload;
        const splitter = new MarkdownTextSplitter();
        const articleContent = await splitter.createDocuments([markdown]);

        const response = await generateAndStoreEmbending(articleContent,{ chat_id: uuidv4() })

        res.status(200).json({ result: response });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: JSON.stringify(error) });
    }
}



const generateAndStoreEmbending = async (rawDocs, fields) => {

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 2,
  });
  const docs = await textSplitter.splitDocuments(rawDocs);
  const splitedDocs = docs.map((e) => ({
    ...e,
    metadata: { ...e.metadata, ...fields },
  }));

  return await SupabaseVectorStore.fromDocuments(
    splitedDocs,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    }),
    {
      client: supabase,
      tableName: "chunks",
    }
  )
};

