"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import SVGComponent from "../svg";
import { PROJECT_COLOR_OPTIONS } from "@/constants/generalConstants";

// Project status mapping: display name -> backend value
const PROJECT_STATUS = {
    "Active": 1,
    "Archived": 2,
    "Deleted": 3
} as const;

// Reverse mapping: backend value -> display name
const STATUS_DISPLAY = {
    1: "Active",
    2: "Archived",
    3: "Deleted"
} as const;

export default function ProjectModal() {
    // Use selectors to ensure proper subscription
    const isProjectModalOpen = useAppStore((state) => state.isProjectModalOpen);
    const setProjectModalOpen = useAppStore((state) => state.setProjectModalOpen);
    const addProject = useAppStore((state) => state.addProject);
    const updateProject = useAppStore((state) => state.updateProject);
    const selectedProject = useAppStore((state) => state.selectedProject);
    const setSelectedProject = useAppStore((state) => state.setSelectedProject);

    console.log('🟢 ProjectModal component rendered');
    console.log('🟢 isProjectModalOpen value:', isProjectModalOpen);
    console.log('🟢 Will render modal?', isProjectModalOpen ? 'YES' : 'NO (returning null)');

    useEffect(() => {
        console.log('🟢 ProjectModal mounted/updated, isOpen:', isProjectModalOpen);
        if (isProjectModalOpen) {
            console.log('🟢 ✅ Modal IS OPEN - should be visible on screen!');
        } else {
            console.log('🟢 ❌ Modal is CLOSED');
        }
    }, [isProjectModalOpen]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: PROJECT_COLOR_OPTIONS[0],
        status: "Active" as keyof typeof PROJECT_STATUS,
    });

    const isEditing = !!selectedProject;

    useEffect(() => {
        if (isProjectModalOpen && selectedProject) {
            // Convert numeric status from backend to display name
            const statusDisplay = STATUS_DISPLAY[selectedProject.status as keyof typeof STATUS_DISPLAY] || "Active";
            setFormData({
                name: selectedProject.name,
                description: selectedProject.description,
                color: selectedProject.color,
                status: statusDisplay as keyof typeof PROJECT_STATUS,
            });
        } else if (isProjectModalOpen) {
            setFormData({
                name: "",
                description: "",
                color: PROJECT_COLOR_OPTIONS[0],
                status: "Active",
            });
        }
    }, [isProjectModalOpen, selectedProject]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Convert status display name to numeric value for backend
        const projectData = {
            ...formData,
            status: PROJECT_STATUS[formData.status]
        };

        if (isEditing && selectedProject) {
            updateProject(selectedProject.id, projectData);
        } else {
            addProject(projectData);
        }

        handleClose();
    };

    const handleClose = () => {
        setProjectModalOpen(false);
        setSelectedProject(null);
        setFormData({
            name: "",
            description: "",
            color: PROJECT_COLOR_OPTIONS[0],
            status: "Active"
        });
    };

    if (!isProjectModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-2xl p-6 w-full max-w-md my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? "Edit Project" : "Create New Project"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <SVGComponent
                            svgType={"x"}
                            className="w-5 h-5 text-gray-600 dark:text-white/60"
                        />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
                            Project Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 shadow-sm"
                            placeholder="Enter project name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 resize-none shadow-sm"
                            placeholder="Project description"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
                            Color
                        </label>
                        <div className="flex space-x-2">
                            {PROJECT_COLOR_OPTIONS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-8 h-8 rounded-full transition-all duration-200 ${formData.color === color
                                            ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-transparent"
                                            : "hover:scale-110"
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
                            Project Template
                        </label>
                        <div className="flex items-center space-x-3">
                            <SVGComponent
                                svgType={"task_logo"}
                                className="w-8 h-8 text-gray-900 dark:text-white"
                            />
                            <span className="text-gray-600 dark:text-white/70">Task Icon</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({ ...formData, status: e.target.value as keyof typeof PROJECT_STATUS })
                            }
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 shadow-sm"
                        >
                            {Object.keys(PROJECT_STATUS).map((statusName) => (
                                <option key={statusName} value={statusName} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                    {statusName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-3 px-4 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? "Update" : "Create"} Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
