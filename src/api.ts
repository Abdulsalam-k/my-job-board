export interface JobListing {
    id: string;
    title: string;
    company: string;
    tags: string[];
    url: string;
    source: 'api' | 'admin';
}

export async function fetchJobListings(): Promise<JobListing[]> {
    let apiJobs: JobListing[] = [];
    try {
        const response = await fetch("https://www.arbeitnow.com/api/job-board-api");
        
        if (response.ok) {
            const data = await response.json();
            apiJobs = data.data.map((job: any, index: number) => ({
                id: `api-${index}-${Date.now()}`,
                title: job.title,
                company: job.company_name,
                tags: job.tags || [],
                url: job.url,
                source: 'api' as const
            }));
        }
    } catch (error) {
        console.warn("External API blocked or offline. Running on local admin jobs.", error);
    }


    const storedAdminJobs = localStorage.getItem('adminJobs');
    const adminJobs: JobListing[] = storedAdminJobs ? JSON.parse(storedAdminJobs) : [];

    
    const combinedJobs = [...adminJobs, ...apiJobs];

    if (combinedJobs.length === 0) {
        return [
            {
                id: 'fallback-1',
                title: 'Sample Frontend Developer',
                company: 'Internal Mock Company',
                tags: ['javascript', 'typescript', 'html'],
                url: '#',
                source: 'admin'
            }
        ];
    }

    return combinedJobs;
}