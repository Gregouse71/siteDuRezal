import './App.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Default } from './default/Default';
import { Header } from './header_footer/Header';
import { Footer } from './header_footer/Footer';
import { AboutUs } from './about-us/AboutUs';
import Admin from './admin/Admin';
import Users from './users/Users';
import Popup from './popup/popup';

function App() {

  return (
    <div className="App">
        <Header/>
        <div id="main-view">
          <Routes>
            <Route path="" element={<Default />}></Route>
            <Route path="about-us/*" element={<AboutUs/>}></Route> 
            <Route path="admin/*" element={<Admin/>}></Route> 
            <Route path="resident/*" element={<Users/>}></Route> 
            <Route path="*" element={<Navigate to="" replace />}></Route> 
          </Routes>
        </div>
        <Popup />
        <Footer/>
    </div> 
  );
}



export default App;
