import { type Memory } from '../types';

const mockMemories: Memory[] = [
  {
    id: 'mem-1',
    title: 'PWA 部署策略',
    summary: '討論了使用 Codespaces 進行開發，Render 作為後端，並將前端部署為 PWA。',
    fullContent: `[A] To deploy our MMCA system, we should use GitHub Codespaces for development, a Render Web Service for our Node.js API proxy, and a static PWA for the frontend. [B] The plan is solid. The API Key must be an environment variable on Render, not exposed to the PWA. [C] This architecture also supports CI/CD via Git-hooks on Render for automatic deployments from the main branch. [Agent] Approved plan: We will proceed with the Codespaces -> Render (Backend) -> PWA (Frontend) architecture. The key will be secured on the backend, and CI/CD will be enabled.`,
    timestamp: '2025-11-12T10:00:00Z',
  },
  {
    id: 'mem-2',
    title: 'MMCA 的 UI 規格',
    summary: 'UI 必須解析標記後的回應，並將其顯示在獨立的氣泡中。同時也需要一個記憶側邊欄。',
    fullContent: `[A] The frontend needs to parse responses from the agent, looking for [A], [B], [C], and [Agent] tags. [B] Correct. Each tagged section should be visually distinct to ensure traceability for the user. [C] We should also include a sidebar or modal where users can view and cite memories from Firestore. [Agent] Final UI spec: Implement a chat interface that parses and displays tagged responses in separate styled containers. Also, create a "Memory Panel" for viewing and citing past conversations.`,
    timestamp: '2025-11-12T11:30:00Z',
  },
  {
    id: 'mem-3',
    title: 'Firestore 記憶體結構',
    summary: '定義了在 Firestore 中儲存記憶日誌的 JSON 結構，每次 Agent 回應後觸發。',
    fullContent: `[A] Let's define the memory structure as a JSON object containing date, theme, summaries of model outputs, and the final Agent decision. [B] The structure is logical. It should be written to Firestore at the path /artifacts/{appId}/users/{userId}/memory_logs. [C] This automatic, structured logging will be crucial for the RAG features outlined in Scene 2 and 3. [Agent] The memory log will be a JSON object with keys: date, theme, material_summary, model_a_conclusion, model_b_findings, model_c_additions, agent_final_decision. The backend will handle writing this to Firestore after receiving the final response.`,
    timestamp: '2025-11-12T14:00:00Z',
  },
];

// Reverted to a mock function to avoid browser-side errors with process.env and API keys.
// The actual API call should be handled by a secure backend proxy.
export const getAgentResponse = async (prompt: string, memories: Memory[]): Promise<string> => {
    console.log("Simulating agent response for prompt:", prompt, "with memories:", memories);

    // Check for memory citation to provide a more dynamic mock response
    const citationRegex = /\[正在引用記憶：「([^」]+)」\]/g;
    const match = citationRegex.exec(prompt);
    let responseContent: string;

    if (match) {
        const memoryTitle = match[1];
        responseContent = `[A] 已收到您對記憶「${memoryTitle}」的引用。該內容已被整合到本次回應的上下文中。
[B] 所引用的記憶有效，且與當前查詢相關。
[C] 補充說明，整合過去的對話能讓交流更連貫、更具情境感知能力。
[Agent] 根據您的查詢以及所引用的記憶「${memoryTitle}」，這是在整合該知識後的回應。`;
    } else {
        responseContent = `[A] 根據您的查詢「${prompt}」，初步評估這是一個有效且有趣的問題。
[B] 事實核查完畢。查詢的前提是合理的，沒有明顯矛盾。
[C] 為了提供更多背景資訊，通常可以考慮此主題與更廣泛的行業趨勢和未來可能性的關聯。
[Agent] 總結來說，您的請求「${prompt}」已處理完畢。這是一個格式良好的查詢，開啟了多個可供探索的方向。`;
    }

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(responseContent);
        }, 1200); // Simulate network delay
    });
};


export const getMockMemories = (): Promise<Memory[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockMemories);
    }, 500);
  });
};