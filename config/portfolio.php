<?php

return [
    'gitlab' => [
        'base_url' => env('GITLAB_BASE_URL', 'https://gitlab.com'),
        'username' => env('GITLAB_USERNAME'),
        'token' => env('GITLAB_TOKEN'),
        'member_since' => env('GITLAB_MEMBER_SINCE', 'May 07, 2024'),
        'cache_minutes' => env('GITLAB_CONTRIBUTION_CACHE_MINUTES', 360),
        'timeout' => env('GITLAB_CONTRIBUTION_TIMEOUT', 8),
    ],
];
