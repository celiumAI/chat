import fastapi
from typing import List
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = fastapi.FastAPI()

LLM_BASE_URL = "http://localhost:11434"


class Link(BaseModel):
    source: str
    target: str


class MessageNode(BaseModel):
    id: str
    name: str
    timestamp: int
    origin: str
    text: str


class Message(BaseModel):
    role: str
    content: str


class ChatCompletionRequest(BaseModel):
    messages: List[Message]
    model: str


class ChatCompletionChoice(BaseModel):
    message: Message


class ChatCompletionResponse(BaseModel):
    choices: List[ChatCompletionChoice]


app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def read_root():
    return fastapi.responses.FileResponse("index.html")


def request_chat_completion(
        request: ChatCompletionRequest
) -> ChatCompletionResponse:
    import requests

    try:
        response = requests.post(
            f"{LLM_BASE_URL}/v1/chat/completions",
            json=request.dict()
        )

    except requests.exceptions.RequestException as e:
        print(e)
        return ChatCompletionResponse(
            choices=[
                ChatCompletionChoice(
                    message=Message(
                        role="system",
                        content="Request failed: " + str(e)
                    )
                )
            ])

    return response.json()


@app.post("/proxy/v1/chat/completions")
def make_chat_completion(
        request: ChatCompletionRequest
) -> ChatCompletionResponse:
    chat_response = request_chat_completion(request)
    return chat_response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=5020)
