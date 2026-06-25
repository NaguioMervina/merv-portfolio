<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            "file" => "required|file|image|max:5120",
        ]);

        $file = $request->file("file");
        $filename = Str::uuid() . "." . $file->getClientOriginalExtension();
        $file->move(public_path("thumbnails"), $filename);

        return response()->json([
            "url" => "/thumbnails/" . $filename,
        ]);
    }
}
