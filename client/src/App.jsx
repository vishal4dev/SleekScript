import {BrowserRouter, Routes , Route} from 'react-router-dom'
import Home from './Home'
import About from './About'
import Signin from './Signin'
import Signup from './Signup'
import Dashboard from './Dashboard'
import Projects from './Projects'

export default function App() {
  return (
   
   <BrowserRouter>
     <Routes>
      
       <Route path='/' element={<Home />} />
       <Route path='/about' element={<About />} />
       <Route path='/sign-in' element={<Signin />} />
       <Route path='/sign-up' element={<Signup />} />
       <Route path='/dashboard' element={<Dashboard />} />
       <Route path='/projects' element={<Projects />} />
      
      </Routes>     
   </BrowserRouter>

   )
}
