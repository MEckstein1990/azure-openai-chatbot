# Azure OpenAI Chatbot

This repository contains a chatbot application that uses an Azure OpenAI model for generating responses. The architecture includes:

- **Backend:** C# ASP.NET Core minimal API that interfaces with the Azure OpenAI Service.
- **Frontend:** React application to interact with the user.

---

## Features

- Leverages Azure OpenAI API for natural language understanding and generation.
- Minimalistic and user-friendly chat interface in React.
- Easily configurable via environment variables.

---

## Prerequisites

- .NET 7 SDK (https://dotnet.microsoft.com/download/dotnet/7.0)
- Node.js >= 16.x (https://nodejs.org/)
- Azure OpenAI resource with deployed model

---

## Setup

### Backend

1. Navigate to the `backend` directory.
2. Set environment variables:

```bash
# On Windows (PowerShell)
$env:AZURE_OPENAI_API_KEY="your_api_key"
$env:AZURE_OPENAI_ENDPOINT="https://your-resource-name.openai.azure.com/"
$env:AZURE_OPENAI_DEPLOYMENT_NAME="your_deployment_name"

# On Linux/macOS
export AZURE_OPENAI_API_KEY="your_api_key"
export AZURE_OPENAI_ENDPOINT="https://your-resource-name.openai.azure.com/"
export AZURE_OPENAI_DEPLOYMENT_NAME="your_deployment_name"
```

3. Run the backend:

```bash
cd backend
dotnet run
```

The backend API will be available at `http://localhost:5000` or as shown in the console.

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Start the React frontend:

```bash
npm start
```

The React app will open automatically at `http://localhost:3000`.

### Proxy Configuration

To forward frontend API requests to the backend, you can create a `proxy` entry in the `frontend/package.json`:

```json
"proxy": "http://localhost:5000"
```

Alternatively, configure CORS in the backend (already has AllowAnyOrigin for simplicity).

---

## Usage

- Open the React app in your browser.
- Type a message in the textbox and press 
"Send" or Enter.
- The chatbot responds using the Azure OpenAI model.

---

## Notes

- Store your Azure OpenAI API key securely and do not commit it to any repository.
- For production, you should refine CORS policies and add security measures.

---

## License

MIT License
