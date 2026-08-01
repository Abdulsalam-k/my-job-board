// auth.ts - Handles user roles, authentication, and view toggling

export function checkAuth(): void {
    const roleDisplay = document.getElementById('current-role-display') as HTMLElement | null;
    const loginTalentBtn = document.getElementById('loginTalentBtn') as HTMLButtonElement | null;
    const loginAdminBtn = document.getElementById('loginAdminBtn') as HTMLButtonElement | null;
    const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement | null;


    const talentSection = document.getElementById('talent-section') as HTMLElement | null;
    const adminSection = document.getElementById('admin-section') as HTMLElement | null;

    const currentRole: string | null = localStorage.getItem('userRole');
    const currentUserName: string | null = localStorage.getItem('userName');

    if (!roleDisplay || !loginTalentBtn || !loginAdminBtn || !logoutBtn) return;

    if (currentRole === 'talent') {
    
        roleDisplay.textContent = `Talent (${currentUserName || 'Abdul-Salam'})`;
        loginTalentBtn.style.display = 'none';
        loginAdminBtn.style.display = 'none';
        logoutBtn.style.display = 'block';

        
        if (talentSection) talentSection.style.display = 'block';
        if (adminSection) adminSection.style.display = 'none';

    } else if (currentRole === 'admin') {
        
        roleDisplay.textContent = 'Administrator';
        loginTalentBtn.style.display = 'none';
        loginAdminBtn.style.display = 'none';
        logoutBtn.style.display = 'block';

        
        if (talentSection) talentSection.style.display = 'none';
        if (adminSection) adminSection.style.display = 'block';

    } else {
    
        roleDisplay.textContent = 'Not Logged In (Please choose a role)';
        loginTalentBtn.style.display = 'block';
        loginAdminBtn.style.display = 'block';
        logoutBtn.style.display = 'none';


        if (talentSection) talentSection.style.display = 'none';
        if (adminSection) adminSection.style.display = 'none';
    }
}

export function initAuthListeners(): void {
    const loginTalentBtn = document.getElementById('loginTalentBtn') as HTMLButtonElement | null;
    const loginAdminBtn = document.getElementById('loginAdminBtn') as HTMLButtonElement | null;
    const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement | null;

    loginTalentBtn?.addEventListener('click', () => {
        localStorage.setItem('userRole', 'talent');
        localStorage.setItem('userName', 'Abdul-Salam');
        checkAuth();
        location.reload();
    });

    loginAdminBtn?.addEventListener('click', () => {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', 'System Admin');
        checkAuth();
        location.reload();
    });

    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        checkAuth();
        location.reload();
    });
}