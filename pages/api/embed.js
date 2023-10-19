// Import necessary libraries and modules
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import {
  MarkdownTextSplitter,
  RecursiveCharacterTextSplitter,
} from "langchain/text_splitter";
import { v4 as uuidv4 } from "uuid";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { supabase } from "@/utils/supabase";

// Define an asynchronous function to handle incoming requests
export default async function handler(req, res) {
  try {
    // Extract the 'payload' field from the request body
    const content = req.body.payload;

    // Create a content text splitter instance
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 150,
      chunkOverlap: 2,
    });
    
    const document = await splitter.createDocuments([content]);

    // Generate and store embeddings for the text documents
    const response = await generateAndStoreEmbedding(document, {
      chat_id: uuidv4(),
    });

    // Send a JSON response with the result
    res.status(200).json({ result: response });
  } catch (error) {
    // Handle any errors and send a 500 Internal Server Error response
    res.status(500).json({ error: JSON.stringify(error) });
  }
}

// Define an asynchronous function to generate and store embeddings
const generateAndStoreEmbedding = async (docs, fields) => {

  // Modify the metadata of each chunked document by adding specified fields
  const splitedDocs = docs.map((e) => ({
    ...e,
    metadata: { ...e.metadata, ...fields },
  }));

  // Generate and store embeddings using SupabaseVectorStore and OpenAIEmbeddings
  return await SupabaseVectorStore.fromDocuments(
    splitedDocs,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    }),
    {
      client: supabase,
      tableName: "documents",
    }
  );
};
