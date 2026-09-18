import { getModel } from "../config/llmmodel.js";

// const systemPrompt = "You are an expert software developer. Provide clean, efficient, and well-commented code solutions.";

// export const coding = async (state) => {
//   const llm = getModel("gemini");
//   const response = await llm.invoke([
//     { role: "system", content: systemPrompt },
//     { role: "human", content: state.prompt }
//   ]);
//   return { ...state, aiResponse: response.content };
// };


export const coding= async(state)=>{
  const intentllm = getModel("intent");
  const intentResponse = await intentllm.invoke(`
    You are intent classifier,
    
    return only one of these values.
    CODE_GENERATION
    CODE_REVIEW
    CODE_DEBUGGING
    CODE_OPTIMIZATION
    CODE_EXPLANATION
    CODE_DOCUMENTATION
    CODE_REFACTORING
    CODE_TESTING
    CODE_DEPLOYMENT
    CODE_MAINTENANCE
    
    User Request:${state.prompt}`
  )
  const intent = intentResponse.content;

  if(intent === "CODE_GENERATION"){
    const llm = getModel("coding");
  const prompt = `
You are CortexAI Coding Agent.

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested.

Rules:

- Responsive
- Modern UI
- CSS Variables
- Flexbox/Grid
- Smooth Scroll
- Hover Effects
- Beautiful spacing
- Single page unless user asks otherwise.
- Use unsplash real images dont use placeholder.

Return ONLY valid JSON.

Schema:

{
  "files": [
    {
      "name":"index.html",
      "content":"..."
    },
    {
      "name":"style.css",
      "content":"..."
    },
    {
      "name":"script.js",
      "content":"..."
    }
  ]
}

Rules:

- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No \`\`\`
- Never mention intent

User Request:
{
  ${state.prompt}
}
`;

    const res = await llm.invoke(prompt);
    const content = JSON.parse(res.content);
    return { ...state, aiResponse: "code generated successfully" ,
      artifacts: [{
        id:Date.now(),
        type:"Project",
      files: content.files || [],
    title:state.prompt}
      ]
    };
  }

  const res = await llm.invoke(`
    The user request is :
    ${intent}
    Return Markdown only.

Never generate project files.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)

User Request:

${state.prompt}
    `)

    const data = res.content;
    return { ...state, aiResponse: data ,artifacts: []};

}