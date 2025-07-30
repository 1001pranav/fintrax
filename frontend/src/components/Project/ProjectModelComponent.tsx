"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import SVGComponent from "../svg";

const colorOptions = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
];

export default function ProjectModal() {
    const {
        isProjectModalOpen,
        setProjectModalOpen,
        addProject,
        updateProject,
        selectedProject,
        setSelectedProject,
    } = useAppStore();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: colorOptions[0],
    });

    const isEditing = !!selectedProject;

    useEffect(() => {
        if (isProjectModalOpen && selectedProject) {
            setFormData({
                name: selectedProject.name,
                description: selectedProject.description,
                color: selectedProject.color,
            });
        } else if (isProjectModalOpen) {
            setFormData({
                name: "",
                description: "",
                color: colorOptions[0],
            });
        }
    }, [isProjectModalOpen, selectedProject]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && selectedProject) {
            updateProject(selectedProject.id, formData);
        } else {
            addProject(formData);
        }

        handleClose();
    };

    const handleClose = () => {
        setProjectModalOpen(false);
        setSelectedProject(null);
        setFormData({ name: "", description: "", color: colorOptions[0] });
    };

    if (!isProjectModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {isEditing ? "Edit Project" : "Create New Project"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <SVGComponent
                            svgType={"x"}
                            className="w-5 h-5 text-white/60"
                        />
                        {/* <svg
                            className="w-5 h-5 text-white/60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg> */}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                            Project Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
                            placeholder="Enter project name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 resize-none"
                            placeholder="Project description"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                            Color
                        </label>
                        <div className="flex space-x-2">
                            {colorOptions.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-8 h-8 rounded-full transition-all duration-200 ${formData.color === color
                                            ? "ring-2 ring-white ring-offset-2 ring-offset-transparent"
                                            : "hover:scale-110"
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-3 px-4 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                        >
                            {isEditing ? "Update" : "Create"} Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
