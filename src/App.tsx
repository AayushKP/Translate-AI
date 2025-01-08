import { useState, useEffect } from "react";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

function App() {
  const [input, setInput] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [fromLanguage, setFromLanguage] = useState<string>("English");
  const [toLanguage, setToLanguage] = useState<string>("Italian");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("theme") === "dark"
  );
  const [copySuccess, setCopySuccess] = useState<string>("");
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

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

    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard
        .writeText(translatedText)
        .then(() => setCopySuccess("Copied!"))
        .catch(() => setCopySuccess("Failed to copy"));

      setTimeout(() => setCopySuccess(""), 2000);
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
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col justify-center items-center px-4 sm:px-10 py-8">
      <div className="absolute top-4 right-4">
        <button
          className="p-2 border rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row w-full max-w-screen-lg border-none  rounded-lg shadow-lg overflow-hidden h-auto lg:h-[70vh]">
        {["Input", "Output"].map((section, index) => (
          <div
            key={section}
            className="flex flex-col w-full lg:w-1/2 p-4 bg-white dark:bg-gray-800"
            style={{ minHeight: "50vh" }}
          >
            <div
              className={`flex ${
                index === 0 ? "justify-start" : "justify-end"
              } gap-4 p-4`}
            >
              <select
                id={index === 0 ? "fromLanguage" : "toLanguage"}
                value={index === 0 ? fromLanguage : toLanguage}
                onChange={(e) =>
                  index === 0
                    ? setFromLanguage(e.target.value)
                    : setToLanguage(e.target.value)
                }
                className="border border-blue-500 p-2 rounded w-full sm:w-auto focus:outline-none text-sm sm:text-base bg-white dark:bg-gray-700 text-black dark:text-white"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="flex flex-col gap-4 p-4 flex-grow border  border-blue-500 rounded bg-white dark:bg-gray-700 overflow-y-auto"
              style={{ minHeight: "20vh" }}
            >
              {index === 0 ? (
                <textarea
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    if (!event.target.value) {
                      setTranslatedText("");
                    }
                  }}
                  className="w-full h-full p-4 resize-none focus:outline-none text-sm sm:text-base lg:text-2xl bg-white dark:bg-gray-700 text-black dark:text-white"
                  placeholder="Enter your text here"
                  style={{ minHeight: "50px" }}
                />
              ) : (
                <div className="relative">
                  <div
                    className="w-full h-full p-4 text-sm sm:text-base lg:text-lg text-black dark:text-white"
                    style={{ minHeight: "50px" }}
                  >
                    {translatedText ? (
                      <p className="text-left">{translatedText}</p>
                    ) : (
                      <p className="text-left text-black/40 dark:text-white/40">
                        Translation will appear here...
                      </p>
                    )}
                  </div>
                  {translatedText && (
                    <button
                      onClick={handleCopy}
                      className="absolute top-4 right-4 p-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                      Copy
                    </button>
                  )}
                  {copySuccess && (
                    <span className="absolute top-16 right-4 text-sm text-green-600 dark:text-green-400">
                      {copySuccess}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center mt-4">
        <button
          className="bg-slate-600 dark:bg-slate-800 text-white p-3 text-base sm:text-lg lg:text-xl flex items-center justify-center rounded-xl cursor-pointer w-full sm:w-auto transform transition-transform hover:-translate-y-1"
          onClick={handleTranslate}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin border-4 border-t-4 border-white rounded-full h-6 w-6"></div>
          ) : (
            "Translate"
          )}
        </button>
      </div>
    </div>
  );
}

export default App;
