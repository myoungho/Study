import { useState } from 'react'
import './App.css'

function App() {
  // TypeScript 타입 지정: C#의 string name = "" 와 유사
  const [name, setName] = useState<string>('')
  const [greeting, setGreeting] = useState<string>('')

  // 이벤트 핸들러: C#의 void HandleGreet() 와 유사
  const handleGreet = () => {
    setGreeting(`안녕하세요, ${name}님!`)
  }

  return (
    <div className="App">
      <h1>나의 첫 React 앱</h1>

      <div style={{ margin: '20px' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
          style={{
            padding: '10px',
            fontSize: '16px',
            marginRight: '10px'
          }}
        />
        <button
          onClick={handleGreet}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          인사하기
        </button>
      </div>

      {/* 조건부 렌더링: greeting이 있을 때만 표시 */}
      {greeting && (
        <p style={{ fontSize: '24px', color: '#646cff' }}>
          {greeting}
        </p>
      )}
    </div>
  )
}

export default App
