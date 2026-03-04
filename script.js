import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "";

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function run() {
  try {
    console.log("🚀 질문 전송 중...");

    // AI에게 보낼 메시지
    const result = await model.generateContent(
      "안녕? 2026년의 웹 개발자가 될 나에게 응원 한마디 해줘!"
    );

    const response = await result.response;
    const text = response.text();

    console.log("🤖 AI 응답:", text);

    // 화면에 결과 보여주기
    const resultDiv = document.getElementById("result");
    if (resultDiv) {
      resultDiv.innerText = text;
    }
  } catch (error) {
    console.error("🔥 에러 상세:", error);
    // 화면에 에러 보여주기
    const resultDiv = document.getElementById("result");
    if (resultDiv) {
      resultDiv.innerText = "에러 발생: " + error.message;
    }
  }
}

run();
