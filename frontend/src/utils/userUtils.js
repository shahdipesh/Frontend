function getOrCreateUserId() {
    const storageKey = 'userId'
    const existing = localStorage.getItem(storageKey)
    if (existing && existing.trim().length > 0) return existing
  
    const newId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `uid_${Date.now()}_${Math.random().toString(16).slice(2)}`
  
    localStorage.setItem(storageKey, newId)
    return newId
  }

 export default getOrCreateUserId