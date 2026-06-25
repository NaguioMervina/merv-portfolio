<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    protected $fillable = [
        "user_id", "tagline", "bio", "photo", "resume_path",
        "location", "phone", "github_url", "linkedin_url", "twitter_url",
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
