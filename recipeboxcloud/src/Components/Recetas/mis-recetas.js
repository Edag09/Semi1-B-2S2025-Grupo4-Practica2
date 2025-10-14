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
        {/* Título centrado */}
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

        {/* Botones a la derecha */}
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
            label="Crear receta"
            icon="pi pi-plus"
            onClick={() => nav("/nueva")}
            severity="success"
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

// ======= Tarjeta de receta creada por el usuario =======
function MyRecipeCard({ recipe }) {
  const header = recipe.foto_url ? (
    <img
      src={
        recipe.foto_url.startsWith("http")
          ? recipe.foto_url
          : "https://via.placeholder.com/400x240?text=Sin+imagen"
      }
      alt={recipe.titulo}
      style={{ width: "100%", height: 180, objectFit: "cover" }}
    />
  ) : (
    <img
      src="https://via.placeholder.com/400x240?text=Sin+imagen"
      alt="sin-imagen"
      style={{ width: "100%", height: 180, objectFit: "cover" }}
    />
  );

  const footer = (
    <div className="flex justify-content-between align-items-center">
      <small className="text-600">
        Creado el{" "}
        {recipe.creado_en
          ? new Date(recipe.creado_en).toLocaleDateString("es-GT", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Fecha desconocida"}
      </small>
    </div>
  );

  return (
    <Card
      title={recipe.titulo}
      subTitle={recipe.descripcion || "Sin descripción"}
      header={header}
      footer={footer}
      className="m-2 shadow-3"
      style={{ width: 320, borderRadius: 14 }}
    >
      <p className="text-700" style={{ fontSize: "0.9rem" }}>
        {recipe.cuerpo ? `${recipe.cuerpo.slice(0, 100)}...` : ""}
      </p>
    </Card>
  );
}

// ======= Página Mis Recetas =======
export default function MisRecetas() {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);
  const nav = useNavigate();

  // ✅ Cargar sesión desde localStorage
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

  // ✅ Obtener recetas del usuario autenticado (solo con token)
  useEffect(() => {
    if (!userSession?.token) return;

    const fetchUserRecipes = async () => {
      try {
        setLoading(true);

        const url = API_ROUTES.RECIPES.GET_ALL_BY_USER;
        console.log("📡 Consultando recetas del usuario...");
        console.log("🔗 URL de la petición:", url);

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userSession.token}`,
          },
        });

        const data = await response.json();
        console.log("📦 Respuesta del backend:", data);

        if (!response.ok) {
          throw new Error(data.message || "Error al obtener las recetas");
        }

        // Extrae correctamente las recetas (por si vienen en 'data')
        const recetasData = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        setRecetas(recetasData);
      } catch (error) {
        console.error("❌ Error al obtener recetas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [userSession]);

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

      {/* Info del usuario */}
      <div className="flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="m-0" style={{ color: "#2e7d32" }}>
            Recetas de {userSession.username} 🍽️
          </h3>
          <small style={{ color: "#6d4c41" }}>
            Token activo: <b>{userSession.token ? "✅ Sí" : "❌ No"}</b>
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

      {/* Contenido */}
      {loading ? (
        <p className="m-3 text-600">Cargando tus recetas...</p>
      ) : recetas.length === 0 ? (
        <p className="m-3 text-600">
          No has creado recetas todavía 🍳
          <br />
          Usa el botón <strong>“Crear receta”</strong> para empezar.
        </p>
      ) : (
        <div
          className="flex flex-wrap justify-content-center"
          style={{ gap: "1rem" }}
        >
          {recetas.map((r) => (
            <MyRecipeCard key={r.id_receta} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
