import React, { useState } from "react";
import { Button, LinearProgress, TextField } from "@mui/material";
import * as tus from "tus-js-client";
import axios from "axios";

export default function ConteudoUploader() {
  const [titulo, setTitulo] = useState("");
  const [introFile, setIntroFile] = useState(null);
  const [videoFiles, setVideoFiles] = useState([]);
  const [progressIntro, setProgressIntro] = useState(0);
  const [progressVideos, setProgressVideos] = useState({});

  const handleCreateConteudo = async () => {
    if (!introFile) return alert("Selecione o vídeo introdutório!");

    

    try {
      // monta payload
      const payload = {
        titulo,
        categoriaId: 1,
        tipo: "CURSO",
        fileSize: introFile.size,
        videos: videoFiles.map((file) => ({
          titulo: file.name,
          duracao: 0, // opcional
        })),
      };

      // cria conteúdo no backend
      const { data } = await axios.post("https://api.digitaleduca.com.vc/conteudos/create", payload,{
        headers:{
            Authorization: "Bearer "+ localStorage.getItem('token')
        }
      });

      // 🔹 Upload do introdutório
      const uploadIntro = new tus.Upload(introFile, {
        endpoint: data.vimeoUploadLink,
        metadata: {
          filename: introFile.name,
          filetype: introFile.type,
        },
        uploadSize: introFile.size,
        onProgress: (bytesUploaded, bytesTotal) => {
          setProgressIntro(Math.floor((bytesUploaded / bytesTotal) * 100));
        },
        onSuccess: () => {
          console.log("Introdutório enviado ✅");
        },
      });
      uploadIntro.start();

      // 🔹 Upload dos vídeos diretos
      if (data.extraVideos?.length) {
        data.extraVideos.forEach((videoObj, index) => {
          const file = videoFiles[index];
          if (!file) return;

          const upload = new tus.Upload(file, {
            endpoint: videoObj.vimeoUploadLink,
            metadata: {
              filename: file.name,
              filetype: file.type,
            },
            uploadSize: file.size,
            onProgress: (bytesUploaded, bytesTotal) => {
              setProgressVideos((prev) => ({
                ...prev,
                [file.name]: Math.floor((bytesUploaded / bytesTotal) * 100),
              }));
            },
            onSuccess: () => {
              console.log(`Vídeo ${file.name} enviado ✅`);
            },
          });

          upload.start();
        });
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao criar conteúdo!");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <TextField
        label="Título do conteúdo"
        fullWidth
        margin="normal"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      {/* Introdutório */}
      <Button variant="outlined" component="label" fullWidth style={{ marginTop: 10 }}>
        Selecionar Vídeo Introdutório
        <input type="file" hidden onChange={(e) => setIntroFile(e.target.files?.[0] || null)} />
      </Button>
      {introFile && <p>Arquivo introdutório: {introFile.name}</p>}

      {/* Vídeos Diretos */}
      <Button variant="outlined" component="label" fullWidth style={{ marginTop: 10 }}>
        Selecionar Vídeos Diretos
        <input type="file" multiple hidden onChange={(e) => setVideoFiles(Array.from(e.target.files || []))} />
      </Button>
      {videoFiles.map((f) => (
        <p key={f.name}>Vídeo direto: {f.name}</p>
      ))}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: 20 }}
        onClick={handleCreateConteudo}
        disabled={!introFile}
      >
        Criar Conteúdo + Enviar
      </Button>

      {/* Progresso do introdutório */}
      {progressIntro > 0 && (
        <div style={{ marginTop: 20 }}>
          <p>Upload introdutório: {progressIntro}%</p>
          <LinearProgress variant="determinate" value={progressIntro} />
        </div>
      )}

      {/* Progresso dos diretos */}
      {Object.keys(progressVideos).map((name) => (
        <div key={name} style={{ marginTop: 20 }}>
          <p>{name}: {progressVideos[name]}%</p>
          <LinearProgress variant="determinate" value={progressVideos[name]} />
        </div>
      ))}
    </div>
  );
}