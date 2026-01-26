import { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const API = "https://api.digitaleduca.com.vc";

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const usuario = state?.usuario; // ✅ vindo da listagem (navigate state)

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [celular, setCelular] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ Preenche o form a partir do state (sem GET por ID)
  useEffect(() => {
    setError("");
    setSuccess("");

    if (!usuario) {
      setLoading(false);
      setError(
        "Não foi possível carregar os dados do usuário (acesso direto à rota). Volte para a lista e clique em Editar novamente."
      );
      return;
    }

    setNome(usuario?.nome ?? "");
    setEmail(usuario?.email ?? "");
    setCelular(usuario?.celular ?? "");

    // datas: se vierem em ISO com horário, pegamos só YYYY-MM-DD
    const di = usuario?.dataInicio ? String(usuario.dataInicio).slice(0, 10) : "";
    const df = usuario?.dataFim ? String(usuario.dataFim).slice(0, 10) : "";
    setDataInicio(di);
    setDataFim(df);

    setLoading(false);
  }, [usuario]);

  const UpdateUser = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        nome,
        email,
        celular,
        dataInicio,
        dataFim,
        ...(senha ? { senha } : {}),
      };

      const res = await axios.put(
        `${API}/usuarios/admin/update/${id}`,
        payload,
        authHeaders
      );

      console.log(res);
      setSuccess("Usuário atualizado com sucesso!");
      // navigate("/usuarios"); // se quiser voltar pra listagem depois de salvar
    } catch (err) {
      console.log(err);
      const msg =
        err?.response?.data?.message ||
        "Erro ao atualizar usuário. Verifique os campos e tente novamente.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    UpdateUser();
  };

  if (loading) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <form onSubmit={handleUpdate}>
      <Stack spacing={2} sx={{ maxWidth: 520 }}>
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => navigate("/usuarios")}>
                Voltar para lista
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {success && <Alert severity="success">{success}</Alert>}

        <TextField
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
          required
          disabled={!usuario} // se não tiver state, evita editar "no vazio"
        />

        <TextField
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          type="email"
          disabled={!usuario}
        />

        <TextField
          label="Senha (opcional)"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          fullWidth
          type="password"
          helperText="Preencha apenas se quiser alterar a senha."
          disabled={!usuario}
        />

        <TextField
          label="Celular"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          fullWidth
          disabled={!usuario}
        />

        <TextField
          label="Data Início"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          disabled={!usuario}
        />

        <TextField
          label="Data Fim"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          disabled={!usuario}
        />

        <Stack direction="row" spacing={2}>
          <Button
            type="submit"
            variant="contained"
            disabled={saving || !usuario}
            startIcon={saving ? <CircularProgress size={18} /> : null}
          >
            Salvar
          </Button>

          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Voltar
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default EditarUsuario;
