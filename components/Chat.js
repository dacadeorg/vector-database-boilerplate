import { useState } from "react";
import SubmitButton from "./SubmitButton";
import TextInput from "./TextInput";
import Textarea from "./Textarea";
import useApi from "@/hooks/useApi";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [query, setQuery] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [articleBody, setArticleBody] = useState("");
  const { data, error, loading, fetchData } = useApi();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submitValue = query;
    await fetchData("/api/openai", "POST", submitValue);
  };

  const saveAndUpload = async (event) => {
    event.preventDefault();
    await fetchData("/api/embed", "POST", articleBody);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };


  return (
    <div className="wrapper">
      <div className="container">
        <div className="left">
          <form>
            <Textarea
              currentNote={{ body: articleBody }}
              updateNote={(value) => setArticleBody(value)}
            />
            <SubmitButton onClick={saveAndUpload} disabled={loading} />
          </form>
        </div>
        <div className="right">
          <div className="chat active-chat">
            <div className="conversation-start"></div>
            {data && <div className="bubble assistant">{data}</div>}
            {query && <div className="bubble me">{query}</div>}
          </div>
          <div className="write">
            <a href="javascript:;" className="write-link attach"></a>
            <input
              placeholder="Ask me..."
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <a onClick={
                (e) => {
                    setQuery(question)
                    handleSubmit(e)
                }
            } href="javascript:;" className="write-link send"></a>
          </div>
        </div>
      </div>
    </div>
  );
}
