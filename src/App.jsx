import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login/Login';
import CadastrarCurso from './pages/CadastrarCurso/CadastrarCurso';
import CadastroInstrutor from './pages/CadastroInstrutor/CadastroInstrutor';
import Home from './pages/Home/Home';
import { PrivateRoute } from './components/PrivateRoute';
import Cursos from './pages/Cursos/Cursos';
import Instrutor from './pages/Instrutor/Instrutor';
import Dashboard from './pages/Dashboard/Dashboard';

import CadastroModulo from './components/CadastroModulo';
import  { Modulos }  from './pages/Modulos/Modulos';
import Categoria from './pages/Categorias/Categoria';
import UploadVideo from './components/UploadVideo';
import Planos from './pages/Planos/Planos';
import CadastraPlano from './components/CadastraPlano';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Login />} />

        {/* Rotas protegidas com layout Home */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route path="cadastrarcurso" element={<CadastrarCurso />} />
          <Route path="cursos" element={<Cursos />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path="cadastrarinstrutor" element={<CadastroInstrutor />} />
          <Route path="relatorios" element={<div>Relatórios</div>} />
          <Route path="configuracoes" element={<div>Configurações</div>} />
          <Route path='instrutores' element={<Instrutor />} />
          <Route path='modulos' element={<Modulos />} />
          <Route path='cadastromodulo' element={<CadastroModulo />} />
          <Route path='categorias' element={<Categoria />} />
          <Route path='upload-video' element={<UploadVideo />} />
          <Route path='planos' element={<Planos />} />
          <Route path='cadastrarplano' element={<CadastraPlano/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
