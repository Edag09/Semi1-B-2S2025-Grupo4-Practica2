// src/pages/Crear.js
import React, { useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useLocation, useNavigate } from "react-router-dom";
import API_ROUTES from "../Config/apiRoutes";

export default function Crear() {
  const nav = useNavigate();
  const location = useLocation();
  const toast = useRef(null);

  // Obtener el usuario desde Home o localStorage
  const userSession = location.state?.userSession || JSON.parse(localStorage.getItem("userSession") || "{}");
  const { token, id_usuario, username } = userSession;

  console.log("🍳 Datos en Crear:", userSession);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFilePreview(ev.target?.result || "");
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!id_usuario || !token) {
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
        detail: "Completa todos los campos.",
      });
      return;
    }

    setLoading(true);

    const payload = {
      id_usuario,
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
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

      setTimeout(() => nav("/home", { state: { userSession } }), 1000);
    } catch (err) {
      console.error("❌ Error al guardar receta:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "No se pudo guardar la receta",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <Card
        title={<h2 style={{ color: "#2e7d32" }}>Crear receta — {username || "Usuario"}</h2>}
        className="shadow-4"
        style={{ maxWidth: 700, margin: "0 auto", borderRadius: 16 }}
      >
        <form onSubmit={handleSave} className="flex flex-column gap-3">
          <InputText id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título de la receta" />
          <InputText id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción corta" />
          <InputTextarea id="cuerpo" rows={5} value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} placeholder="Preparación / Detalles" />

          <div>
            <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} style={{ display: "none" }} />
            <Button
              type="button"
              label="Subir imagen"
              icon="pi pi-upload"
              onClick={() => fileRef.current?.click()}
              severity="success"
              outlined
              className="p-button-sm w-fit mb-2"
            />
            {filePreview && <img src={filePreview} alt="preview" style={{ width: "100%", maxWidth: 300, borderRadius: 12 }} />}
          </div>

          <Button
            type="submit"
            label={loading ? "Guardando..." : "Guardar receta"}
            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
            severity="success"
            disabled={loading}
          />
        </form>
      </Card>
    </div>
  );
}
