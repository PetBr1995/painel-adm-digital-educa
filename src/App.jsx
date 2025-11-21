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
import { Modulos } from './pages/Modulos/Modulos';
import Categoria from './pages/Categorias/Categoria';
import UploadVideo from './components/UploadVideo';
import Planos from './pages/Planos/Planos';
import CadastraPlano from './components/CadastraPlano';
import EditarCurso from './pages/EditarCurso/EditarCurso';
import EditarInstrutor from './components/EditarInstrutor';
import EditarModulo from './components/EditarModulo';
import SearchResults from './components/SearchResults';
import Podcast from './pages/Podcast/Podcast';
import CadastrarUsuario from './pages/CadastrarUsuario/CadastrarUsuario';
import Usuarios from './pages/Usuarios/Usuarios';
import ConteudoForm from './components/CadastrarConteudo';
import ConteudoUploader from './components/TesteCadastroConteudo';
import Conteudo from './components/Conteudo';
import UploadVideoModulo from './components/UploadVideoModulo';
import EditarConteudo from './pages/EditarCurso/EditarCurso';
import UploadVideoIntrodutorio from './components/UploadVideoIntrodutorio';
import PublicDashboard from './pages/Dashboard/PublicDashboard';
import PublicLayout from './pages/PublicLayout/PublicLayout';


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
          <Route path='search' element={<SearchResults />} />
          <Route path="cadastrarcurso" element={<CadastrarCurso />} />
          <Route path="cursos" element={<Cursos />} />
          <Route path='dashboard' element={<PublicDashboard />} />
          <Route path="cadastrarinstrutor" element={<CadastroInstrutor />} />
          <Route path="relatorios" element={<div>Relatórios</div>} />
          <Route path="configuracoes" element={<div>Configurações</div>} />
          <Route path='instrutores' element={<Instrutor />} />
          <Route path='modulos' element={<Modulos />} />
          <Route path='cadastromodulo' element={<CadastroModulo />} />
          <Route path='categorias' element={<Categoria />} />
          <Route path='upload-video' element={<UploadVideo />} />
          <Route path='planos' element={<Planos />} />
          <Route path='cadastrarplano' element={<CadastraPlano />} />
          <Route path='editarconteudo/:id' element={<EditarConteudo />} />
          <Route path="/editarinstrutor/:id" element={<EditarInstrutor />} />
          <Route path='/editar-modulo' element={<EditarModulo />} />
          <Route path='/podcast' element={<Podcast />} />
          <Route path='/cadastrarusuario' element={<CadastrarUsuario />} />
          <Route path='/usuarios' element={<Usuarios />} />
          <Route path='/cadastrarconteudo' element={<ConteudoForm />} />
          <Route path='/conteudos/:id' element={<Conteudo />} />
          <Route path='/uploadvideomodulo' element={<UploadVideoModulo />} />
          <Route path='/uploadvideointrodutorio' element={<UploadVideoIntrodutorio />} />
          <Route path='/public-dashboard' element={<PublicDashboard />} />
        </Route>
        <Route path='/testes' element={<ConteudoForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
