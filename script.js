import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { personaHistory } from './persona.js';

// DOM 요소들
const apiKeyInput = document.getElementById("api-key-input");
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const quickButtonsContainer = document.getElementById("quick-buttons");
const suggestionQuestions = [
  "自己紹介をお願いします.",
  "あなたの強みは何ですか?",
  "技術スタックについて教えてください。",
  "日本で働きたい理由は何ですか？",
  "将来はどのようなエンジニアになりたいですか？",
];

// 🧠 [핵심] 대화 내용을 기억할 변수 (전역 변수)
let chatSession = null;
let currentApiKey = null;

// [기능 1] 화면에 메시지 추가
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.classList.add(sender === "user" ? "user-message" : "ai-message");
  div.innerText = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// [기능 2] AI 응답 요청 (여기가 기억력의 핵심!)
async function getAIResponse(prompt) {
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    return "⚠️ 상단에 Gemini API 키를 먼저 입력해주세요!";
  }

  try {
    // 1. 키가 바뀌었거나, 아직 채팅 세션이 없으면 새로 만듭니다.
    if (!chatSession || currentApiKey !== apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // startChat()이 바로 '기억력'을 담당하는 함수입니다!
      chatSession = model.startChat({
        history: personaHistory
      });
      currentApiKey = apiKey; // 현재 키 저장
    }

    // 2. 이제 generateContent가 아니라 sendMessage를 씁니다.
    // (이 함수가 알아서 대화 내역을 노트북에 적어서 보냅니다.)
    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("API Error:", error);
    // 에러 나면 세션 초기화 (다시 시도하게)
    chatSession = null;
    return "⚠️ 에러가 발생했어요. (잠시 후 다시 시도하거나 키를 확인해주세요)";
  }
}

// [기능 3] 전송 처리
async function handleSendMessage() {
  const message = userInput.value.trim();
  if (message.length === 0) return;

  addMessage(message, "user");
  userInput.value = "";

  // 로딩 표시 대신 사용할 임시 메시지
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("message", "ai-message");
  loadingDiv.innerText = "回答を作成しております... ⏳";
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const aiReply = await getAIResponse(message);

  // 로딩 메시지 지우고 진짜 대답 넣기
  loadingDiv.remove();
  addMessage(aiReply, "ai");
}
// [기능 4] 추천 질문 버튼 만들기 (새로 추가된 함수)
function createQuickButtons() {
  quickButtonsContainer.innerHTML = ""; // 초기화

  suggestionQuestions.forEach((question) => {
    const btn = document.createElement("button");
    btn.classList.add("quick-btn"); // CSS 클래스 적용
    btn.innerText = question;

    // 버튼 클릭 시 채팅 전송되는 기능 연결
    btn.addEventListener("click", () => {
      userInput.value = question; // 입력창에 질문 넣기
      handleSendMessage(); // 전송 함수 실행
    });

    quickButtonsContainer.appendChild(btn);
  });
}
createQuickButtons();

// 이벤트 리스너
sendBtn.addEventListener("click", handleSendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSendMessage();
});
