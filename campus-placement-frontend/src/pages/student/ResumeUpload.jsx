import { useState, useRef } from 'react'
import { FileUp, CheckCircle2, Loader2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import GlassCard from '../../components/GlassCard'
import { uploadResume } from '../../api/students'

export default function ResumeUpload() {
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }
    setError('')
    setFileName(file.name)
    setLoading(true)
    setResult(null)
    try {
      const data = await uploadResume(file)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not process resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Student"
        title="Resume"
        subtitle="Upload a PDF resume and we'll pull out the skills we recognize."
      />

      <GlassCard strong className="max-w-xl">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFile(e.dataTransfer.files?.[0])
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl2 py-12 cursor-pointer transition-colors ${
            dragOver ? 'border-signal-violet bg-signal-violet/5' : 'border-white/15 hover:border-white/25'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="w-12 h-12 rounded-full bg-signal-violet/15 flex items-center justify-center">
            <FileUp size={20} className="text-signal-violetSoft" />
          </div>
          <p className="text-mist-100 text-sm font-medium">
            {fileName || 'Drop your resume here, or click to browse'}
          </p>
          <p className="text-mist-700 text-xs">PDF only</p>
        </div>

        {error && <p className="text-sm text-signal-coral mt-4">{error}</p>}

        {loading && (
          <div className="flex items-center gap-2 mt-6 text-mist-500 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Extracting text and matching skills…
          </div>
        )}

        {result && (
          <div className="mt-6 fade-up">
            <p className="label-eyebrow mb-3">Skills detected</p>
            {result.skills.length === 0 ? (
              <p className="text-sm text-mist-500">No known skills detected in this resume.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {result.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-signal-teal/10 border border-signal-teal/25 text-signal-teal text-xs font-medium"
                  >
                    <CheckCircle2 size={13} />
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
