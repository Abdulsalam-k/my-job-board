export interface JobListing {
    id: string;
    title: string;
    company: string;
    tags: string[];
    url: string;
    source: 'api' | 'admin';
}

export async function fetchJobListings(): Promise<JobListing[]> {
    try {
        const response = await fetch("https://www.arbeitnow.com/api/job-board-api");
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();

        return data.data.map((job: any, index: number) => ({
            id: `api-${index}-${Date.now()}`,
            title: job.title,
            company: job.company_name,
            tags: job.tags || [],
            url: job.url,
            source: 'api'
        }));
    } catch (error) {
        console.error("Failed to fetch jobs:", error);
        throw new Error("Unable to load live job listings. Please check your network connection.");
    }
}