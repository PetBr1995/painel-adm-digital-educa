import { 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Box, 
  Card,
  CardContent,
  Stack,
  alpha,
  LinearProgress,
  Avatar,
  Fade,
  Alert,
  Snackbar
} from "@mui/material";
import { 
  ArrowBack, 
  FolderOpen, 
  Save, 
  Cancel,
  Description,
  Title,
  Subtitles
} from "@mui/icons-material";
import theme from "../theme/theme";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const CadastroModulo = ({ setForm, onModuleCreated, getCurso }) => {
  const location = useLocation();
  const conteudoId = location.state?.conteudoId;
  const navigate = useNavigate();

  // Form states
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  
  // UI states
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    console.log("ID do conteúdo recebido no CadastroModulo:", conteudoId);
  }, [conteudoId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    } else if (titulo.length < 3) {
      newErrors.titulo = 'Título deve ter pelo menos 3 caracteres';
    }
    
    if (!subtitulo.trim()) {
      newErrors.subtitulo = 'Subtítulo é obrigatório';
    } else if (subtitulo.length < 3) {
      newErrors.subtitulo = 'Subtítulo deve ter pelo menos 3 caracteres';
    }
    
    if (!descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (descricao.length < 10) {
      newErrors.descricao = 'Descrição deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  const createModule = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('Por favor, corrija os erros no formulário', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://10.10.10.62:3000/modulo-conteudo/create',
        {
          titulo: titulo.trim(),
          subtitulo: subtitulo.trim(),
          descricao: descricao.trim(),
          conteudoId: Number(conteudoId),
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          }
        }
      );

      console.log('Módulo criado com sucesso:', response.data);

      if ((response.status === 200 || response.status === 201) && response.data) {
        showNotification('Módulo criado com sucesso!', 'success');
        
        // Limpar formulário
        setTitulo('');
        setSubtitulo('');
        setDescricao('');
        setErrors({});

        // Atualiza o conteúdo relacionado se a função existir
        if (typeof getCurso === 'function') {
          getCurso(conteudoId);
        }

        if (typeof onModuleCreated === 'function') {
          onModuleCreated();
        }

        // Redirecionar após um delay para mostrar o sucesso
        setTimeout(() => {
          if (typeof setForm === 'function') {
            setForm(false);
          } else {
            navigate(`/conteudos/${conteudoId}`);
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Erro ao criar módulo:', error.response || error);
      const errorMessage = error.response?.data?.message || "Erro inesperado. Tente novamente.";
      showNotification(`Erro ao criar módulo: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (typeof setForm === 'function') {
      setForm(false);
    } else {
      navigate(`/conteudos/${conteudoId}`);
    }
  };

  const progress = () => {
    const fields = [titulo, subtitulo, descricao];
    const filledFields = fields.filter(field => field.trim().length > 0);
    return (filledFields.length / fields.length) * 100;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: alpha(theme.palette.primary.main, 0.02),
      py: 4 
    }}>
      <Container maxWidth="md">
        <Fade in timeout={300}>
          <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Button
                startIcon={<ArrowBack />}
                variant="outlined"
                onClick={() => navigate(`/conteudos/${conteudoId}`)}
                sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  textTransform: 'none',
                  color: theme.palette.text.secondary,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderColor: theme.palette.primary.main,
                  }
                }}
              >
                Voltar aos conteúdos
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: theme.palette.primary.main,
                  width: 56,
                  height: 56
                }}>
                  <FolderOpen sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 0.5
                    }}
                  >
                    Criar Novo Módulo
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Adicione um novo módulo ao seu curso
                  </Typography>
                </Box>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Progresso do formulário
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(progress())}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progress()} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Main Card */}
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {loading && (
                <LinearProgress 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1
                  }} 
                />
              )}
              
              <CardContent sx={{ p: 4 }}>
                <form onSubmit={createModule}>
                  <Stack spacing={3}>
                    {/* Título Field */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Title color="primary" fontSize="small" />
                        <Typography variant="subtitle2" fontWeight={600}>
                          Título do Módulo
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        placeholder="Digite o título do módulo"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        error={!!errors.titulo}
                        helperText={errors.titulo}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }}
                      />
                    </Box>

                    {/* Subtítulo Field */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Subtitles color="primary" fontSize="small" />
                        <Typography variant="subtitle2" fontWeight={600}>
                          Subtítulo
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        placeholder="Digite o subtítulo do módulo"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                        error={!!errors.subtitulo}
                        helperText={errors.subtitulo}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }}
                      />
                    </Box>

                    {/* Descrição Field */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Description color="primary" fontSize="small" />
                        <Typography variant="subtitle2" fontWeight={600}>
                          Descrição
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Descreva o conteúdo e objetivos deste módulo..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        error={!!errors.descricao}
                        helperText={errors.descricao || `${descricao.length}/500 caracteres`}
                        inputProps={{ maxLength: 500 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }}
                      />
                    </Box>

                    {/* Action Buttons */}
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={2} 
                      sx={{ pt: 2 }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        disabled={loading}
                        size="large"
                        sx={{ 
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          borderColor: alpha(theme.palette.error.main, 0.5),
                          color: theme.palette.error.main,
                          '&:hover': {
                            borderColor: theme.palette.error.main,
                            bgcolor: alpha(theme.palette.error.main, 0.04)
                          }
                        }}
                      >
                        Cancelar
                      </Button>
                      
                      <Button
                        variant="contained"
                        type="submit"
                        startIcon={<Save />}
                        disabled={loading}
                        size="large"
                        sx={{ 
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                          },
                          '&:disabled': {
                            background: alpha(theme.palette.primary.main, 0.3)
                          }
                        }}
                      >
                        {loading ? "Criando Módulo..." : "Criar Módulo"}
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              </CardContent>
            </Card>

            {/* Success/Error Snackbar */}
            <Snackbar 
              open={showAlert}
              autoHideDuration={4000}
              onClose={() => setShowAlert(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert 
                onClose={() => setShowAlert(false)}
                severity={alertSeverity}
                variant="filled"
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 500
                }}
              >
                {alertMessage}
              </Alert>
            </Snackbar>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default CadastroModulo;