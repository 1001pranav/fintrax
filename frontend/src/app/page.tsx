"use client"
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';
import ProjectModal from '@/components/Project/ProjectModelComponent';


export default function ProjectPage() {
    // const params = useParams();
    // const router = useRouter();
    // const { projects, setSelectedProject } = useAppStore();

    // const projectId = params.projectId as string;

    // useEffect(() => {
    //     const project = projects.find(p => p.id === projectId);
    //     if (project) {
    //         setSelectedProject(project);
    //     } else {
    //         router.push('/');
    //     }
    // }, [projectId, projects, setSelectedProject, router]);

    return (
        <div className="flex h-screen bg-slate-900">
            <Sidebar />
            <MainContent />
            <ProjectModal />
            
        </div>
    );
}