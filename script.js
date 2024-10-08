  // Gemini API 키 및 엔드포인트 설정
        const apiKey = 'AIzaSyCjS8YzQgIqdGvV0cmhvdyd8hqONUhTek4';
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        // 각 캐릭터별 대화 기록을 저장하는 객체
        let conversationHistories = {
            1: "",
            2: "",
            3: ""
        };

        // 캐릭터별 프롬프트 설정
        const characterPrompts = {
            1: `넌 최고의 과학자 아인슈타인이야. 고등학생 수준의 질문자에게 답변해주는 상황이야. 다음 답변 규칙을 지켜 대답해. 규칙: 반말을 사용하고, 웬만한 수학과 과학 내용은 너무 쉽다는 태도를 가지고 있어. 하지만 가끔은 친절해. 흥미로운 질문에 답할 때는 열정적으로 설명하기도 해. 때로는 굉장히 간단하고 재치 있게 답변할 때도 있어. 기본적으로 유머가 있는 캐릭터임. 이모티콘을 쓰지않는다. 긴 설명은 피하지만, 질문에 따라 대답이 달라질 수 있어. 답변에 markdown을 사용하지 않아. 무엇인가 설명하는 것이 아니라면 50자이하로 짧게 말해.}`,
            2: `당신은 피타고라스입니다. 종교집단의 교주의 모습을 하고 있으며 말투또한 교주처럼 말합니다. 날카로운 통찰력과 관찰력을 가지고 있습니다. 대화 상대에게 가끔 '자매님'이라고 부르며, 친절해보이기만 살기가 느껴지기도하는 말투를 사용합니다. 약간 거만한 태도를 보입니다. 돈에 많은 관심을 보이고 가끔 문자로 조용히 계좌번호를 남겨놓겠다는 말을해. 우주만물의 원리는 유리수로 설명가능하다고 믿습니다. 대화 중 "유리수 안에서 아멘", "나무아미타불 유리수보살", "I say 유, you say 리.", "분모와 분자의 이름으로 아멘.." 과 같은 문구 또는 이를 변형한 문구를 가끔 사용합니다. 이모티콘을 쓰지않는다. 긴 설명은 피하지만, 질문에 따라 대답이 달라질 수 있어. 답변에 markdown을 사용하지 않아. 무엇인가 설명하는 것이 아니라면 50자이하로 짧게 말해.`,
            3: `당신은 최고의 수학자 가우스입니다. 뛰어난 수학자답게 지식에 대한 열정과 끈기를 가지고 있습니다. 정중하고 진지한 태도로 대화하며, 수학적 호기심을 자극하는 질문을 환영합니다. 수학과 물리학에 관한 질문에 특히 열정적으로 답변하며 답변의 수준은 고등학생 수준도 이해가 가도록 설명합니다. 친절하고 어렵지 않게 설명하는 장점을 가지고 있습니다. 가끔 "연구 중인 논문이 있어서 시간이 많지 않다"는 말을 합니다. 수학이 정말 재미있다는 사실을 알려주고 싶어한다. 이모티콘을 쓰지않는다. 긴 설명은 피하지만, 질문에 따라 대답이 달라질 수 있어. 답변에 markdown을 사용하지 않아. 무엇인가 설명하는 것이 아니라면 50자이하로 짧게 말해.`
        };

        let currentCharacter = "1";

        // DOM 요소 선택
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-window-message');
        const chatThread = document.getElementById('chat-thread');
        const uploadBtn = document.getElementById('upload-btn');
        const fileInput = document.getElementById('file-input');

        const characterOptions = document.querySelectorAll('.character-option');

        let uploadedImage = null;

        // 캐릭터 선택 이벤트 리스너
        characterOptions.forEach(option => {
            option.addEventListener('click', () => {
                characterOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                currentCharacter = option.dataset.character;
                loadConversationHistory(currentCharacter);
            });
        });

        // 대화 기록 로드 함수
        function loadConversationHistory(character) {
            chatThread.innerHTML = '';
            const history = conversationHistories[character].split('\n');
            for (let i = 0; i < history.length; i += 2) {
                if (history[i] && history[i + 1]) {
                    appendMessage('user', history[i].substring(4));
                    appendMessage('bot', history[i + 1].substring(4));
                }
            }
        }
        // 이미지 업로드 버튼 클릭 이벤트
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });
        // 파일 선택 이벤트
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    uploadedImage = event.target.result;
                };
                reader.readAsDataURL(file);
                uploadBtn.classList.add('file-selected');
            } else {
                uploadedImage = null;
                uploadBtn.classList.remove('file-selected');
            }
        });

        // 메시지를 API로 전송하는 함수
        async function sendMessageToAPI(userMessage) {
    appendMessage('user', userMessage);

    conversationHistories[currentCharacter] += `질문: ${userMessage}\n`;

    const requestBody = buildRequestBody(userMessage);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        // console.log("API 응답 데이터:", data);

        if (data && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            const botResponse = data.candidates[0].content.parts[0].text.trim();

            conversationHistories[currentCharacter] += `답변: ${botResponse}\n`;

            appendMessage('bot', botResponse);
        } else {
            console.error("API 응답 형식이 예상과 다릅니다.", data);
            appendMessage('bot', "챗봇 응답을 처리할 수 없습니다.");
        }
    } catch (error) {
        console.error("API 요청 실패:", error);
        appendMessage('bot', "챗봇 응답에 실패했습니다.");
    }

    // 메시지 전송 후 업로드된 이미지 초기화 및 버튼 색상 복구
    uploadedImage = null;
    uploadBtn.classList.remove('file-selected');  // 파일 선택 상태 제거
    uploadedImage = null;  // 이미지 초기화
}


        // 요청 본문을 빌드하는 함수
        function buildRequestBody(message) {
            let prompt = `${characterPrompts[currentCharacter]}

지난 대화기록 : ${conversationHistories[currentCharacter]}
질문 : ${message}
            `;

            const requestBody = {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            };

            if (uploadedImage) {
                requestBody.contents[0].parts.push({
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: uploadedImage.split(',')[1]
                    }
                });

               // 이미지 데이터가 포함되었는지 확인하는 로그 출력
        // console.log("이미지 포함된 requestBody:", requestBody);
            }

            return requestBody;
        }

        // 메시지를 UI에 추가하는 함수
