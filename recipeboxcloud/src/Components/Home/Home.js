// src/pages/Home.js
import React, { useEffect, useMemo, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";

const FAV_KEY = "favorites_recipes";

// helpers favoritos (localStorage)
const getFavorites = () => {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
};
const setFavorites = (list) => localStorage.setItem(FAV_KEY, JSON.stringify(list));
const isFavorite = (id) => getFavorites().some(r => r.id_receta === id);
const toggleFavorite = (recipe) => {
  const list = getFavorites();
  const exists = list.some(r => r.id_receta === recipe.id_receta);
  const next = exists ? list.filter(r => r.id_receta !== recipe.id_receta) : [recipe, ...list];
  setFavorites(next);
};

// ======= Barra superior (título centrado + botones a la derecha) =======
function HeaderBar(){
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
        {/* Título centrado absoluto */}
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

        {/* Contenedor de botones a la derecha */}
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

// ======= Tarjeta de receta =======
function RecipeCard({ recipe, onToggle }){
  const fav = useMemo(()=>isFavorite(recipe.id_receta), [recipe.id_receta]);

  const header = recipe.foto_url
    ? <img src={recipe.foto_url} alt={recipe.titulo} style={{ width:"100%", height:180, objectFit:"cover" }} />
    : null;

  const footer = (
    <div className="flex justify-content-between align-items-center">
      <small className="text-600">{recipe.username || "Autor"}</small>
      <Button
        icon={fav ? "pi pi-heart-fill" : "pi pi-heart"}
        label={fav ? "Quitar" : "Favorito"}
        onClick={()=>onToggle(recipe)}
        size="small"
        severity={fav ? "danger" : "help"}
        outlined={!fav}
      />
    </div>
  );

  return (
    <Card title={recipe.titulo} subTitle={recipe.descripcion}
          header={header} footer={footer}
          className="m-2" style={{ width: 300, borderRadius: 14 }} />
  );
}

// ======= Página Home (simple, sin backend) =======
export default function Home(){
  // recetas demo (públicas)
  const [all, setAll] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    setAll([
      { id_receta: 1, titulo:"Pasta al pesto", descripcion:"Fresca y aromática", foto_url:"https://picsum.photos/seed/pesto/400/240", username:"ana" },
      { id_receta: 2, titulo:"Limonada", descripcion:"Con hierbabuena",  foto_url:"https://picsum.photos/seed/limon/400/240",  username:"carlos" },
      { id_receta: 3, titulo:"Tacos de pollo", descripcion:"Con salsa verde", foto_url:"https://picsum.photos/seed/tacos/400/240", username:"luis" },
      { id_receta: 4, titulo:"Brownies", descripcion:"Chocolate intenso",   foto_url:"https://picsum.photos/seed/brownie/400/240", username:"maría" },
      { id_receta: 5, titulo:"Ensalada César", descripcion:"Clásica y ligera", foto_url:"https://picsum.photos/seed/cesar/400/240", username:"sofi" },
    ]);
  }, []);

  // filtro por búsqueda
  const items = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return all;
    return all.filter(r =>
      (r.titulo || "").toLowerCase().includes(text) ||
      (r.descripcion || "").toLowerCase().includes(text) ||
      (r.username || "").toLowerCase().includes(text)
    );
  }, [all, q]);

  const handleToggle = (recipe) => {
    toggleFavorite(recipe);
    setAll(prev => [...prev]); // re-render para actualizar el icono
  };

  return (
    <div className="p-2">
      <HeaderBar />

      {/* buscador */}
      <div className="flex gap-2 mb-3">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Buscar recetas (título, autor, descripción)…"
          />
        </span>
      </div>

      {/* grid de recetas */}
      <div className="flex flex-wrap">
        {items.map(r => (
          <RecipeCard key={r.id_receta} recipe={r} onToggle={handleToggle} />
        ))}
        {items.length === 0 && (
          <p className="text-600 m-3">No hay resultados con “{q}”.</p>
        )}
      </div>
    </div>
  );
}
