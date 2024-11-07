'use client'

import { useState, useTransition } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, Download } from "lucide-react"
import { renameAndGetFile } from './actions/renameAndGetFile'

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{
    message: string,
    originalName: string,
    newName: string,
    fileContent?: Uint8Array,
    contentType?: string
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    startTransition(() => {
      (async () => {
        try {
          const renameResult = await renameAndGetFile(formData)
          setResult(renameResult)
        } catch (error: unknown) {
          console.log(error)
          setResult({ message: 'Error renaming file', originalName: '', newName: '' })
        }
      })();
    });
  }

  const handleDownload = () => {
    if (result && result.fileContent && result.contentType) {
      const blob = new Blob([result.fileContent], { type: result.contentType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.newName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>File Renamer</CardTitle>
          <CardDescription>Upload a file and we'll rename it by adding "КоляВоноПрацює"</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <Input
                type="file"
                onChange={handleFileChange}
                className="cursor-pointer"
                id="file-upload"
                aria-label="Select a file to rename"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" disabled={!file || isPending}>
              {isPending ? 'Renaming...' : 'Rename File'}
              <Upload className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
      {result && (
        <Alert className="mt-4 w-[350px]">
          <AlertTitle>File Renamed</AlertTitle>
          <AlertDescription>
            <p><strong>Original name:</strong> {result.originalName}</p>
            <p><strong>New name:</strong> {result.newName}</p>
            <p className="mt-2">{result.message}</p>
            {result.fileContent && (
              <Button onClick={handleDownload} className="mt-2">
                Download Renamed File
                <Download className="ml-2 h-4 w-4" />
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </main>
  )
}