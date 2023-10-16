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
    const markdown = req.body.payload;

    // Create a Markdown text splitter instance
    const splitter = new MarkdownTextSplitter();

    // Split the provided markdown text into documents
    const articleContent = await splitter.createDocuments([markdown]);

    // Generate and store embeddings for the text documents
    const response = await generateAndStoreEmbedding(articleContent, {
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
const generateAndStoreEmbedding = async (rawDocs, fields) => {
  // Create a Recursive Character Text Splitter instance with specific configuration
  const textSplitter = new RecursiveCharacterTextSplitter({
    documentsize: 400,
    chunkOverlap: 2,
  });

  // Split the raw documents into smaller documents
  const docs = await textSplitter.splitDocuments(rawDocs);

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
