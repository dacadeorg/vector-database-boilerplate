import { useState } from "react";
import SubmitButton from "./SubmitButton";
import Textarea from "./Textarea";
import useApi from "@/hooks/useApi";
import Loading from "./Loading";
import { useEffect } from "react";
import { localStorageController } from "@/utils/localStorageController";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [content, setContent] = useState("");
  const { data, error, loading, fetchData, uploading, embedContent, setData } = useApi();
  const [chatMessage, setChatMessage] = useState([]);

  const updateChatMessage = () => {
    const retrievedData = localStorageController("chatData");
    if (retrievedData !== null) setChatMessage(retrievedData);
  };

  const handleSubmit = async (event) => {
    if (question) {
      event.preventDefault();
      localStorageController("chatData", [
        ...chatMessage,
        { content: question, role: "user" },
      ]);
      updateChatMessage();
      await fetchData("/api/openai", "POST", question);
      setQuestion("");
    }
  };

  const saveAndUpload = async (event) => {
    event.preventDefault();
    if (content.trim() !== "") {
      await embedContent("/api/embed", "POST", content);
    }
  };

  useEffect(() => {
    const chatMessage = localStorageController("chatData");
    if (!chatMessage) {
      localStorageController("chatData", [
        {
          content:
            "Hello! 👋 I'm here to transform your vectorized data into compelling stories and valuable insights.",
          role: "assistant",
        },
      ]);
    }
    updateChatMessage();
  }, []);

  useEffect(() => {
    if (data) {
      localStorageController("chatData", [
        ...chatMessage,
        { content: data, role: "assistant" },
      ]);
      updateChatMessage();
      setData("")
    }
  }, [data]);

  return (
    <div className="wrapper">
      <div className="container">
        <div className="left">
          <form>
            <Textarea
              content={content}
              setContent={(value) => setContent(value)}
            />
            <SubmitButton
              onClick={saveAndUpload}
              loading={uploading}
              disabled={uploading}
            />
          </form>
        </div>
        <div className="right">
          <div className="chat active-chat">
            <div className="conversation-start"></div>
            {chatMessage.map((message, index) => (
              <div
                className={`bubble ${
                  message.role === "user" ? "me" : "assistant"
                } ${
                  chatMessage.length - 1 === index && !loading
                    ? "last-message"
                    : ""
                }
                `}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className={`bubble assistant`}>
                <Loading />
              </div>
            )}
          </div>
          <div className="write">
            <a href="javascript:;" className="write-link attach"></a>
            <input
              placeholder="Ask me..."
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            {loading && <Loading />}
            {!loading && (
              <a
                onClick={(e) => {
                  handleSubmit(e);
                }}
                href="javascript:;"
                className="write-link send"
              ></a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
