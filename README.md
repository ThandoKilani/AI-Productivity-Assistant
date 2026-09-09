# AI Smart Work

Build a complete modern, responsive web application called AI Workplace Productivity Assistant.

The application is a professional SaaS-style productivity platform that helps workplace users automate common tasks using AI.

PRIMARY OBJECTIVE

Create a polished, functional AI productivity dashboard that demonstrates:

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner / Scheduler

AI Research Assistant

AI Workplace Chatbot

The application should prioritize excellent UX, strong prompt engineering, structured AI outputs, responsible AI practices, responsive design, and presentation quality.

DESIGN DIRECTION

Use a clean, modern professional SaaS aesthetic.

Design characteristics:

Minimal and elegant interface

White/light neutral main workspace

Dark or deep-colored sidebar

Rounded cards

Subtle shadows

Clear typography

Strong visual hierarchy

Professional blue/purple accent color

Modern icons

Generous spacing

Smooth hover states

Loading states

Empty states

Success/error notifications

Responsive mobile and desktop layouts

Do not make the interface look like a generic template.

The product should feel like a real workplace SaaS application.

APPLICATION STRUCTURE

Create the following routes/pages:

Dashboard

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner

AI Research Assistant

AI Workplace Chat

Settings

Responsible AI

GLOBAL LAYOUT

Create a reusable application shell.

Desktop:

Fixed left sidebar

Main content area

Top header

User/profile area

Mobile:

Collapsible navigation

Hamburger menu

Full-width content

Responsive cards and forms

Sidebar navigation:

Dashboard
Smart Email
Meeting Notes
Task Planner
Research Assistant
AI Chat
Settings
Responsible AI

Highlight the active navigation item.

DASHBOARD

Create a professional dashboard landing page.

Header:

"Good morning 👋"

Subtitle:

"Your AI-powered workplace productivity assistant."

Add quick statistics cards:

Emails Generated

Meetings Summarized

Tasks Planned

Research Sessions

Add a "Quick Actions" section with five cards:

Generate an Email

Summarize Meeting

Plan My Day

Research a Topic

Ask AI Assistant

Add a "Recent Activity" section.

Add a "Today's Priorities" section.

Add a small Responsible AI notice near the bottom.

SMART EMAIL GENERATOR

Create a two-column desktop interface.

Left side: input form.

Fields:

Email purpose

Recipient/context

Main points

Tone selector

Length selector

Tone options:

Formal

Friendly

Persuasive

Professional

Concise

Length options:

Short

Medium

Detailed

Button:

"Generate Email"

Right side:

"AI Generated Email"

Display the generated result inside an editable text editor.

Buttons:

Copy

Regenerate

Clear

Allow users to edit the generated email before copying it.

AI prompt requirements:

Act as a professional workplace communication assistant.

Generate an email using only information supplied by the user.

Maintain the selected tone and requested length.

Make the email clear, concise, grammatically correct and professionally appropriate.

Do not invent names, dates, commitments, facts, promises, or details.

Use a suitable subject line.

Return:

SUBJECT:
EMAIL BODY:

If information is missing, make the safest reasonable assumption only when it does not introduce factual claims; otherwise ask the user to clarify.

MEETING NOTES SUMMARIZER

Create an input/output workspace.

Input:

Large textarea labeled:

"Paste your meeting notes"

Optional fields:

Meeting title

Meeting date

Participants

Button:

"Summarize Meeting"

Output should be structured into cards:

Executive Summary

Short summary of the meeting.

Key Discussion Points

Bullet list.

Decisions

Clearly identified decisions.

Action Items

Each action item should contain:

Task

Owner, if explicitly mentioned

Deadline, if explicitly mentioned

Important Dates

Extract dates mentioned in the notes.

Follow-up Questions

Identify unclear or unresolved issues.

Prompt requirements:

Only extract information present in the supplied notes.

Never invent attendees, deadlines, decisions or responsibilities.

Clearly distinguish explicit information from inferred information.

If an owner or deadline is not stated, display "Not specified."

AI TASK PLANNER

Create a task planning interface.

Inputs:

Task list

Deadlines

Priority

Estimated duration

Available working hours

Optional scheduling preferences

Priority options:

Critical

High

Medium

Low

Buttons:

"Generate Schedule"

"Regenerate"

Output:

Today's Schedule

Display tasks in chronological order.

Each task should show:

Time

Task

Priority

Estimated duration

Deadline

Also show:

Priority Overview

Critical tasks

High priority tasks

