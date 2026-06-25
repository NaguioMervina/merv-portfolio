<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ResumeExtractionService
{
    private string $apiKey;
    private string $model;

    public function __construct()
    {
        $this->apiKey = config('services.openai.api_key', '');
        $this->model = config('services.openai.model', 'gpt-4o-mini');
    }

    public function extract(string $resumeText): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => $this->model,
            'response_format' => ['type' => 'json_object'],
            'messages' => [
                [
                    'role' => 'system',
                    'content' => $this->buildSystemPrompt(),
                ],
                [
                    'role' => 'user',
                    'content' => "Extract structured portfolio data from this resume:\n\n" . $resumeText,
                ],
            ],
            'temperature' => 0.1,
        ]);

        if ($response->failed()) {
            throw new \RuntimeException('OpenAI API request failed: ' . $response->body());
        }

        $content = $response->json('choices.0.message.content');

        return json_decode($content, true) ?? [];
    }

    private function buildSystemPrompt(): string
    {
        return <<<'PROMPT'
You are a resume parser. Extract structured portfolio data from the resume text.

Return a JSON object with exactly this structure:
{
  "tagline": "short professional headline or title",
  "bio": "2-3 sentence professional summary written in first person",
  "phone": "phone number or empty string",
  "location": "city, country or empty string",
  "github_url": "full GitHub URL or empty string",
  "linkedin_url": "full LinkedIn URL or empty string",
  "skills": [
    { "name": "skill name", "category": "frontend|backend|database|tools|general", "proficiency": 80 }
  ],
  "experiences": [
    {
      "title": "job title",
      "company": "company name",
      "location": "location or empty string",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD or null if current",
      "description": "brief description of responsibilities",
      "type": "work|education"
    }
  ],
  "projects": [
    {
      "title": "project name",
      "description": "brief description",
      "tech_stack": "comma-separated technologies"
    }
  ]
}

Rules:
- If a field is not found, use empty string for strings, empty array for arrays.
- For skills, infer category from context (React/Vue/CSS = frontend, Node/Python/Laravel = backend, MySQL/PostgreSQL/MongoDB = database, Git/Docker/AWS = tools).
- For proficiency, estimate 60-95 based on context clues (years used, listed as primary skill, etc). Default 80.
- For experiences, try to parse dates to YYYY-MM-DD format. Use first day of month if only month/year given.
- Set type to "education" for schools/universities/degrees, "work" for jobs.
- Write bio in first person professional tone.
- Keep descriptions concise (1-2 sentences each).
PROMPT;
    }
}
