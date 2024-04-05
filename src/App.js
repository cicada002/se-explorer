import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Blocks from './pages/Blocks';
import Validators from './pages/Validators';
import Home from './pages/Home';
import Search from './pages/Search';
import Navbar from './components/Navbar';

function App() {
  return (
    <h1 className="flex flex-col bg-[#303031] h-screen">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' exact element={<Home/>}/>
          <Route path='/validators' exact element={<Validators/>}/>
          <Route path='/blocks' exact element={<Blocks/>}/>
          <Route path='/blocks/:page' exact element={<Blocks/>}/>
          <Route path='/search' exact element={<Search/>}/>
          <Route path='/search/:id' exact element={<Search/>}/>
        </Routes>
      </Router>
    </h1>
  );
}

export default App;
