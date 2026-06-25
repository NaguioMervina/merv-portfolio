<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        "title", "description", "thumbnail", "tech_stack",
        "live_url", "github_url", "is_featured", "sort_order",
    ];

    protected $casts = [
        "is_featured" => "boolean",
    ];

    public function scopeFeatured($query)
    {
        return $query->where("is_featured", true);
    }
}
