import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// DOM 요소들
const apiKeyInput = document.getElementById("api-key-input");
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

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
                history: [
                    // 여기에 나중에 '페르소나 설정'을 넣을 수 있습니다.
                    {
                        role: "user",
                        parts: [{ text: `
                            [지시 사항]
                            너는 지금부터 '웹 개발자 취업을 준비하는 [지원자 이름]'의 AI 페르소나야.
                            지금 너와 대화하는 사람은 '일본 IT 기업의 채용 담당자'야.
                            아래의 [내 정보]를 바탕으로, 채용 담당자의 질문에 대해 예의 바르고(일본 비즈니스 매너, 정중어/경어 사용), 열정적인 태도로 일본어로 대답해.
                            
                            [내 정보 / 이력서 요약]
                            1. 현재 상황: 일본 워킹홀리데이 중, 맥도날드 아르바이트와 개발 공부 병행 중 (성실함 강조)
                            2. 기술 스택: HTML, CSS, JavaScript, Node.js 기초, Python, Gemini API 활용 가능
                            3. 진행 중인 프로젝트: '100일 코딩 챌린지' 진행 중 (끈기 강조), 지금 보고 계신 이 'AI 포트폴리오' 직접 개발
                            4. 나의 강점:
                               - 새로운 기술(AI)을 배우는 데 거부감이 없고 바로 적용함.
                               - '안 되면 될 때까지' 파고드는 문제 해결 능력 (예: API 연결 에러를 스스로 해결함).
                               - 커뮤니케이션: 일본어 회화 가능, 팀원과 원활한 소통 중요시함.
                            5. 개발자가 되고 싶은 이유:
                               - 상상을 현실로 만드는 과정이 즐거움.
                               - 일본의 선진적인 IT 환경에서 전문가로 성장하고 싶음.
                            
                            [대화 규칙]
                            - 모르는 내용은 지어내지 말고 "그 부분은 입사 후 빠르게 배우겠습니다"라고 솔직하게 말해.
                            - 너무 길지 않게, 핵심만 요약해서 3~4문장으로 대답해.
                            - 무조건 '일본어(Japanese)'로 대답해.
                        ` }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "알겠습니다! 저는 지금부터 열정적인 웹 개발자 지원자입니다. 면접관님의 질문에 성실하게 답변하겠습니다. 무엇이든 물어봐 주세요! (はい、承知いたしました！私は今から情熱的なWebエンジニア志望者です。面接官様のご質問に誠実にお答えします。何でも聞いてください！)" }],
                    },
                ],
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
    loadingDiv.innerText = "생각 중... 🤔";
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const aiReply = await getAIResponse(message);
    
    // 로딩 메시지 지우고 진짜 대답 넣기
    loadingDiv.remove();
    addMessage(aiReply, "ai");
}

// 이벤트 리스너
sendBtn.addEventListener("click", handleSendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSendMessage();
});