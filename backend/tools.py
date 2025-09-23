"""
Agentic Tools for the AI Assistant
These tools enable the AI to perform actions beyond just responding
"""
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import os

class AgenticTools:
    def __init__(self):
        self.conversation_memory = {}
        self.user_goals = []
        self.ongoing_tasks = []
    
    def search_web(self, query: str) -> str:
        """Search the web for current information"""
        try:
            # Using DuckDuckGo instant answer API (no API key required)
            url = f"https://api.duckduckgo.com/"
            params = {
                'q': query,
                'format': 'json',
                'no_html': '1',
                'skip_disambig': '1'
            }
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            # Check for Abstract (instant answer)
            if data.get('Abstract'):
                return f"Web search result: {data['Abstract']}"
            
            # Check for RelatedTopics
            elif data.get('RelatedTopics'):
                topics = data['RelatedTopics'][:5]  # Get more topics
                results = []
                for topic in topics:
                    if topic.get('Text'):
                        results.append(topic['Text'])
                    elif topic.get('FirstURL'):
                        # Extract title from URL or use the topic name
                        title = topic.get('Text', topic.get('FirstURL', ''))
                        results.append(title)
                
                if results:
                    return f"Web search results: {'; '.join(results[:3])}"
            
            # Check for Definition
            elif data.get('Definition'):
                return f"Definition: {data['Definition']}"
            
            # Check for Answer
            elif data.get('Answer'):
                return f"Answer: {data['Answer']}"
            
            # If no specific results, provide helpful guidance
            else:
                if 'job' in query.lower() or 'career' in query.lower() or 'hiring' in query.lower():
                    return f"""Web search for '{query}' didn't return specific results from DuckDuckGo. 

For job searches, I recommend checking these specialized platforms:
• LinkedIn Jobs (linkedin.com/jobs)
• Indeed (indeed.com) 
• Glassdoor (glassdoor.com)
• AngelList (angel.co) for startup jobs
• Remote.co for remote positions
• Stack Overflow Jobs for tech roles

These platforms have more current and relevant job postings than general web search."""
                else:
                    return f"Web search for '{query}' didn't return specific results. Try rephrasing your search or using more specific terms."
                    
        except Exception as e:
            return f"Web search failed: {str(e)}. Please try again or use more specific search terms."

    
    def analyze_skills(self, job_description: str) -> str:
        """Analyze how Frank's skills match a job description"""
        frank_skills = [
            "React", "TypeScript", "Node.js", "Python", "JavaScript", 
            "HTML", "CSS", "MongoDB", "PostgreSQL", "AWS", "Docker"
        ]
        
        job_lower = job_description.lower()
        matched_skills = [skill for skill in frank_skills if skill.lower() in job_lower]
        
        if matched_skills:
            return f"Frank's matching skills: {', '.join(matched_skills)}. He has strong experience in these technologies."
        else:
            return "No direct skill matches found, but Frank is a quick learner and can adapt to new technologies."
    
    
    def remember_conversation(self, key: str, value: Any) -> str:
        """Store information in conversation memory"""
        self.conversation_memory[key] = value
        return f"Remembered: {key} = {value}"
    
    def recall_memory(self, key: str) -> str:
        """Recall information from conversation memory"""
        if key in self.conversation_memory:
            return f"Recalled: {key} = {self.conversation_memory[key]}"
        else:
            return f"No memory found for: {key}"
    
    def search_jobs(self, query: str) -> str:
        """Search for job opportunities with specific guidance"""
        job_terms = ['react', 'javascript', 'typescript', 'node', 'python', 'developer', 'engineer', 'programmer']
        query_lower = query.lower()
        
        # Check if it's a tech job search
        is_tech_job = any(term in query_lower for term in job_terms)
        
        if is_tech_job:
            return f"""Based on your search for "{query}", here are the best platforms for tech job opportunities:

🎯 **Primary Job Boards:**
• **LinkedIn Jobs** - Best for professional networking and job discovery
• **Indeed** - Largest job database with good filtering
• **Glassdoor** - Company reviews + job listings
• **Stack Overflow Jobs** - Developer-focused platform

🚀 **Tech-Specific Platforms:**
• **AngelList** - Startup jobs and equity opportunities  
• **Remote.co** - Remote-first positions
• **We Work Remotely** - Remote tech jobs
• **GitHub Jobs** - Developer community jobs

💡 **Pro Tips for Frank:**
• Use keywords: "React Developer", "Full Stack Engineer", "Frontend Developer"
• Filter by: Remote, Salary range, Company size
• Set up job alerts on multiple platforms
• Network on LinkedIn with recruiters and developers

🔍 **Search Strategy:**
1. Search multiple platforms simultaneously
2. Use variations: "React", "ReactJS", "React.js"
3. Include location: "Remote React Developer" or "Chennai React Jobs"
4. Check company career pages directly

Would you like me to help analyze any specific job descriptions you find?"""
        else:
            return f"""For general job searches, I recommend these platforms:

• **LinkedIn Jobs** - Professional networking
• **Indeed** - Comprehensive job database  
• **Glassdoor** - Company insights + jobs
• **Monster** - Traditional job board
• **ZipRecruiter** - AI-powered matching

For your search "{query}", try using more specific terms or industry keywords for better results."""

# Global tools instance
tools = AgenticTools()

# Function definitions for OpenAI function calling
FUNCTION_DEFINITIONS = [
    {
        "name": "search_web",
        "description": "Search the web for current information about any topic",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query"
                }
            },
            "required": ["query"]
        }
    },
    {
        "name": "analyze_skills",
        "description": "Analyze how Frank's skills match a job description",
        "parameters": {
            "type": "object",
            "properties": {
                "job_description": {"type": "string", "description": "Job description to analyze"}
            },
            "required": ["job_description"]
        }
    },
    {
        "name": "remember_conversation",
        "description": "Store information in conversation memory for later recall",
        "parameters": {
            "type": "object",
            "properties": {
                "key": {"type": "string", "description": "Key to store the information under"},
                "value": {"type": "string", "description": "Information to store"}
            },
            "required": ["key", "value"]
        }
    },
    {
        "name": "recall_memory",
        "description": "Recall information from conversation memory",
        "parameters": {
            "type": "object",
            "properties": {
                "key": {"type": "string", "description": "Key to recall information for"}
            },
            "required": ["key"]
        }
    },
    {
        "name": "search_jobs",
        "description": "Search for job opportunities with specific platform recommendations",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Job search query (e.g., 'React developer jobs', 'Python engineer positions')"}
            },
            "required": ["query"]
        }
    },
]
