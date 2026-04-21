import React from 'react'
import Post from './components/Post'

function App() {
    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Post />
        </div>
    )
}

export default App
