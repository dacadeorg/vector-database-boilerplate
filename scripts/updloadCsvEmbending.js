const tableName = "chunks";
const csvFilePath = "./scripts/content/document.txt";
const supabase = require("@supabase/supabase-js");
const dotEnv = require("dotenv");
dotEnv.config();
const OpenAIEmbeddings =
  require("langchain/embeddings/openai").OpenAIEmbeddings;
const TextLoader = require("langchain/document_loaders/fs/text").TextLoader;
const RecursiveCharacterTextSplitter =
  require("langchain/text_splitter").RecursiveCharacterTextSplitter;
const uuidv4 = require("uuid").v4;
const SupabaseVectorStore =
  require("langchain/vectorstores/supabase").SupabaseVectorStore;

const supabaseClient = supabase.createClient(
  `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`,
  process.env.SUPABASE_KEY
);
async function main(text) {
  try {
    const textLoader = new TextLoader(text);
    const response = await generateAndStoreEmbending( await textLoader.load(), {
      chat_id: uuidv4(),
    });
    console.log("Uploaded")
  } catch (error) {
    console.log(error);
  }
}

const generateAndStoreEmbending = async function (rawDocs, fields) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 2,
  });
  const docs = await textSplitter.splitDocuments(rawDocs);
  const splitedDocs = docs.map(function (e) {
    return Object.assign({}, e, {
      metadata: Object.assign({}, e.metadata, fields),
    });
  });

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

(async () => main(csvFilePath))();
