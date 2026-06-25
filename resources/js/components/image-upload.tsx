import { useState, useRef, ClipboardEvent, DragEvent } from "react";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = "Thumbnail" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("File too large (max 5MB)");
            return;
        }

        setUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/admin/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                onChange(data.url);
                setPreview(data.url);
            } else {
                setError("Upload failed (" + res.status + ")");
            }
        } catch (err) {
            setError("Upload failed");
        }
        setUploading(false);
    };

    const handlePaste = (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (const item of items) {
            if (item.type.startsWith("image/")) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) uploadFile(file);
                break;
            }
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div
                className={"relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors " + (uploading ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-neutral-300 dark:border-neutral-600 hover:border-blue-400")}
                onPaste={handlePaste}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => inputRef.current?.click()}
            >
                {preview ? (
                    <div className="relative">
                        <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onChange(""); setPreview(""); }}
                            className="absolute top-2 right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-rose-600"
                        >×</button>
                    </div>
                ) : (
                    <div className="py-4">
                        <div className="text-3xl mb-2">📋</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {uploading ? "Uploading..." : "Paste screenshot (Ctrl+V), drag & drop, or click"}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">PNG, JPG, GIF, WebP (max 5MB)</div>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>
            {error && <p className="text-rose-500 text-sm mt-1">{error}</p>}
            <div className="mt-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => { onChange(e.target.value); setPreview(e.target.value); }}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                    placeholder="Or paste an image URL here..."
                />
            </div>
        </div>
    );
}
