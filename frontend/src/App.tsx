import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './header_footer/Header';
import { Footer } from './header_footer/Footer';
import Popup from './popup/popup';
import ScrollToTop from './components/ScrollToTop';
import React, { Suspense, lazy } from 'react';

const Default = lazy(() => import('./default/Default'));
const AboutUs = lazy(() => import('./about-us/AboutUs').then(m => ({ default: m.AboutUs })));
const Admin = lazy(() => import('./admin/Admin'));
const Users = lazy(() => import('./users/Users'));
const FAQ = lazy(() => import('./faq/FAQ'));

const Loading = () => <div style={{ padding: '20px', textAlign: 'center' }}>Chargement...</div>;

function App() {

  return (
    <div className="App">
        <ScrollToTop />
        <Header/>
        <div id="main-view">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="" element={<Default />}></Route>
              <Route path="about-us/*" element={<AboutUs/>}></Route> 
              <Route path="admin/*" element={<Admin/>}></Route> 
              <Route path="resident/*" element={<Users/>}></Route>
              <Route path="faq/" element={<FAQ/>}></Route>
              <Route path="*" element={<Navigate to="" replace />}></Route> 
            </Routes>
          </Suspense>
        </div>
        <Popup />
        <Footer/>
    </div> 
  );
}



export default App;
