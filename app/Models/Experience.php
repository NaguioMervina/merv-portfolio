<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        "title", "company", "location", "start_date",
        "end_date", "description", "type", "sort_order",
    ];

    protected $casts = [
        "start_date" => "date",
        "end_date" => "date",
    ];

    public function scopeWork($query)
    {
        return $query->where("type", "work");
    }

    public function scopeEducation($query)
    {
        return $query->where("type", "education");
    }
}
