export function calculateMatchScore(userSkills: string[], jobTag: string[]){
    if(!jobTag || jobTag.length === 0 || !userSkills || userSkills.length === 0)

       return 0; 


const normalizedUsersSkill = userSkills.map(skill => skill.toLowerCase().trim());

let matchCount = 0;
for (const tag of jobTag){
    const  normalizedTag  =  tag.toLowerCase().trim();
    if (normalizedUsersSkill.includes(normalizedTag)){
        matchCount++
    }
}

const score = (matchCount / jobTag.length) * 100;

return Math.round(score)
}