export function getStageBadgeClass(stage) {
    const map = {
        idea: 'badge-idea',
        building: 'badge-building',
        testing: 'badge-testing',
        shipped: 'badge-shipped',
        completed: 'badge-completed',
    }
    return map[stage] || 'badge-idea'
}

export const STAGES = [
    { value: 'idea', label: 'Idea' },
    { value: 'building', label: 'Building' },
    { value: 'testing', label: 'Testing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'completed', label: 'Completed' },
]

export const SUPPORT_OPTIONS = [
    'co-founder', 'developer', 'designer',
    'feedback', 'tester', 'mentor',
]