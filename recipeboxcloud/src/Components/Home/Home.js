import React, { useEffect, useMemo, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import API_ROUTES from "../Config/apiRoutes";

const FAV_KEY = "favorites_recipes";

// ===== Helpers favoritos =====
const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
};
const setFavorites = (list) =>
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
const isFavorite = (id) => getFavorites().some((r) => r.id_receta === id);
const toggleFavorite = (recipe) => {
  const list = getFavorites();
  const exists = list.some((r) => r.id_receta === recipe.id_receta);
  const next = exists
    ? list.filter((r) => r.id_receta !== recipe.id_receta)
    : [recipe, ...list];
  setFavorites(next);
};

// ======= Barra superior =======
function HeaderBar({ userSession }) {
  const nav = useNavigate();

  return (
    <Card
      className="mb-3"
      style={{
        borderRadius: 16,
        background: "linear-gradient(90deg,#e8f5e9,#f1f8e9)",
        padding: "0.75rem 1rem",
      }}
    >
      <div
        className="flex align-items-center"
        style={{ position: "relative", minHeight: 48 }}
      >
        <h2
          className="m-0 text-center"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#2e7d32",
            letterSpacing: 0.3,
            fontWeight: 700,
          }}
        >
          RecipeBoxCloud
        </h2>

        <div className="ml-auto flex gap-2">
          <Button
            label="Crear receta"
            icon="pi pi-plus"
            onClick={() => nav("/nueva")}
            severity="success"
            outlined
            className="p-button-sm"
          />
          <Button
            label="Mis recetas"
            icon="pi pi-book"
            onClick={() => nav("/mis-recetas")}
            severity="info"
            outlined
            className="p-button-sm"
          />
          <Button
            label="Favoritas"
            icon="pi pi-heart"
            onClick={() => nav("/favoritos")}
            severity="help"
            outlined
            className="p-button-sm"
          />
          <Button
            label="Salir"
            icon="pi pi-sign-out"
            onClick={() => {
              localStorage.removeItem("userSession");
              nav("/");
            }}
            severity="danger"
            className="p-button-sm"
          />
        </div>
      </div>
    </Card>
  );
}

// ======= Tarjeta de receta =======
function RecipeCard({ recipe, onToggle }) {
  const fav = useMemo(() => isFavorite(recipe.id_receta), [recipe.id_receta]);

  const header = recipe.foto_url ? (
    <img
      src={recipe.foto_url}
      alt={recipe.titulo}
      style={{ width: "100%", height: 180, objectFit: "cover" }}
    />
  ) : null;

  const footer = (
    <div className="flex justify-content-between align-items-center">
      <small className="text-600">{recipe.username || "Autor"}</small>
      <Button
        icon={fav ? "pi pi-heart-fill" : "pi pi-heart"}
        label={fav ? "Quitar" : "Favorito"}
        onClick={() => onToggle(recipe)}
        size="small"
        severity={fav ? "danger" : "help"}
        outlined={!fav}
      />
    </div>
  );

  return (
    <Card
      title={recipe.titulo}
      subTitle={recipe.descripcion}
      header={header}
      footer={footer}
      className="m-2"
      style={{ width: 300, borderRadius: 14 }}
    />
  );
}

// ======= Página Home =======
export default function Home() {
  const navigate = useNavigate();
  const [userSession, setUserSession] = useState(null);
  const [all, setAll] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Cargar sesión desde localStorage al montar el componente
  useEffect(() => {
    const stored = localStorage.getItem("userSession");
    if (stored) {
      try {
        setUserSession(JSON.parse(stored));
      } catch {
        localStorage.removeItem("userSession");
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  // ✅ Cargar recetas solo cuando ya tenemos sesión
  useEffect(() => {
    if (!userSession?.token) return;

    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ROUTES.RECIPES.GET_ALL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userSession.token}`,
          },
        });

        const data = await response.json();
        console.log("📦 Recetas obtenidas:", data);

        if (!response.ok) throw new Error(data.message || "Error al obtener recetas");

        const recetas = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        setAll(recetas);
      } catch (error) {
        console.error("❌ Error al cargar recetas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [userSession]);

  // Filtro de búsqueda
  const items = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return all;
    return all.filter(
      (r) =>
        (r.titulo || "").toLowerCase().includes(text) ||
        (r.descripcion || "").toLowerCase().includes(text) ||
        (r.username || "").toLowerCase().includes(text)
    );
  }, [all, q]);

  const handleToggle = (recipe) => {
    toggleFavorite(recipe);
    setAll((prev) => [...prev]); // re-render
  };

  // 🔒 Protección visual si no hay sesión cargada todavía
  if (!userSession) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <p>Cargando sesión...</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <HeaderBar userSession={userSession} />

      <div
        className="flex justify-content-between align-items-center mb-3"
        style={{ padding: "0 0.5rem" }}
      >
        <h3 style={{ color: "#2e7d32" }}>
          Bienvenido, {userSession.username || "Usuario"}
        </h3>
        <span style={{ color: "#8d6e63" }}>
          ID usuario: <b>{userSession.id_usuario || "?"}</b>
        </span>
      </div>

      {/* Buscador */}
      <div className="flex gap-2 mb-3">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar recetas (título, autor, descripción)…"
          />
        </span>
      </div>

      {loading ? (
        <p className="m-3 text-600">Cargando recetas...</p>
      ) : all.length === 0 ? (
        <p className="m-3 text-600">No hay recetas disponibles.</p>
      ) : (
        <div className="flex flex-wrap">
          {items.map((r) => (
            <RecipeCard key={r.id_receta} recipe={r} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
