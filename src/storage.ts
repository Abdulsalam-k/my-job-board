export interface User {
    username: string,
    role: "talent" | "admin",
}

export function savedTalentsSkills(skills: string[]): void {
    const skillsString = JSON.stringify(skills);
    localStorage.setItem("talent_skills", skillsString);

}
export function getTalentsSkills(): string[] {
    const savedSkills = localStorage.getItem("talent_skills");

    if (savedSkills) {
        return JSON.parse(savedSkills);
    }
    return [];
}

export function addTalentSkill(newSkill: string): void {
    const skills = getTalentsSkills();
    skills.push(newSkill);
    savedTalentsSkills(skills);
}
export function removetTalenSkill(skillToRemove: string): void{
    const skills = getTalentsSkills();
    const updatedSkillls = skills.filter(skill=> skill !== skillToRemove);
    savedTalentsSkills(updatedSkillls);
}
