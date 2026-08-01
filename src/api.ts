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
        console.warn("Could not reach live API, falling back to local/admin jobs only:", error);
    }


    const storedAdminJobs = localStorage.getItem('adminJobs');
    const adminJobs: JobListing[] = storedAdminJobs ? JSON.parse(storedAdminJobs) : [];

    
    const combinedJobs = [...adminJobs, ...apiJobs];

    
    if (combinedJobs.length === 0) {
        throw new Error("Unable to load job listings. Please check your network connection.");
    }

    return combinedJobs;
}