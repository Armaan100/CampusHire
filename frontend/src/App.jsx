import './App.css'
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
      </Routes>
    </div>
  )
}

export default App
