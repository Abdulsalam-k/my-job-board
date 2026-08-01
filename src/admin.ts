export interface JobListing {
    id: string;
    title: string;
    company: string;
    skills: string[];
    salary: string;
    source: 'admin' | 'api';
}


export function renderAdminDashboard(): void {
    const adminSection = document.getElementById('admin-section') as HTMLElement | null;
    if (!adminSection) return;

    adminSection.innerHTML = `
        <section class="section-box">
            <h2>Admin Portal - Manage Job Listings</h2>
            
            <!-- Job Creation Form -->
            <form id="add-job-form" class="admin-form" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                <input type="text" id="jobTitle" placeholder="Job Title (e.g. Frontend Engineer)" required style="padding: 8px;">
                <input type="text" id="jobCompany" placeholder="Company Name (e.g. TechCorp)" required style="padding: 8px;">
                <input type="text" id="jobSkills" placeholder="Required Skills (comma separated: React, TypeScript, SQL)" required style="padding: 8px;">
                <input type="text" id="jobSalary" placeholder="Estimated Salary (e.g. $120,000)" required style="padding: 8px;">
                <button type="submit" class="btn-talent" style="padding: 10px; cursor: pointer;">Post Job Listing</button>
            </form>

            <hr class="divider" style="margin: 20px 0;">

            <h3>Platform-Wide Job Listings</h3>
            <div id="admin-job-list"></div>
        </section>
    `;

    initAdminFormListener();
    renderAdminJobList();
}


function initAdminFormListener(): void {
    const form = document.getElementById('add-job-form') as HTMLFormElement | null;
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleInput = document.getElementById('jobTitle') as HTMLInputElement;
        const companyInput = document.getElementById('jobCompany') as HTMLInputElement;
        const skillsInput = document.getElementById('jobSkills') as HTMLInputElement;
        const salaryInput = document.getElementById('jobSalary') as HTMLInputElement;

        const newJob: JobListing = {
            id: 'admin-' + Date.now(),
            title: titleInput.value.trim(),
            company: companyInput.value.trim(),
            skills: skillsInput.value.split(',').map(s => s.trim()).filter(Boolean),
            salary: salaryInput.value.trim(),
            source: 'admin'
        };

        
        const existingJobsJson = localStorage.getItem('adminJobs');
        const adminJobs: JobListing[] = existingJobsJson ? JSON.parse(existingJobsJson) : [];

    
        adminJobs.push(newJob);
        localStorage.setItem('adminJobs', JSON.stringify(adminJobs));

        
        form.reset();
        renderAdminJobList();
        alert('Job listing successfully posted platform-wide!');
    });
}


export function renderAdminJobList(): void {
    const container = document.getElementById('admin-job-list');
    if (!container) return;

    const existingJobsJson = localStorage.getItem('adminJobs');
    const adminJobs: JobListing[] = existingJobsJson ? JSON.parse(existingJobsJson) : [];

    if (adminJobs.length === 0) {
        container.innerHTML = `<p style="color: #64748b;">No manual job listings created yet.</p>`;
        return;
    }

    container.innerHTML = adminJobs.map(job => `
        <div class="job-card" style="border: 1px solid #cbd5e1; padding: 12px; margin-bottom: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${job.title}</strong> at <em>${job.company}</em>
                <div style="font-size: 13px; color: #475569;">Salary: ${job.salary}</div>
                <div style="font-size: 12px; color: #2563eb;">Skills: ${job.skills.join(', ')}</div>
            </div>
            <button onclick="window.deleteAdminJob('${job.id}')" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">Delete</button>
        </div>
    `).join('');
}


(window as any).deleteAdminJob = function(id: string) {
    const existingJobsJson = localStorage.getItem('adminJobs');
    if (!existingJobsJson) return;

    let adminJobs: JobListing[] = JSON.parse(existingJobsJson);
    adminJobs = adminJobs.filter(job => job.id !== id);

    localStorage.setItem('adminJobs', JSON.stringify(adminJobs));
    renderAdminJobList();
};