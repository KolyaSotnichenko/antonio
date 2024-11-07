'use server'
 
export async function renameAndGetFile(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file uploaded')
  }
 
  // Get the original file name and extension
  const originalName = file.name
  const lastDotIndex = originalName.lastIndexOf('.')
//   const nameWithoutExtension = originalName.slice(0, lastDotIndex)
  const extension = originalName.slice(lastDotIndex)
 
  // Create the new file name
  const newFileName = `КоляВоноПрацює${extension}`
 
  // Read the file content
  const arrayBuffer = await file.arrayBuffer()
  const fileContent = new Uint8Array(arrayBuffer)
 
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000))
 
  return { 
    message: `File renamed successfully`,
    originalName: originalName,
    newName: newFileName,
    fileContent: fileContent,
    contentType: file.type
  }
}