import { useState } from "react";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

function App() {
  const [input, setInput] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [fromLanguage, setFromLanguage] = useState<string>("English");
  const [toLanguage, setToLanguage] = useState<string>("Italian");
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

  const model = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    apiKey: apiKey,
  });

  const handleTranslate = async () => {
    if (!input) {
      alert("Please enter some text to translate.");
      return;
    }

    try {
      const systemTemplate = `Translate the following text from ${fromLanguage} to ${toLanguage}. Only return the ${toLanguage} translation without any extra explanation or text.`;
      const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["user", "{text}"],
      ]);

      const promptValue = await promptTemplate.invoke({
        text: input,
      });

      const response: any = await model.invoke(promptValue);

      if (response.content) {
        setTranslatedText(response.content);
      } else {
        setTranslatedText("Translation not available.");
      }
    } catch (error) {
      console.error("Error during translation:", error);
      setTranslatedText("Error occurred during translation.");
    }
  };

  const languages = [
    "English",
    "Italian",
    "Spanish",
    "French",
    "German",
    "Chinese (Simplified)",
    "Chinese (Traditional)",
    "Japanese",
    "Korean",
    "Portuguese",
    "Russian",
    "Dutch",
    "Arabic",
    "Swedish",
    "Greek",
  ];

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 sm:p-8">
      <div className="flex flex-col justify-center items-center gap-10 w-full sm:w-1/2">
        <div className="text-purple-600 text-3xl sm:text-5xl font-bold">
          Translate-AI
        </div>
        <div className="w-full flex flex-col gap-4 items-center">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
            <div>
              <label
                htmlFor="fromLanguage"
                className="block mb-1 text-sm sm:text-base"
              >
                From:
              </label>
              <select
                id="fromLanguage"
                value={fromLanguage}
                onChange={(e) => setFromLanguage(e.target.value)}
                className="border-2 border-black p-2 rounded w-full sm:w-auto"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="toLanguage"
                className="block mb-1 text-sm sm:text-base"
              >
                To:
              </label>
              <select
                id="toLanguage"
                value={toLanguage}
                onChange={(e) => setToLanguage(e.target.value)}
                className="border-2 border-black p-2 rounded w-full sm:w-auto"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-10 items-center justify-center">
            <input
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                if (!event.target.value) {
                  setTranslatedText("");
                }
              }}
              type="text"
              className="w-full sm:w-3/4 border-2 border-black p-2 rounded"
              placeholder="Enter your text here"
            />
            <div
              className="bg-slate-600 text-white p-3 flex items-center justify-center rounded-xl cursor-pointer mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto"
              onClick={handleTranslate}
            >
              Translate
            </div>
          </div>
        </div>
        <div className="w-full h-32 bg-slate-400 flex items-center justify-center rounded mt-4">
          {translatedText ? (
            <p className="text-center">{translatedText}</p>
          ) : (
            <p className="text-center">Translation will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
