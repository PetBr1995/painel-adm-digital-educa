// src/pages/Conteudos/MoverCategoria.jsx
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./MoverCategoria.css";

const MoverCategoria = ({ showFormMoverCategoria, setShowFormMoverCategoria }) => {
    const [conteudoId, setConteudoId] = useState("");
    const [novaCategoriaId, setNovaCategoriaId] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [conteudos, setConteudos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!showFormMoverCategoria) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const [categoriasRes, conteudosFirstRes] = await Promise.all([
                    axios.get("https://api.digitaleduca.com.vc/categorias/list", {
                        headers,
                    }),
                    axios.get("https://api.digitaleduca.com.vc/conteudos?page=1&limit=100", {
                        headers,
                    }),
                ]);

                const categoriasData = Array.isArray(categoriasRes.data)
                    ? categoriasRes.data
                    : [];

                const conteudosFirstRaw = conteudosFirstRes.data;
                let conteudosData = Array.isArray(conteudosFirstRaw?.data)
                    ? conteudosFirstRaw.data
                    : Array.isArray(conteudosFirstRaw)
                        ? conteudosFirstRaw
                        : [];

                const pagination = conteudosFirstRaw?.pagination;

                if (pagination && pagination.totalPages && pagination.totalPages > 1) {
                    const currentPage = pagination.page || 1;
                    const totalPages = pagination.totalPages;
                    const limit = pagination.limit || 100;

                    const requests = [];
                    for (let page = currentPage + 1; page <= totalPages; page++) {
                        requests.push(
                            axios.get(
                                `https://api.digitaleduca.com.vc/conteudos?page=${page}&limit=${limit}`,
                                { headers }
                            )
                        );
                    }

                    if (requests.length > 0) {
                        const responses = await Promise.all(requests);
                        responses.forEach((res) => {
                            const raw = res.data;
                            if (Array.isArray(raw?.data)) {
                                conteudosData = conteudosData.concat(raw.data);
                            } else if (Array.isArray(raw)) {
                                conteudosData = conteudosData.concat(raw);
                            }
                        });
                    }
                }

                setCategorias(categoriasData);
                setConteudos(conteudosData);

                console.log("Categorias carregadas:", categoriasData.length);
                console.log("Conteúdos carregados (todas as páginas):", conteudosData.length);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    text: "Não foi possível carregar categorias ou conteúdos.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showFormMoverCategoria]);

    const handleConteudoChange = (event) => {
        const value = event.target.value;
        setConteudoId(value);
    };

    const handleCategoriaChange = (event) => {
        const value = event.target.value;
        setNovaCategoriaId(value);
    };

    const handleCancelar = () => {
        setConteudoId("");
        setNovaCategoriaId("");
        setShowFormMoverCategoria(false);
    };

    const moverCategoria = async () => {
        if (!conteudoId || conteudoId === "") {
            Swal.fire({
                icon: "warning",
                title: "Atenção",
                text: "Selecione o conteúdo.",
            });
            return;
        }

        if (!novaCategoriaId || novaCategoriaId === "") {
            Swal.fire({
                icon: "warning",
                title: "Atenção",
                text: "Selecione a nova categoria.",
            });
            return;
        }

        try {
            const token = localStorage.getItem("token");

            console.log("Valores brutos do select:", {
                conteudoId,
                novaCategoriaId,
                tipoConteudoId: typeof conteudoId,
                tipoNovaCategoriaId: typeof novaCategoriaId,
            });

            const conteudoIdInt = parseInt(conteudoId, 10);
            const novaCategoriaIdInt = parseInt(novaCategoriaId, 10);

            if (isNaN(conteudoIdInt) || conteudoIdInt <= 0) {
                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    text: "ID do conteúdo inválido.",
                });
                return;
            }

            if (isNaN(novaCategoriaIdInt) || novaCategoriaIdInt <= 0) {
                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    text: "ID da categoria inválido.",
                });
                return;
            }

            const payload = {
                conteudoId: conteudoIdInt,
                novaCategoriaId: novaCategoriaIdInt,
            };

            console.log("Payload FINAL enviado para mover-categoria:", payload);

            await axios.put(
                "https://api.digitaleduca.com.vc/conteudos/mover-categoria",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "O conteúdo foi movido para a nova categoria.",
            });

            setConteudoId("");
            setNovaCategoriaId("");
            setShowFormMoverCategoria(false);
        } catch (error) {
            console.error("Erro ao mover conteúdo:", error);
            console.log("Response data bruta:", error.response?.data);

            const backendMessage =
                (Array.isArray(error.response?.data?.message)
                    ? error.response.data.message.join(" | ")
                    : error.response?.data?.message) ||
                error.response?.data?.error ||
                error.response?.data?.msg ||
                "Erro ao mover o conteúdo.";

            Swal.fire({
                icon: "error",
                title: `Erro ${error.response?.status || ""}`,
                text: backendMessage,
            });
        }
    };

    if (!showFormMoverCategoria) {
        return null;
    }

    return (
        <div className="mover-categoria-container">
            <h2 className="mover-categoria-title">Mover Conteúdo para Outra Categoria</h2>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Carregando dados...</p>
                </div>
            ) : (
                <div className="form-container">
                    {/* Select de Conteúdos */}
                    <div className="form-group">
                        <label htmlFor="conteudo-select">Selecione o Conteúdo</label>
                        <select
                            id="conteudo-select"
                            className="form-select"
                            value={conteudoId}
                            onChange={handleConteudoChange}
                        >
                            <option value="">Escolha um conteúdo</option>
                            {conteudos.length === 0 ? (
                                <option value="" disabled>
                                    Nenhum conteúdo disponível
                                </option>
                            ) : (
                                conteudos.map((conteudo) => (
                                    <option
                                        key={conteudo.id ?? conteudo._id}
                                        value={conteudo.id ?? conteudo._id}
                                    >
                                        {conteudo.titulo}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Select de Categorias */}
                    <div className="form-group">
                        <label htmlFor="categoria-select">Nova Categoria</label>
                        <select
                            id="categoria-select"
                            className="form-select"
                            value={novaCategoriaId}
                            onChange={handleCategoriaChange}
                        >
                            <option value="">Escolha uma categoria</option>
                            {categorias.length === 0 ? (
                                <option value="" disabled>
                                    Nenhuma categoria disponível
                                </option>
                            ) : (
                                categorias.map((categoria) => (
                                    <option
                                        key={categoria.id ?? categoria._id}
                                        value={categoria.id ?? categoria._id}
                                    >
                                        {categoria.nome}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Botões */}
                    <div className="button-group">
                        <button
                            className="btn btn-cancel"
                            onClick={handleCancelar}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={moverCategoria}
                            disabled={!conteudoId || !novaCategoriaId}
                        >
                            Mover
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoverCategoria;
