import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // 1. POST 요청만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        // 2. Vercel 서버에 몰래 숨겨둔 내 API 키 꺼내기
        const apiKey = process.env.GEMINI_API_KEY; 
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 3. 프론트엔드에서 보낸 '대화 기록(history)'과 '새 질문(message)' 받기
        const { history, message } = req.body;

        // 4. AI에게 대화 기록과 함께 질문 던지기
        const chatSession = model.startChat({ history: history });
        const result = await chatSession.sendMessage(message);
        const response = await result.response;

        // 5. 프론트엔드(화면)로 AI의 대답만 예쁘게 보내주기
        return res.status(200).json({ reply: response.text() });

    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ message: '서버 통신 에러가 발생했습니다.' });
    }
}