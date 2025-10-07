// src/pages/Favoritas.js
import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const FAV_KEY = "favorites_recipes";

// Helpers
const getFavorites = () => {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); }
  catch { return []; }
};
const removeFavorite = (id) => {
  const list = getFavorites().filter((r) => r.id_receta !== id);
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
  return list;
};

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
      <div className="flex align-items-center" style={{ position: "relative", minHeight: 48 }}>
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
            onClick={() => nav("/")}
            severity="danger"
            className="p-button-sm"
          />
        </div>
      </div>
    </Card>
  );
}

// ======= Tarjeta de receta favorita =======
function FavoriteCard({ recipe, onRemove }) {
  const header = recipe.foto_url
    ? <img src={recipe.foto_url} alt={recipe.titulo} style={{ width:"100%", height:180, objectFit:"cover" }} />
    : null;

  const footer = (
    <div className="flex justify-content-between align-items-center">
      <small className="text-600">{recipe.username || "Autor"}</small>
      <Button icon="pi pi-trash" label="Quitar" severity="danger" outlined onClick={() => onRemove(recipe.id_receta)} />
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
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(() => { setItems(getFavorites()); }, []);

  const onRemove = (id) => {
    const updated = removeFavorite(id);
    setItems(updated);
  };

  return (
    <div className="p-2">
      <HeaderBar />

      {/* Título + botón volver */}
      <div className="flex align-items-center justify-content-between mb-3">
        <h3 className="m-0" style={{ color: "#2e7d32" }}>
          Mis recetas favoritas 💚
        </h3>
        <Button
          label="Volver a Home"
          icon="pi pi-arrow-left"
          onClick={() => nav("/home")}
          className="p-button-sm"
          severity="secondary"
          outlined
        />
      </div>

      {items.length === 0 ? (
        <p className="text-600 m-3">
          Aún no has guardado recetas como favoritas.
          <br />
          Ve al <strong>Inicio</strong> y presiona el botón “Favorito” en una receta.
        </p>
      ) : (
        <div className="flex flex-wrap">
          {items.map((r) => (
            <FavoriteCard key={r.id_receta} recipe={r} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
