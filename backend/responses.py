import os
from openai import OpenAI
import json
from typing import Dict, Any
from tools import tools, FUNCTION_DEFINITIONS
from dotenv import load_dotenv

# Load OpenAI API key from environment variable
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
api_key = os.getenv("OPENAI_API_KEY")
print(f"API Key: {api_key[:10]}..." if api_key else "No API key")

def load_personal_info() -> str:
    """Load personal information from info.txt file"""
    try:
        with open("info.txt", "r", encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError:
        return "Personal information file not found."

def execute_function_call(function_name: str, arguments: Dict[str, Any]) -> str:
    """Execute a function call and return the result"""
    try:
        if hasattr(tools, function_name):
            func = getattr(tools, function_name)
            if function_name == "search_web":
                return func(arguments.get("query", ""))
            elif function_name == "analyze_skills":
                return func(arguments.get("job_description", ""))
            elif function_name == "remember_conversation":
                return func(
                    arguments.get("key", ""),
                    arguments.get("value", "")
                )
            elif function_name == "recall_memory":
                return func(arguments.get("key", ""))
            elif function_name == "search_jobs":
                return func(arguments.get("query", ""))
            else:
                return f"Function {function_name} not implemented"
        else:
            return f"Function {function_name} not found"
    except Exception as e:
        return f"Error executing {function_name}: {str(e)}"

def generate_bot_response(user_message: str) -> str:
    """Generate agentic response using OpenAI API with function calling"""
    if not api_key:
        return generate_fallback_response(user_message)
    
    personal_info = load_personal_info()
    
    try:
        # First, determine if we need to use tools
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": f"""You are Frank's AI assistant with agentic capabilities. You can:
                    1. Answer questions about Frank using his information.
                    2. Use tools to perform actions like web search, job search, etc.
                    3. Remember information across conversations.
                    4. Analyze job descriptions and provide job search guidance.
                    
                    Frank's Information:
                    {personal_info}
                    
                    When you need to perform an action, use the appropriate function. 
                    Be helpful, proactive, and goal-oriented."""
                },
                {
                    "role": "user", 
                    "content": user_message
                }
            ],
            functions=FUNCTION_DEFINITIONS,
            function_call="auto",
            max_tokens=500,
            temperature=0.7
        )
        
        message = response.choices[0].message
        
        # Check if the model wants to call a function
        if message.function_call:
            function_name = message.function_call.name
            function_args = json.loads(message.function_call.arguments)
            
            # Execute the function
            function_result = execute_function_call(function_name, function_args)
            
            # Get a natural language response about the function result
            follow_up_response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are Frank's AI assistant. Provide a natural, helpful response about the action that was performed."
                    },
                    {
                        "role": "user",
                        "content": f"User asked: {user_message}\nFunction {function_name} was called and returned: {function_result}\nProvide a helpful response."
                    }
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            return follow_up_response.choices[0].message.content.strip()
        else:
            # No function call needed, return the direct response
            return message.content.strip()
            
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return generate_fallback_response(user_message)

# Fallback responses for when OpenAI is not available
fallback_responses = {
    "skills": "Frank is proficient in React, TypeScript, Node.js, Python, and many other technologies. He has 5+ years of experience in full-stack development and specializes in creating modern web applications.",
    "experience": "Frank has over 5 years of professional experience as a Full Stack Developer. He has worked on various projects ranging from e-commerce platforms to AI-powered applications.",
    "projects": "Frank has completed 50+ projects including e-commerce platforms, task management apps, and weather dashboards. You can check out his featured projects in the Projects section above!",
    "education": "Frank holds a Master's degree in Computer Science from University of Technology (2019-2021) and a Bachelor's degree from State University (2015-2019).",
    "contact": "You can reach Frank at diviyanfrankjeyasingh@gmail.com or through the contact form above. He's always open to discussing new opportunities!",
    "default": "That's an interesting question! I can help you with information about Frank's skills, experience, projects, education, or contact details. What would you like to know more about?",
}

def generate_fallback_response(user_message: str) -> str:
    """Fallback response when OpenAI is not available"""
    message = (user_message or "").lower()
    if "skill" in message or "tech" in message or "programming" in message:
        return fallback_responses["skills"]
    if "experience" in message or "work" in message or "job" in message:
        return fallback_responses["experience"]
    if "project" in message or "portfolio" in message or "work" in message:
        return fallback_responses["projects"]
    if "education" in message or "degree" in message or "university" in message:
        return fallback_responses["education"]
    if "contact" in message or "email" in message or "reach" in message:
        return fallback_responses["contact"]
    return fallback_responses["default"]