const LLM_MODEL_NAME = "tinyllama:chat"

document.addEventListener('DOMContentLoaded', () => {
    const sendMessageButton = document.getElementById('sendMessage');
    const inputText = document.getElementById('inputText');
    const messages = document.getElementById('messages');
    const userInputDiv = document.getElementById('userInput');

    function addMessage(message){
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}`; // Add role class here

        const roleDiv = document.createElement('div');
        roleDiv.className = 'role';
        roleDiv.textContent = message.role; // Display role

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.textContent = message.content;

        messageDiv.appendChild(roleDiv);
        messageDiv.appendChild(contentDiv);

        messages.appendChild(messageDiv);
    }

    sendMessageButton.addEventListener('click', function() {
        const messageContent = inputText.value.trim();

        if (messageContent) {
            addMessage({
                role: 'user',
                content: messageContent
            });

            inputText.value = ''; // Clear input after sending

            getResponse();
        }
    });

    function toggleUserInputFields(disabled) {
        inputText.disabled = !disabled;
        sendMessageButton.disabled = !disabled;
    }

    function getResponse(){
        toggleUserInputFields(false);
        const messages = getMessages();
        console.log(messages);

        const response = fetch(`/proxy/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: LLM_MODEL_NAME,
                messages: messages,
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Assuming the server response includes a message or messages array
            console.log(data);
            if (data.choices && data.choices.length > 0) {
                addMessage(data.choices[0].message);
            }
        })
        .catch(error => console.error('Error:', error))
        .finally(() => {
            toggleUserInputFields(true);
        });
    }

    function getMessages() {
        const messages = [];

        const messageDivs = document.querySelectorAll('.message');

        //message just has role = user | system | assistant and content: str
        
        for (let i = 0; i < messageDivs.length; i++) {
            const messageDiv = messageDivs[i];
            const role = messageDiv.querySelector('.role').textContent;
            const content = messageDiv.querySelector('.content').textContent;

            messages.push({
                role,
                content
            });
        }

        return messages;
    }
});