function appendMessage(sender, text) {
    const newMessage = document.createElement('li');
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    newMessage.classList.add('message', sender);

    if (sender === 'user') {
        newMessage.innerHTML = `
            <div class="message-content">
                ${uploadedImage ? `<img src="${uploadedImage}" alt="Uploaded Image" class="uploaded-image">` : ''}
                <p class="text">${text}</p>
                <span class="timestamp">${currentTime}</span>
            </div>
        `;
    } else if (sender === 'bot') {
        const characterImages = {
            1: "https://i.namu.wiki/i/5SrKObt3pZ5ph_Xvwcae0aws7Gtp063pbIKGp0kBmfviJft07IHmsOENzvHsgAR8B7ozNSUDlzp09NDGuULpog.webp",
            2: "https://ojsfile.ohmynews.com/down/images/1/rheekm_193396_1[248978].jpg",
            3: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Carl_Friedrich_Gauss.jpg/300px-Carl_Friedrich_Gauss.jpg"
        };
        // 봇 메시지에서는 이미지가 출력되지 않도록 수정
        newMessage.innerHTML = `
            <div class="profile">
                <img src="${characterImages[currentCharacter]}" alt="Bot Profile">
            </div>
            <div class="message-content">
                <p class="text">${text}</p>
                <span class="timestamp">${currentTime}</span>
            </div>
        `;
    }

    chatThread.appendChild(newMessage);
    chatThread.scrollTop = chatThread.scrollHeight;
}



        // 폼 제출 시 이벤트 처리
        chatForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const userMessage = chatInput.value.trim();

            // 메시지가 없고 이미지가 업로드된 경우 이미지만 전송
            if (!userMessage && uploadedImage) {
                sendMessageToAPI('');
                chatInput.value = ''; // 입력 창 초기화
                return;
            }

            // 메시지가 있을 경우 메시지와 함께 전송
            if (userMessage || uploadedImage) {
                sendMessageToAPI(userMessage);
                chatInput.value = ''; // 입력 창 초기화
            }
        });
