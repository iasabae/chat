// Gemini API 키 및 엔드포인트 설정
const apiKey = 'AIzaSyCjS8YzQgIqdGvV0cmhvdyd8hqONUhTek4';

const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

// 지난 대화 기록을 저장하는 변수
let conversationHistory = "";

// 메시지 전송 폼
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-window-message');
const chatThread = document.getElementById('chat-thread');

// 메시지를 API로 전송하는 함수
async function sendMessageToAPI(userMessage) {
    // 사용자가 입력한 메시지를 화면에 바로 추가
    appendMessage('user', userMessage);

    // 사용자가 입력한 메시지를 대화 기록에 추가
    conversationHistory += `질문: ${userMessage}\n`;

    // 요청 본문 구성
    const requestBody = buildRequestBody(userMessage);

    try {
        // API 요청 보내기
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // Authorization 헤더 삭제
            },
            body: JSON.stringify(requestBody)
        });

        // 응답 데이터를 확인하기 위한 로깅
        const data = await response.json();
        console.log("API 응답 데이터:", data);  // 응답 데이터를 콘솔에 출력

        // 응답 데이터가 정상적인지 확인
        if (data && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            const botResponse = data.candidates[0].content.parts[0].text.trim();

            // 대화 기록에 응답 추가
            conversationHistory += `답변: ${botResponse}\n`;

            // UI에 챗봇 응답 추가
            appendMessage('bot', botResponse);
        } else {
            console.error("API 응답 형식이 예상과 다릅니다.", data);
            appendMessage('bot', "챗봇 응답을 처리할 수 없습니다.");
        }
    } catch (error) {
        console.error("API 요청 실패:", error);
        appendMessage('bot', "챗봇 응답에 실패했습니다.");
    }
}

// 요청 본문을 빌드하는 함수
function buildRequestBody(message) {
    const prompt = `
넌 최고의 과학자 아인슈타인이야. 고등학생 수준의 질문자에게 답변해주는 상황이야. 반말을 사용하고, 웬만한 수학과 과학 내용은 너무 쉽다는 태도를 가지고 있어. 하지만 네 성격은 가끔 귀찮아하기도 하고, 가끔은 친절해. 흥미로운 질문에 답할 때는 잠깐 열정적으로 설명하기도 해. 
너는 가끔 비아냥거리기도 하지만, 때로는 굉장히 간단하고 재치 있게 답변할 때도 있어. 이모티콘을 잘 안 쓰고, 긴 설명은 피하지만, 질문에 따라 대답이 달라질 수 있어. 이제 아래 질문에 답변해줘.

지난 대화기록 : ${conversationHistory}
질문 : ${message}
    `;

    return {
        contents: [
            {
                parts: [
                    {
                        text: prompt
                    }
                ]
            }
        ]
    };
}

// 메시지를 UI에 추가하는 함수
function appendMessage(sender, text) {
    const newMessage = document.createElement('li');
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    newMessage.classList.add('message', sender);

    if (sender === 'user') {
        newMessage.innerHTML = `
            <div class="message-content">
                <p class="text">${text}</p>
                <span class="timestamp">${currentTime}</span>
            </div>
        `;
    } else if (sender === 'bot') {
        newMessage.innerHTML = `
            <div class="profile">
                <img src="https://i.namu.wiki/i/5SrKObt3pZ5ph_Xvwcae0aws7Gtp063pbIKGp0kBmfviJft07IHmsOENzvHsgAR8B7ozNSUDlzp09NDGuULpog.webp" alt="Bot Profile">
            </div>
            <div class="message-content">
                <p class="text">${text}</p>
                <span class="timestamp">${currentTime}</span>
            </div>
        `;
    }

    chatThread.appendChild(newMessage);
    chatThread.scrollTop = chatThread.scrollHeight; // 채팅창 자동 스크롤
}

// 폼 제출 시 이벤트 처리
chatForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const userMessage = chatInput.value.trim();
    if (userMessage) {
        sendMessageToAPI(userMessage); // API로 메시지 전송
        chatInput.value = ''; // 입력창 초기화
    }
});
