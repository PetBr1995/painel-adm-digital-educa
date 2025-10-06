import React, { useState } from 'react';
import axios from 'axios';
import { Upload } from 'tus-js-client';

export default function CadastrarConteudo() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Selecione um arquivo');

    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Usuário não autenticado');

      // Cria conteúdo via seu backend e pega URL TUS
      const response = await axios.post(
        'https://testeapi.digitaleduca.com.vc/conteudos/create',
        {
          titulo: 'Meu Conteúdo',
          descricao: 'Descrição do conteúdo',
          categoriaId: 1,
          tipo: 'CURSO',
          level: 'BÁSICO',
          fileSize: file.size
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let { uploadUrl } = response.data;
      if (!uploadUrl) throw new Error('Upload URL não retornada');

      // REMOVE o token da URL (Vimeo TUS requer endpoint sem query)
      const urlWithoutToken = uploadUrl.split('?')[0];

      // Faz upload usando tus-js-client
      const upload = new Upload(file, {
        endpoint: urlWithoutToken, // ⚠️ aqui vai só a URL base
        uploadUrl: uploadUrl, // ⚠️ aqui passa a URL completa com token
        metadata: {
          filename: file.name,
          filetype: file.type
        },
        retryDelays: [0, 1000, 3000, 5000],
        onError(err) {
          console.error('Erro no upload:', err);
        },
        onProgress(bytesUploaded, bytesTotal) {
          const progress = (bytesUploaded / bytesTotal) * 100;
          console.log(`Upload: ${progress.toFixed(2)}%`);
        },
        onSuccess() {
          console.log('Upload finalizado:', upload.url);
          alert('Upload concluído com sucesso!');
        }
      });

      upload.start();
    } catch (err) {
      console.error('Erro ao criar conteúdo:', err);
      alert('Erro ao criar conteúdo. Veja console.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Cadastrar Conteúdo</button>
    </form>
  );
}
