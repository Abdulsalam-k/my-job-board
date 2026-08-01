import type { JobListing } from "./api.js";
export function createJobCardElements(job: JobListing, matchScore: number, onApply: (job: JobListing) => void): HTMLElement{
    const card = document.createElement('div')
    card.className = 'job-card bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between';

    let badgeColor = "bg-gray-100 text-gray-800"
    if(matchScore>=70) badgeColor = "bg-green-100 text-green-800";
    else if(matchScore>=40) badgeColor = "bg-yellow-100 text-yellow-800";

    const title = job?.title || 'Untitled Job';
    const company = job?.company || 'Unknown Company';
    const url = job?.url || '#';
    const tags = Array.isArray(job?.tags) ? job.tags : [];

    card.innerHTML = `
    <div>
        <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-lg text-gray-900">${title}</h3>
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${badgeColor}">
                ${matchScore}% Match
            </span>
        </div>
        <p class="text-gray-600 font-medium mb-3">${company}</p>
        <div class="flex flex-wrap gap-1 mb-4">
            ${tags.map(tag => `<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">${tag}</span>`).join('')}
        </div>
    </div>
    <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <a href="${url}" target="_blank" class="text-blue-600 text-sm hover:underline">View Original</a>
        <button class="apply-btn bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition">
            Track Application
        </button>
    </div>
    `;

    const applyButton = card.querySelector(".apply-btn")
    if(applyButton){
        applyButton.addEventListener("click", () => onApply(job));
    }

    return card;
}
export function renderJoblist(
    container: HTMLElement,
    jobs: {job: JobListing, score: number}[],
    onApply: (job: JobListing) => void
) {
    container.innerHTML = '';
    if(jobs.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center py-8">No job listings found.</p>`;
        return;
    }
    jobs.forEach(({job, score}) => {
        const card = createJobCardElements(job, score, onApply);
        container.appendChild(card);
    });
}
export interface ApplicationItem{
    id: string;
    jobTitle: string;
    company: string;
    status: "wishlist" | "applied" | "interviewing" | "offered" | "rejected"
}
export function renderPipelineBoard(
    application: ApplicationItem[],
    onStatusChange:( appId: string, newStatus: string) => void
) {
    const columns = [
        {id: "wishlist", title: "Wishlist"},
        {id: "applied", title: "Applied"},
        {id: "interviewing", title: "Interviewing"},
        {id: "offered", title: "Offered"},
        {id: "rejected", title: "Rejected"}
    ];

    columns.forEach(col=> {
        const colContainer = document.getElementById(`column-${col.id}`); 
        if(!colContainer) return;

        colContainer.innerHTML = '';

        const colApps = application.filter(app => app.status === col.id);
        if(colApps.length === 0){
            colContainer.innerHTML = `<p class="text-xs text-gray-400 italic p-2">No applications</p>`
            return;
        }
        colApps.forEach(app => {
            const appCard = document.createElement("div");
            appCard.className = "bg-white p-3 rounded shadow-sm border border-gray-200 mb-2"
            appCard.innerHTML = `<h4 class="font-bold text-sm text-gray-800">${app.jobTitle}</h4>
                <p class="text-xs text-gray-600 mb-2">${app.company}</p>
                <select class="status-select text-xs border rounded p-1 w-full bg-gray-50">
                    <option value="wishlist" ${app.status === 'wishlist' ? 'selected' : ''}>Wishlist</option>
                    <option value="applied" ${app.status === 'applied' ? 'selected' : ''}>Applied</option>
                    <option value="interviewing" ${app.status === 'interviewing' ? 'selected' : ''}>Interviewing</option>
                    <option value="offered" ${app.status === 'offered' ? 'selected' : ''}>Offered</option>
                    <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                </select>`;

                const selectEl = appCard.querySelector(".status-select") as HTMLSelectElement;
                if(selectEl) {
                    selectEl.addEventListener("change", (e) => {
                        const target = e.target as HTMLSelectElement;
                        onStatusChange(app.id, target.value)
                    })
                }
                colContainer.appendChild(appCard)

        })
    });

}