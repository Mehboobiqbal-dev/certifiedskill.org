import { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // If token doesn't exist, redirect to login page
    if (!localStorage.getItem('token')) {
      router.push('/login')
    }
  }, [router])

  const startExam = async () => {
    try {
      // Replace 'example-exam-id' with the actual exam ID you want to use
      const res = await axios.post(
        '/api/exam/start',
        { examId: 'example-exam-id' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      router.push(`/exam/${res.data.sessionId}`)
    } catch (err) {
      console.error(err)
      // You could add error feedback here if needed
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Dashboard</h1>
      <button onClick={startExam} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
        Start Exam
      </button>
    </div>
  )
}