Medium priority tasks

Low priority tasks

AI scheduling logic should consider:

Deadline urgency

Task importance

Priority

Estimated effort

Available working hours

Logical task dependencies when explicitly provided

Do not schedule tasks outside the user's available working hours.

Do not invent deadlines.

If the workload cannot realistically fit into the available time, clearly tell the user and suggest what should be moved or deprioritized.

AI RESEARCH ASSISTANT

Create a research workspace.

Inputs:

Research question/topic

Optional source/article text

Desired research depth

Depth options:

Quick

Standard

Detailed

Button:

"Research Topic"

Output:

Executive Summary

Key Insights

Important Findings

Recommendations

Potential Risks / Limitations

Further Questions

If the user provides article or source text, distinguish between:

"Based on provided material"

and

"AI-generated analysis"

Never fabricate citations, URLs, publications, statistics, or sources.

If external web search is not available, clearly state that the response is based on the information provided and the AI's existing knowledge.

AI WORKPLACE CHAT

Create a modern chatbot interface.

Features:

Chat history

User messages

AI messages

Message timestamps

Loading indicator

Suggested prompts

Copy response

Clear conversation

Suggested prompts:

"Help me prioritize today's work."

"Draft a professional email."

"Summarize these notes."

"Create a weekly plan."

"Help me prepare for a meeting."

System prompt:

You are an AI workplace productivity assistant.

Help users with professional communication, planning, summarization, research assistance and workplace organization.

Be concise, useful and professional.

Do not fabricate information.

Ask for clarification when necessary.

Do not provide unsupported claims as verified facts.

Do not make high-stakes professional decisions on behalf of the user.

Encourage human review of important outputs.

RESPONSIBLE AI PAGE

Create a dedicated Responsible AI page explaining:

AI-generated content

AI output may contain errors, omissions, or incorrect assumptions.

Human review

Users should review AI-generated content before sending emails, making decisions, publishing information, or relying on recommendations.

Privacy

Do not enter confidential, sensitive, proprietary, password, financial, or personal information unless permitted by organizational policy.

Accuracy

AI output should not automatically be treated as verified information.

Sources

The system must never fabricate citations or pretend that information has been externally verified when it has not.

Display this disclaimer throughout the application in a subtle but visible manner.

SETTINGS

Create a settings page with:

Theme preference

Notification preference

Default email tone

Default response length

AI assistance preferences

Include a simple profile section.

UI COMPONENTS

Create reusable components for:

Sidebar

Header

Dashboard cards

AI tool cards

Input forms

Output cards

Buttons

Badges

Toast notifications

Loading states

Empty states

Error states

Responsible AI disclaimer

Copy-to-clipboard controls

AI OUTPUT EXPERIENCE

Every AI tool should have:

Clear loading state

Clear success state

Error handling

Editable output where appropriate

Copy button

Regenerate button

Reset button

Never display a fake loading state indefinitely.

If an AI API is not configured, provide a clearly labeled demonstration/mock mode so the interface remains usable without pretending that the response came from a live AI service.

RESPONSIVENESS

The entire application must work correctly on:

Desktop

Laptop

Tablet

Mobile

Do not allow tables, text editors, cards, or forms to overflow horizontally.

ACCESSIBILITY

Use:

Semantic HTML

Accessible labels

Keyboard-friendly controls

Good contrast

Visible focus states

Proper button states

Meaningful error messages

ERROR HANDLING

Handle:

Empty inputs

Failed AI requests

API errors

Extremely long input

Invalid task information

Missing research content

Show helpful human-readable messages.

DATA

Use realistic demo data for the dashboard.

Do not use lorem ipsum.

Create realistic examples such as:

Client follow-up email

Weekly team meeting

Project deadline

Research topic

Workplace task list

FINAL QUALITY REQUIREMENT

The application should feel like a finished academic/project submission rather than a prototype.

Prioritize:

Functionality

Professional visual design

Clear information architecture

High-quality AI prompts

Structured AI outputs

Responsible AI

Responsive UX

Error handling

Presentation quality

Build the complete frontend and connect AI functionality where the available environment supports it.

Where an external AI API is required, structure the application so the API can be configured securely through environment variables. Never expose API keys in frontend code.

Do not claim that mock responses are generated by a real AI API.

The final product name should be:

AI Workplace Productivity Assistant

Tagline:

"Work smarter. Plan better. Communicate faster."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://work-assist-pro.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/009a0aec-adf8-4405-90fa-f0b9fa9be642).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
