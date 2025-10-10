import React, { useRef, useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import API_ROUTES from "../Config/apiRoutes";

// ======= Barra superior (reutilizada de Home) =======
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
            label="Crear receta"
            icon="pi pi-plus"
            onClick={() => nav("/nueva")}
            severity="success"
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

// ======= Página Crear Receta =======
export default function Crear() {
  const nav = useNavigate();
  const toast = useRef(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  // ✅ Cargar sesión desde localStorage
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userSession");
    if (stored) {
      try {
        setUserSession(JSON.parse(stored));
      } catch {
        localStorage.removeItem("userSession");
        nav("/");
      }
    } else {
      nav("/");
    }
  }, [nav]);

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFilePreview(ev.target?.result || "");
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!userSession?.id_usuario || !userSession?.token) {
      toast.current.show({
        severity: "error",
        summary: "Sesión requerida",
        detail: "Debes iniciar sesión antes de crear recetas.",
      });
      return;
    }

    if (!titulo.trim() || !descripcion.trim() || !cuerpo.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Campos incompletos",
        detail: "Debes llenar todos los campos para crear tu receta.",
      });
      return;
    }

    setLoading(true);

    const payload = {
      id_usuario: userSession.id_usuario,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      cuerpo: cuerpo.trim(),
      foto_url: filePreview ? `${titulo.replace(/\s+/g, "_")}_foto.png` : "",
      visibilidad: "public",
    };

    try {
      const response = await fetch(API_ROUTES.RECIPES.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userSession.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("📤 Respuesta al crear receta:", data);

      if (!response.ok) throw new Error(data.message || "Error al guardar receta");

      toast.current.show({
        severity: "success",
        summary: "Receta creada",
        detail: "Tu receta fue guardada correctamente 🍳",
      });

      setTitulo("");
      setDescripcion("");
      setCuerpo("");
      setFilePreview("");

      setTimeout(() => nav("/home"), 1200);
    } catch (error) {
      console.error("❌ Error al guardar receta:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "No se pudo guardar la receta",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔒 Protección visual si no hay sesión
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
      <Toast ref={toast} />

      <Card
        className="shadow-4"
        style={{
          maxWidth: 700,
          margin: "0 auto",
          borderRadius: 16,
          background: "rgba(255,255,255,0.96)",
        }}
        title={
          <div className="flex justify-content-between align-items-center">
            <h3 style={{ color: "#2e7d32" }}>Crear y compartir receta 🍳</h3>
            <small style={{ color: "#8d6e63" }}>
              Usuario: <b>{userSession.username}</b> (ID: {userSession.id_usuario})
            </small>
          </div>
        }
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
            label={loading ? "Guardando..." : "Guardar y compartir"}
            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
            severity="success"
            disabled={loading}
          />
        </form>
      </Card>
    </div>
  );
}
