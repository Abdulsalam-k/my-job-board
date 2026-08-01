import { fetchJobListings, type JobListing } from './api.js';
import { getTalentsSkills, addTalentSkill, removetTalenSkill } from './storage.js';
import { calculateMatchScore } from './matching.js';
import { renderJoblist, renderPipelineBoard, type ApplicationItem } from './dom.js';
import { checkAuth, initAuthListeners } from './auth.js';
import { renderAdminDashboard } from './admin.js';

const STORAGE_KEY_APPS = 'talent_applications';

document.addEventListener('DOMContentLoaded', async () => {
    
    checkAuth();
    initAuthListeners();

    const currentRole = localStorage.getItem('userRole');

    if (currentRole === 'admin') {
        renderAdminDashboard();
        return; 
    }

    const skillInput = document.getElementById('skillInput') as HTMLInputElement;
    const addSkillBtn = document.getElementById('addSkillBtn');
    const skillsContainer = document.getElementById('skillsContainer');

    function renderSkills() {
        if (!skillsContainer) return;
        const skills = getTalentsSkills();

        skillsContainer.innerHTML = '';
        skills.forEach(skill => {
            const skillBadge = document.createElement('span');
            skillBadge.textContent = skill;
            skillBadge.style.display = 'inline-block';
            skillBadge.style.margin = '4px';
            skillBadge.style.padding = '6px 12px';
            skillBadge.style.background = '#e0e0e0';
            skillBadge.style.borderRadius = '4px';
            skillBadge.style.fontSize = '14px';
            skillBadge.style.cursor = 'pointer';
            skillBadge.title = 'Click to remove';
            
            skillBadge.addEventListener('click', () => {
                removetTalenSkill(skill);
                renderSkills();
                reloadJobsAndScoring();
            });

            skillsContainer.appendChild(skillBadge);
        });
    }

    if (addSkillBtn && skillInput) {
        addSkillBtn.addEventListener('click', () => {
            const newSkill = skillInput.value.trim();
            if (newSkill) {
                addTalentSkill(newSkill);
                skillInput.value = '';
                renderSkills();
                reloadJobsAndScoring();
            }
        });
    }

    renderSkills();

    const jobListContainer = document.getElementById('job-list-container');
    

    let applications: ApplicationItem[] = loadApplicationsFromStorage();

    
    function loadApplicationsFromStorage(): ApplicationItem[] {
        const saved = localStorage.getItem(STORAGE_KEY_APPS);
        return saved ? JSON.parse(saved) : [];
    }

    function saveApplicationsToStorage() {
        localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications));
    }

    async function reloadJobsAndScoring() {
        try {
            const currentSkills = getTalentsSkills();
            const rawJobs = await fetchJobListings();

            let scoredJobs = rawJobs.map(job => {
                const score = calculateMatchScore(currentSkills, job.tags);
                return { job, score };
            });
            scoredJobs.sort((a, b) => b.score - a.score);

            if (jobListContainer) {
                renderJoblist(jobListContainer, scoredJobs, (jobToApply) => {
                    const newApp: ApplicationItem = {
                        id: Date.now().toString(),
                        jobTitle: jobToApply.title,
                        company: jobToApply.company,
                        status: 'applied'
                    };

                    applications.push(newApp);
                    saveApplicationsToStorage(); 
                    renderPipelineBoard(applications, handleStatusChange);
                    alert(`Successfully tracked application for ${jobToApply.title} at ${jobToApply.company}!`);
                });
            }
        } catch (error) {
            console.error('Failed to load job listings:', error);
            if (jobListContainer) {
                jobListContainer.innerHTML = '<p style="color: red;">Failed to load job listings. Please try again later.</p>';
            }
        }
    }

    function handleStatusChange(appId: string, newStatus: string) {
        applications = applications.map(app => {
            if (app.id === appId) {
                return { ...app, status: newStatus as ApplicationItem['status'] };
            }
            return app;
        });

        saveApplicationsToStorage();
        renderPipelineBoard(applications, handleStatusChange);
    }

    renderPipelineBoard(applications, handleStatusChange);
    await reloadJobsAndScoring();
});