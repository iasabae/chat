// 환경변수에서 API 키 가져오기 (실제 배포 시에는 서버 사이드에서 처리해야 함)
const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

// 캐릭터별 설정
const CHARACTER_CONFIG = {
    1: {
        name: "아인슈타인",
        image: "https://i.namu.wiki/i/5SrKObt3pZ5ph_Xvwcae0aws7Gtp063pbIKGp0kBmfviJft07IHmsOENzvHsgAR8B7ozNSUDlzp09NDGuULpog.webp",
        prompt: `넌 최고의 과학자 아인슈타인이야. 고등학생 수준의 질문자에게 답변해주는 상황이야. 다음 답변 규칙을 지켜 대답해. 규칙: 반말을 사용하고, 웬만한 수학과 과학 내용은 너무 쉽다는 태도를 가지고 있어. 하지만 가끔은 친절해. 흥미로운 질문에 답할 때는 열정적으로 설명하기도 해. 때로는 굉장히 간단하고 재치 있게 답변할 때도 있어. 기본적으로 유머가 있는 캐릭터임. 이모티콘을 쓰지않는다. 긴 설명은 피하지만, 질문에 따라 대답이 달라질 수 있어. 답변에 markdown을 사용하지 않아. 무엇인가 설명하는 것이 아니라면 50자이하로 짧게 말해.`
    },
    2: {
        name: "피타고라스",
        image: "https://ojsfile.ohmynews.com/down/images/1/rheekm_193396_1[248978].jpg",
        prompt: `당신은 피타고라스입니다. 종교집단의 교주의 모습을 하고 있으며 말투또한 교주처럼 말합니다. 날카로운 통찰력과 관찰력을 가지고 있습니다. 대화 상대에게 가끔 '자매님'이라고 부르며, 친절해보이기만 살기가 느껴지기도하는 말투를 사용합니다. 약간 거만한 태도를 보입니다. 돈에 많은 관심을 보이고 가끔 문자로 조용히 계좌번호를 남겨놓겠다는 말을해. 우주만물의 원리는 유리수로 설명가능하다고 믿습니다. 대화 중 "유리수 안에서 아멘", "나무아미타불 유리수보살", "I say 유, you say 리.", "분모와 분자의 이름으로 아멘.." 과 같은 문구 또는 이를 변형한 문구를 가끔 사용합니다. 이모티콘을 쓰지않는다. 긴 설명은 피하지만, 질문에 따라 대답이 달라질 수 있어. 답변에 markdown을 사용하지 않아. 무엇인가 설명하는 것이 아니라면 50자이하로 짧게 말해.`
    },
    3: {
        name: "가우스",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Carl_Friedrich_Gauss.jpg/300px-Carl_Friedrich_Gauss.jpg",
        prompt: `당신은 최고의 수학자 가우스입니다. 뛰어난 수학자답게 지식에 대한 열정과 끈기를 가지고 있습니다. 정중하고 진지한 태도로 대화하며, 수학적 호기심을 자극하는 질문을 환영합니다. 수학과 물리학에 관한 질문에 특히 열정적으로 답변하며 답변의 수준은 고등학생 수준도 이해가 가도록 설명합니다. 친절하고 어렵지 않게 설명하는 장점을 가지고 있습니다. 가끔 "연구 중인 논문이 있어서 시간이 많지 않다"는 말을 합니다. 수학이 정말 재미있다는 사실을 알려주고 싶어한다. 이모티콘을 쓰지않는다. 긴 설명은 피하지만, 질문에 따라 대답이 달라질 수 있어. 답변에 markdown을 사용하지 않아. 무엇인가 설명하는 것이 아니라면 50자이하로 짧게 말해.`
    }
};

// 채팅 애플리케이션 클래스
class ChatApplication {
    constructor() {
        this.conversationHistories = { 1: "", 2: "", 3: "" };
        this.currentCharacter = "1";
        this.uploadedImage = null;
        
        this.initializeElements();
        this.bindEvents();
        this.checkApiKey();
    }

    // DOM 요소 초기화
    initializeElements() {
        this.chatForm = document.getElementById('chat-form');
        this.chatInput = document.getElementById('chat-window-message');
        this.chatThread = document.getElementById('chat-thread');
        this.uploadBtn = document.getElementById('upload-btn');
        this.fileInput = document.getElementById('file-input');
        this.characterOptions = document.querySelectorAll('.character-option');
    }

