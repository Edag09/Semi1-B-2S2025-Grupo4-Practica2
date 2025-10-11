import React, { useEffect, useMemo, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import API_ROUTES from "../Config/apiRoutes";


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
function RecipeCard({ recipe, onToggleFavorite }) {
  const header = recipe.foto_url ? (
    <img
      src={recipe.foto_url}
      alt={recipe.titulo}
      style={{ width: "100%", height: 180, objectFit: "cover" }}
    />
  ) : null;

  const fav = !!recipe._isFavorite;

  const footer = (
    <div className="flex justify-content-between align-items-center">
      <small className="text-600">{recipe.username || "Autor"}</small>
      <Button
        icon={fav ? "pi pi-heart-fill" : "pi pi-heart"}
        label={fav ? "Quitar" : "Favorito"}
        onClick={() => onToggleFavorite(recipe, fav)}
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

  // ✅ Cargar sesión
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

  // ✅ Obtener recetas + verificar si son favoritas
  useEffect(() => {
    if (!userSession?.token) return;

    const fetchRecipes = async () => {
      try {
        setLoading(true);

        // 1️⃣ Traer todas las recetas
        const resp = await fetch(API_ROUTES.RECIPES.GET_ALL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userSession.token}`,
          },
        });

        const raw = await resp.json();
        if (!resp.ok)
          throw new Error(raw.message || "Error al obtener recetas");

        const recetas = Array.isArray(raw)
          ? raw
          : Array.isArray(raw.data)
          ? raw.data
          : [];

        // 2️⃣ Verificar si cada receta está en favoritos
        const checked = await Promise.all(
          recetas.map(async (r) => {
            try {
              const url = API_ROUTES.FAVORITES.VERIFICAR_FAVORITO(r.id_receta);
              const cResp = await fetch(url, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userSession.token}`,
                },
              });
              const cRaw = await cResp.json();
              console.log(
                `🔍 Verificando receta ${r.id_receta}:`,
                cRaw?.data?.is_favorite
              );
              const isFav = !!cRaw?.data?.is_favorite;
              return { ...r, _isFavorite: isFav };
            } catch (err) {
              console.warn(
                `⚠️ No se pudo verificar favorito para receta ${r.id_receta}:`,
                err
              );
              return { ...r, _isFavorite: false };
            }
          })
        );

        setAll(checked);
      } catch (error) {
        console.error("❌ Error al cargar recetas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [userSession]);

  // ✅ Filtro de búsqueda
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

  // ✅ Agregar / quitar favorito
  const handleToggleFavorite = async (recipe, isFavNow) => {
    if (!userSession?.token) {
      alert("Inicia sesión para gestionar favoritos");
      return;
    }

    const url = isFavNow
      ? API_ROUTES.FAVORITES.QUITAR_FAVORITO(recipe.id_receta)
      : API_ROUTES.FAVORITES.AGREGAR_FAVORITO(recipe.id_receta);
    const method = isFavNow ? "DELETE" : "POST";

    try {
      // Reflejar de inmediato (optimista)
      setAll((prev) =>
        prev.map((r) =>
          r.id_receta === recipe.id_receta
            ? { ...r, _isFavorite: !isFavNow }
            : r
        )
      );

      const resp = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userSession.token}`,
        },
        body: isFavNow
          ? null
          : JSON.stringify({ id_receta: recipe.id_receta }),
      });

      const raw = await resp.json();
      if (!resp.ok)
        throw new Error(raw.message || "Error al actualizar favorito");

      console.log("✅ Estado de favorito actualizado:", raw);
    } catch (err) {
      console.error("❌ Error al actualizar favorito:", err);
      // Revertir si falla
      setAll((prev) =>
        prev.map((r) =>
          r.id_receta === recipe.id_receta
            ? { ...r, _isFavorite: isFavNow }
            : r
        )
      );
    }
  };

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
      ) : items.length === 0 ? (
        <p className="m-3 text-600">No hay recetas disponibles.</p>
      ) : (
        <div className="flex flex-wrap">
          {items.map((r) => (
            <RecipeCard
              key={r.id_receta}
              recipe={r}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
