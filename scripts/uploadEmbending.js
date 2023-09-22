// Import necessary libraries and modules
const csvFilePath = "./scripts/content/document.txt";
const supabase = require("@supabase/supabase-js");
const dotEnv = require("dotenv");
const OpenAIEmbeddings = require("langchain/embeddings/openai").OpenAIEmbeddings;
const TextLoader = require("langchain/document_loaders/fs/text").TextLoader;
const RecursiveCharacterTextSplitter = require("langchain/text_splitter").RecursiveCharacterTextSplitter;
const uuidv4 = require("uuid").v4;
const SupabaseVectorStore = require("langchain/vectorstores/supabase").SupabaseVectorStore;

dotEnv.config();
// Create a Supabase client using environment variables
const supabaseClient = supabase.createClient(
  `https://${process.env.SUPABASE_REFERENCE_ID}.supabase.co`,
  process.env.SUPABASE_PROJECT_API_KEY
);

// Define the main asynchronous function
async function main(text) {
  try {
    // Create a text loader for the provided text
    const textLoader = new TextLoader(text);

    // Generate and store embeddings for the loaded text
    const response = await generateAndStoreEmbedding(await textLoader.load(), {
      chat_id: uuidv4(),
    });
    
    // Log a message indicating successful upload
    console.log("Uploaded");
  } catch (error) {
    // Log any errors that occur
    console.log(error);
  }
}

// Define an asynchronous function to generate and store embeddings
const generateAndStoreEmbedding = async function (rawDocs, fields) {
  // Create a Recursive Character Text Splitter instance with specific configuration
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 2,
  });

  // Split the raw documents into smaller chunks
  const docs = await textSplitter.splitDocuments(rawDocs);

  // Modify the metadata of each chunked document by adding specified fields
  const splitedDocs = docs.map(function (e) {
    return Object.assign({}, e, {
      metadata: Object.assign({}, e.metadata, fields),
    });
  });

  // Generate and store embeddings using SupabaseVectorStore and OpenAIEmbeddings
  return await SupabaseVectorStore.fromDocuments(
    splitedDocs,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    }),
    {
      client: supabaseClient,
      tableName: "chunks",
    }
  );
};

// Invoke the main function with the provided CSV file path
(async () => main(csvFilePath))();
