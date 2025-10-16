import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import API_ROUTES from "../Config/apiRoutes";

// ======= Barra superior =======
function HeaderBar() {
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
            label="Home"
            icon="pi pi-home"
            onClick={() => nav("/home")}
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

// ======= Tarjeta de receta (igual a Home) =======
function FavoriteCard({ recipe, onRemove }) {
  const header = recipe.foto_url ? (
    <img
      src={recipe.foto_url}
      alt={recipe.titulo}
      style={{ width: "100%", height: 180, objectFit: "cover" }}
    />
  ) : null;

  const footer = (
    <div className="flex justify-content-between align-items-center">
      <small className="text-600">{recipe.usuario?.username || "Autor"}</small>
      <Button
        icon="pi pi-heart-fill"
        label="Quitar favorito"
        onClick={() => onRemove(recipe.id_receta)}
        size="small"
        severity="danger"
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

// ======= Página de Favoritas =======
export default function Favoritas() {
  const [favoritas, setFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);
  const nav = useNavigate();

  // ✅ Cargar sesión
  useEffect(() => {
    const stored = localStorage.getItem("userSession");
    if (!stored) {
      nav("/");
      return;
    }
    try {
      const session = JSON.parse(stored);
      setUserSession(session);
    } catch {
      localStorage.removeItem("userSession");
      nav("/");
    }
  }, [nav]);

  // ✅ Obtener recetas favoritas desde el backend
  useEffect(() => {
    if (!userSession?.token) return;

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ROUTES.FAVORITES.GET_FAVORITES, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userSession.token}`,
          },
        });

        const data = await response.json();
        console.log("📦 Favoritas obtenidas:", data);

        if (!response.ok)
          throw new Error(data.message || "Error al obtener favoritas");

        // ✅ Aquí mapeamos para extraer la receta del objeto favorito
        const favs =
          Array.isArray(data?.data) && data.data.length > 0
            ? data.data.map((f) => ({
                ...f.receta,
                id_favorito: f.id_favorito,
              }))
            : [];

        setFavoritas(favs);
      } catch (error) {
        console.error("❌ Error al cargar favoritas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userSession]);

  // ✅ Quitar favorito (backend + actualización local)
  const handleRemove = async (id_receta) => {
    if (!userSession?.token) return;

    try {
      const response = await fetch(
        API_ROUTES.FAVORITES.QUITAR_FAVORITO(id_receta),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userSession.token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Error al eliminar favorito");

      setFavoritas((prev) => prev.filter((r) => r.id_receta !== id_receta));
    } catch (error) {
      console.error("❌ Error al eliminar favorito:", error);
      alert("No se pudo eliminar el favorito.");
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
      <HeaderBar />

      <div className="flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="m-0" style={{ color: "#2e7d32" }}>
            Mis recetas favoritas 💚
          </h3>
          <small style={{ color: "#6d4c41" }}>
            Usuario: <b>{userSession.username}</b>
          </small>
        </div>
        <Button
          label="Volver a Home"
          icon="pi pi-arrow-left"
          onClick={() => nav("/home")}
          className="p-button-sm"
          severity="secondary"
          outlined
        />
      </div>

      {loading ? (
        <p className="m-3 text-600">Cargando tus recetas favoritas...</p>
      ) : favoritas.length === 0 ? (
        <p className="text-600 m-3">
          Aún no has guardado recetas como favoritas.
          <br />
          Ve al <strong>Inicio</strong> y presiona el botón “Favorito” en una receta.
        </p>
      ) : (
        <div className="flex flex-wrap justify-content-center">
          {favoritas.map((r) => (
            <FavoriteCard key={r.id_receta} recipe={r} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
