const handleDeleteResume = async (id) => {
  if (!window.confirm('Are you sure you want to delete this resume?')) return
  try {
    await deleteResume(id)
    setResumes(resumes.filter(r => r.id !== id))
  } catch {
    alert('Failed to delete resume.')
  }
}

const handleDeleteCoverLetter = async (id) => {
  if (!window.confirm('Are you sure you want to delete this cover letter?')) return
  try {
    await deleteCoverLetter(id)
    setCoverLetters(coverLetters.filter(c => c.id !== id))
  } catch {
    alert('Failed to delete cover letter.')
  }
}
const handleDownloadResume = (resume) => {
  const content = JSON.stringify(resume, null, 2)
  const blob = new Blob([content], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${resume.title}.json`
  a.click()
  URL.revokeObjectURL(url)
}