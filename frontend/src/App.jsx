import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from"prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState(`function sum(){
    return 1+1
  }`)
  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false) // Processing state

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    setLoading(true) // Show processing indicator
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code })
      setReview(response.data)
    } catch (error) {
      setReview('Error fetching review')
    } finally {
      setLoading(false) // Hide processing indicator
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className='code'>
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div onClick={reviewCode} className='review'>Review</div>
          {loading && <div className="loading">Processing...</div>} {/* Processing Indicator */}
        </div>
        <div className='right'>
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>
    </>
  )
}

export default App
