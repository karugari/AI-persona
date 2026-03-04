import { personaHistory } from "./persona.js";

// DOM 요소들
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
let chatHistory = [...personaHistory];

// [기능 1] 화면에 메시지 추가
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.classList.add(sender === "user" ? "user-message" : "ai-message");
  div.innerText = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ✨ 우리만의 백엔드(/api/chat)로 요청 보내기
async function getAIResponse(prompt) {
  try {
    // 서버로 대화 기록과 질문을 보냅니다.
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        history: chatHistory, // 지금까지의 대화 기록
        message: prompt, // 방금 쓴 새 메시지
      }),
    });

    if (!response.ok) throw new Error("서버 통신 에러");

    const data = await response.json();

    // 성공적으로 답변을 받으면, 내 브라우저의 기억(chatHistory)에도 저장
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    chatHistory.push({ role: "model", parts: [{ text: data.reply }] });

    return data.reply;
  } catch (error) {
    console.error("Fetch Error:", error);
    return "⚠️ エラーが発生しました。もう一度お試しください。"; // 에러 메시지도 일본어로!
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