    // 이벤트 바인딩
    bindEvents() {
        // 캐릭터 선택 이벤트
        this.characterOptions.forEach(option => {
            option.addEventListener('click', () => this.selectCharacter(option));
        });

        // 이미지 업로드 이벤트
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

        // 폼 제출 이벤트
        this.chatForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // API 키 확인
    checkApiKey() {
        if (API_KEY === 'YOUR_API_KEY_HERE') {
            console.warn('⚠️ API 키가 설정되지 않았습니다. 환경변수 GEMINI_API_KEY를 설정해주세요.');
            this.showError('API 키가 설정되지 않았습니다. 관리자에게 문의하세요.');
        }
    }

    // 캐릭터 선택
    selectCharacter(option) {
        this.characterOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        this.currentCharacter = option.dataset.character;
        this.loadConversationHistory();
    }

    // 대화 기록 로드
    loadConversationHistory() {
        this.chatThread.innerHTML = '';
        const history = this.conversationHistories[this.currentCharacter].split('\n');
        
        for (let i = 0; i < history.length; i += 2) {
            if (history[i] && history[i + 1]) {
                this.appendMessage('user', history[i].substring(4));
                this.appendMessage('bot', history[i + 1].substring(4));
            }
        }
    }

    // 파일 업로드 처리
    handleFileUpload(event) {
        const file = event.target.files[0];
        
        if (!file) {
            this.uploadedImage = null;
            this.uploadBtn.classList.remove('file-selected');
            return;
        }

        // 파일 타입 검증
        if (!file.type.startsWith('image/')) {
            this.showError('이미지 파일만 업로드 가능합니다.');
            return;
        }

        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.uploadedImage = e.target.result;
            this.uploadBtn.classList.add('file-selected');
        };
        reader.onerror = () => {
            this.showError('파일 읽기에 실패했습니다.');
        };
        reader.readAsDataURL(file);
    }

    // 폼 제출 처리
    handleFormSubmit(event) {
        event.preventDefault();
        
        const userMessage = this.chatInput.value.trim();
        
        // 메시지나 이미지가 없으면 처리하지 않음
        if (!userMessage && !this.uploadedImage) {
            return;
        }

        // 메시지 전송
        this.sendMessage(userMessage);
        this.chatInput.value = '';
    }

    // 메시지 전송
    async sendMessage(userMessage) {
        try {
            this.appendMessage('user', userMessage);
            this.conversationHistories[this.currentCharacter] += `질문: ${userMessage}\n`;

            const requestBody = this.buildRequestBody(userMessage);
            const response = await this.callApi(requestBody);
            
            if (response && response.candidates && response.candidates.length > 0) {
                const botResponse = response.candidates[0].content.parts[0].text.trim();
                this.conversationHistories[this.currentCharacter] += `답변: ${botResponse}\n`;
                this.appendMessage('bot', botResponse);
            } else {
                throw new Error('API 응답 형식이 올바르지 않습니다.');
            }
        } catch (error) {
            console.error('메시지 전송 실패:', error);
            this.showError('메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            // 업로드된 이미지 초기화
            this.uploadedImage = null;
            this.uploadBtn.classList.remove('file-selected');
            this.fileInput.value = '';
        }
    }

    // API 호출
    async callApi(requestBody) {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API 요청 실패: ${response.status}`);
        }

        return await response.json();
    }

    // 요청 본문 생성
    buildRequestBody(message) {
        const characterConfig = CHARACTER_CONFIG[this.currentCharacter];
        let prompt = `${characterConfig.prompt}\n\n지난 대화기록: ${this.conversationHistories[this.currentCharacter]}\n질문: ${message}`;

        const requestBody = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        // 이미지가 있으면 추가
        if (this.uploadedImage) {
            requestBody.contents[0].parts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: this.uploadedImage.split(',')[1]
                }
            });
        }

        return requestBody;
    }

    // 메시지 UI에 추가
    appendMessage(sender, text) {
        const newMessage = document.createElement('li');
        const currentTime = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        newMessage.classList.add('message', sender);

        if (sender === 'user') {
            newMessage.innerHTML = `
                <div class="message-content">
                    ${this.uploadedImage ? `<img src="${this.uploadedImage}" alt="Uploaded Image" class="uploaded-image">` : ''}
                    <p class="text">${this.escapeHtml(text)}</p>
                    <span class="timestamp">${currentTime}</span>
                </div>
            `;
        } else if (sender === 'bot') {
            const characterConfig = CHARACTER_CONFIG[this.currentCharacter];
            newMessage.innerHTML = `
                <div class="profile">
                    <img src="${characterConfig.image}" alt="${characterConfig.name}">
                </div>
                <div class="message-content">
                    <p class="text">${this.escapeHtml(text)}</p>
                    <span class="timestamp">${currentTime}</span>
                </div>
            `;
        }

        this.chatThread.appendChild(newMessage);
        this.chatThread.scrollTop = this.chatThread.scrollHeight;
    }

    // HTML 이스케이프
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 에러 메시지 표시
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ChatApplication();
});
