// src/pages/Crear.js
import React, { useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

const USER_RECIPES_KEY = "user_recipes";

// Helpers
const getMyRecipes = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_RECIPES_KEY) || "[]");
  } catch {
    return [];
  }
};
const saveMyRecipes = (list) => localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(list));

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
            onClick={() => nav("/crear")}
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
            onClick={() => nav("/login")}
            severity="danger"
            className="p-button-sm"
          />
        </div>
      </div>
    </Card>
  );
}

// ======= Página de Crear receta =======
export default function Crear() {
  const nav = useNavigate();
  const toast = useRef(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const fileRef = useRef(null);

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFilePreview(ev.target?.result || "");
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!titulo.trim() || !descripcion.trim() || !cuerpo.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Campos incompletos",
        detail: "Debes llenar todos los campos para crear tu receta.",
      });
      return;
    }

    const nueva = {
      id_receta: Date.now(),
      titulo,
      descripcion,
      cuerpo,
      foto_url: filePreview || "https://via.placeholder.com/400x240?text=Sin+imagen",
      username: "Tú",
    };

    const recetas = getMyRecipes();
    recetas.unshift(nueva);
    saveMyRecipes(recetas);

    toast.current.show({
      severity: "success",
      summary: "Receta creada",
      detail: "Tu receta fue guardada y compartida.",
    });

    // limpiar formulario
    setTitulo("");
    setDescripcion("");
    setCuerpo("");
    setFilePreview("");
  };

  return (
    <div className="p-2">
      <HeaderBar />
      <Toast ref={toast} />

      {/* Título + botón volver */}
      <div className="flex align-items-center justify-content-between mb-3">
        <h3 className="m-0" style={{ color: "#2e7d32" }}>
          Crear y compartir receta 🍳
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

      {/* Formulario */}
      <Card
        className="shadow-4"
        style={{
          maxWidth: 700,
          margin: "0 auto",
          borderRadius: 16,
          background: "rgba(255,255,255,0.96)",
        }}
      >
        <form onSubmit={handleSave} className="flex flex-column gap-3">
          <span className="p-float-label">
            <InputText
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full"
            />
            <label htmlFor="titulo">Título de la receta</label>
          </span>

          <span className="p-float-label">
            <InputText
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full"
            />
            <label htmlFor="descripcion">Descripción corta</label>
          </span>

          <span className="p-float-label">
            <InputTextarea
              id="cuerpo"
              rows={5}
              value={cuerpo}
              onChange={(e) => setCuerpo(e.target.value)}
              className="w-full"
            />
            <label htmlFor="cuerpo">Preparación / Detalles</label>
          </span>

          {/* Subir imagen */}
          <div className="flex flex-column gap-2">
            <small className="text-600">Foto (opcional)</small>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPickFile}
              style={{ display: "none" }}
            />
            <Button
              type="button"
              label="Subir imagen"
              icon="pi pi-upload"
              onClick={() => fileRef.current?.click()}
              severity="success"
              outlined
              className="p-button-sm w-fit"
            />
            {filePreview && (
              <img
                src={filePreview}
                alt="preview"
                style={{
                  width: "100%",
                  maxWidth: 320,
                  borderRadius: 12,
                  border: "1px solid #c5e1a5",
                }}
              />
            )}
          </div>

          <Button
            type="submit"
            label="Guardar y compartir"
            icon="pi pi-check"
            severity="success"
          />
        </form>
      </Card>
    </div>
  );
}
