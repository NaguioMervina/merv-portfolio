import { useState, useRef } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { Upload, FileText, Check, X, Trash2 } from "lucide-react";

interface ExtractedSkill {
    name: string;
    category: string;
    proficiency: number;
}

interface ExtractedExperience {
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string | null;
    description: string;
    type: "work" | "education";
}

interface ExtractedProject {
    title: string;
    description: string;
    tech_stack: string;
}

interface ExtractedData {
    tagline: string;
    bio: string;
    phone: string;
    location: string;
    github_url: string;
    linkedin_url: string;
    skills: ExtractedSkill[];
    experiences: ExtractedExperience[];
    projects: ExtractedProject[];
}

interface PageProps {
    extracted?: ExtractedData | null;
    flash?: { success?: string };
}

export default function ResumeUpload({ extracted }: PageProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<ExtractedData | null>(extracted ?? null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected && selected.type === "application/pdf") {
            setFile(selected);
        }
    };

    const handleUpload = () => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("resume", file);

        router.post("/admin/resume/extract", formData, {
            onFinish: () => setUploading(false),
            onSuccess: (page) => {
                const props = page.props as unknown as PageProps;
                if (props.extracted) {
                    setData(props.extracted);
                }
            },
        });
    };

    const handleSave = () => {
        if (!data) return;
        setSaving(true);
        router.post("/admin/resume/confirm", data as any, {
            onFinish: () => setSaving(false),
        });
    };

    const removeItem = <T,>(arr: T[], index: number): T[] =>
        arr.filter((_, i) => i !== index);

    return (
        <AppLayout breadcrumbs={[{ title: "Resume Import", href: "/admin/resume/upload" }]}>
            <Head title="Resume Import" />
            <div className="p-6 max-w-4xl">
                <h1 className="text-2xl font-bold mb-2">Resume Import</h1>
                <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                    Upload your PDF resume to auto-populate your portfolio profile, skills, experience, and projects.
                </p>

                {!data && (
                    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <div
                            className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const dropped = e.dataTransfer.files[0];
                                if (dropped?.type === "application/pdf") setFile(dropped);
                            }}
                        >
                            <Upload className="mx-auto h-10 w-10 text-neutral-400 mb-3" />
                            {file ? (
                                <div className="flex items-center justify-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium">{file.name}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm font-medium">Drop your resume here or click to browse</p>
                                    <p className="text-xs text-neutral-500 mt-1">PDF only, max 5MB</p>
                                </>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            {uploading ? "Extracting..." : "Extract Data"}
                        </button>
                    </div>
                )}

                {data && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <Check className="h-5 w-5" />
                                <span className="text-sm font-medium">Data extracted. Review and edit below before saving.</span>
                            </div>
                            <button
                                onClick={() => {
                                    setData(null);
                                    setFile(null);
                                }}
                                className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                            >
                                Start over
                            </button>
                        </div>

                        <section className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <h2 className="text-lg font-semibold mb-4">Profile</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(["tagline", "bio", "phone", "location", "github_url", "linkedin_url"] as const).map((field) => (
                                    <div key={field} className={field === "bio" ? "md:col-span-2" : ""}>
                                        <label className="block text-sm font-medium mb-1 capitalize">
                                            {field.replace("_", " ")}
                                        </label>
                                        {field === "bio" ? (
                                            <textarea
                                                value={data[field]}
                                                onChange={(e) => setData({ ...data, [field]: e.target.value })}
                                                rows={4}
                                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={data[field]}
                                                onChange={(e) => setData({ ...data, [field]: e.target.value })}
                                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <h2 className="text-lg font-semibold mb-4">Skills ({data.skills.length})</h2>
                            {data.skills.length === 0 ? (
                                <p className="text-sm text-neutral-500">No skills extracted.</p>
                            ) : (
                                <div className="space-y-2">
                                    {data.skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <input
                                                value={skill.name}
                                                onChange={(e) => {
                                                    const updated = [...data.skills];
                                                    updated[i] = { ...updated[i], name: e.target.value };
                                                    setData({ ...data, skills: updated });
                                                }}
                                                className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                                            />
                                            <select
                                                value={skill.category}
                                                onChange={(e) => {
                                                    const updated = [...data.skills];
                                                    updated[i] = { ...updated[i], category: e.target.value };
                                                    setData({ ...data, skills: updated });
                                                }}
                                                className="px-2 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                                            >
                                                <option value="frontend">Frontend</option>
                                                <option value="backend">Backend</option>
                                                <option value="database">Database</option>
                                                <option value="tools">Tools</option>
                                                <option value="general">General</option>
                                            </select>
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={skill.proficiency}
                                                onChange={(e) => {
                                                    const updated = [...data.skills];
                                                    updated[i] = { ...updated[i], proficiency: parseInt(e.target.value) || 0 };
                                                    setData({ ...data, skills: updated });
                                                }}
                                                className="w-16 px-2 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm text-center"
                                            />
                                            <button
                                                onClick={() => setData({ ...data, skills: removeItem(data.skills, i) })}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <h2 className="text-lg font-semibold mb-4">Experience ({data.experiences.length})</h2>
                            {data.experiences.length === 0 ? (
                                <p className="text-sm text-neutral-500">No experience extracted.</p>
                            ) : (
                                <div className="space-y-4">
                                    {data.experiences.map((exp, i) => (
                                        <div key={i} className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg relative">
                                            <button
                                                onClick={() => setData({ ...data, experiences: removeItem(data.experiences, i) })}
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <input
                                                    value={exp.title}
                                                    onChange={(e) => {
                                                        const updated = [...data.experiences];
                                                        updated[i] = { ...updated[i], title: e.target.value };
                                                        setData({ ...data, experiences: updated });
                                                    }}
                                                    placeholder="Title"
                                                    className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                                                />
                                                <input
                                                    value={exp.company}
                                                    onChange={(e) => {
                                                        const updated = [...data.experiences];
                                                        updated[i] = { ...updated[i], company: e.target.value };
                                                        setData({ ...data, experiences: updated });
                                                    }}
                                                    placeholder="Company"
                                                    className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                                                />
                                                <input
                                                    value={exp.location}
                                                    onChange={(e) => {
                                                        const updated = [...data.experiences];
                                                        updated[i] = { ...updated[i], location: e.target.value };
                                                        setData({ ...data, experiences: updated });
                                                    }}
                                                    placeholder="Location"
                                                    className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                                                />
                                                <select
                                                    value={exp.type}
                                                    onChange={(e) => {
                                                        const updated = [...data.experiences];
                                                        updated[i] = { ...updated[i], type: e.target.value as "work" | "education" };
                                                        setData({ ...data, experiences: updated });
                                                    }}
                                                    className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                                                >
                                                    <option value="work">Work</option>
                                                    <option value="education">Education</option>
                                                </select>
                                                <input
                                                    type="date"
                                                    value={exp.start_date}
                                                    onChange={(e) => {
                                                        const updated = [...data.experiences];
                                                        updated[i] = { ...updated[i], start_date: e.target.value };
                                                        setData({ ...data, experiences: updated });
                                                    }}
                                                    className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                                                />
                                                <input
                                                    type="date"
                                                    value={exp.end_date ?? ""}
                                                    onChange={(e) => {
                                                        const updated = [...data.experiences];
                                                        updated[i] = { ...updated[i], end_date: e.target.value || null };
                                                        setData({ ...data, experiences: updated });
                                                    }}
                                                    className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                                                />
                                                <textarea
                                                    value={exp.description}
                                                    onChange={(e) => {
                                                        const updated = [...data.experiences];
                                                        updated[i] = { ...updated[i], description: e.target.value };
                                                        setData({ ...data, experiences: updated });
                                                    }}
                                                    placeholder="Description"
                                                    rows={2}
                                                    className="md:col-span-2 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <h2 className="text-lg font-semibold mb-4">Projects ({data.projects.length})</h2>
                            {data.projects.length === 0 ? (
                                <p className="text-sm text-neutral-500">No projects extracted.</p>
                            ) : (
                                <div className="space-y-4">
                                    {data.projects.map((proj, i) => (
                                        <div key={i} className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg relative">
                                            <button
                                                onClick={() => setData({ ...data, projects: removeItem(data.projects, i) })}
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <input
                                                    value={proj.title}
                                                    onChange={(e) => {
                                                        const updated = [...data.projects];
                                                        updated[i] = { ...updated[i], title: e.target.value };
                                                        setData({ ...data, projects: updated });
                                                    }}
                                                    placeholder="Title"
                                                    className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                                                />
                                                <input
                                                    value={proj.tech_stack}
                                                    onChange={(e) => {
                                                        const updated = [...data.projects];
                                                        updated[i] = { ...updated[i], tech_stack: e.target.value };
                                                        setData({ ...data, projects: updated });
                                                    }}
                                                    placeholder="Tech stack (comma-separated)"
                                                    className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                                                />
                                                <textarea
                                                    value={proj.description}
                                                    onChange={(e) => {
                                                        const updated = [...data.projects];
                                                        updated[i] = { ...updated[i], description: e.target.value };
                                                        setData({ ...data, projects: updated });
                                                    }}
                                                    placeholder="Description"
                                                    rows={2}
                                                    className="md:col-span-2 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save All to Portfolio"}
                            </button>
                            <button
                                onClick={() => {
                                    setData(null);
                                    setFile(null);
                                }}
                                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
