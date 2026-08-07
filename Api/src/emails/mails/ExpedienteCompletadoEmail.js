import React from "react"
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Column,
  Row,
  Text,
} from "@react-email/components"
import { brandTheme } from "../../config/theme.config.js"

export const ExpedienteCompletadoEmail = ({
  requestId = "",
  userId = "",
  presetTitle = "",
  assignedAdminEmail = "",
  completionDate = "",
  uploads = [],
}) => {
  const previewText = `El expediente ${requestId || ""} fue completado y contiene ${uploads.length} archivo(s) subido(s).`

  const styles = {
    body: {
      backgroundColor: brandTheme.colors.background,
      color: brandTheme.colors.foreground,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: "40px 0",
    },
    container: {
      backgroundColor: brandTheme.colors.card,
      border: `1px solid ${brandTheme.colors.border}`,
      borderRadius: brandTheme.radius,
      margin: "0 auto",
      padding: "40px",
      width: "560px",
    },
    heading: {
      color: brandTheme.colors.cardForeground,
      fontSize: "24px",
      fontWeight: "700",
      margin: "0 0 16px",
      textAlign: "center",
    },
    text: {
      color: brandTheme.colors.mutedForeground,
      fontSize: "15px",
      lineHeight: "24px",
      margin: "0 0 16px",
    },
    metaBox: {
      backgroundColor: brandTheme.colors.background,
      border: `1px solid ${brandTheme.colors.border}`,
      borderRadius: brandTheme.radius,
      padding: "20px",
      margin: "0 0 24px",
    },
    uploadCard: {
      backgroundColor: brandTheme.colors.background,
      border: `1px solid ${brandTheme.colors.border}`,
      borderRadius: brandTheme.radius,
      padding: "16px",
      marginBottom: "12px",
    },
    label: {
      color: brandTheme.colors.mutedForeground,
      fontSize: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      margin: "0 0 4px",
    },
    value: {
      color: brandTheme.colors.foreground,
      fontSize: "16px",
      fontWeight: "600",
      margin: "0 0 12px",
    },
    footer: {
      color: brandTheme.colors.mutedForeground,
      fontSize: "12px",
      textAlign: "center",
      marginTop: "24px",
    },
  }

  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(Preview, null, previewText),
    React.createElement(
      Body,
      { style: styles.body },
      React.createElement(
        Container,
        { style: styles.container },
        React.createElement(Heading, { style: styles.heading }, "Expediente completado"),
        React.createElement(
          Text,
          { style: styles.text },
          "Se completó el expediente y se adjuntó un archivo ZIP con los archivos subidos, conservados en la raíz del comprimido."
        ),
        React.createElement(
          Section,
          { style: styles.metaBox },
          React.createElement(Row, null,
            React.createElement(Column, { style: { paddingRight: "12px", width: "50%" } },
              React.createElement(Text, { style: styles.label }, "Expediente"),
              React.createElement(Text, { style: styles.value }, requestId || "-"),
              React.createElement(Text, { style: styles.label }, "Usuario"),
              React.createElement(Text, { style: styles.value }, userId || "-"),
              React.createElement(Text, { style: styles.label }, "Completado"),
              React.createElement(Text, { style: { ...styles.value, margin: 0 } }, completionDate || "-")
            ),
            React.createElement(Column, { style: { paddingLeft: "12px", width: "50%" } },
              React.createElement(Text, { style: styles.label }, "Preset / carpeta"),
              React.createElement(Text, { style: styles.value }, presetTitle || "-"),
              React.createElement(Text, { style: styles.label }, "Administrador asignado"),
              React.createElement(Text, { style: styles.value }, assignedAdminEmail || "-"),
              React.createElement(Text, { style: styles.label }, "Archivos subidos"),
              React.createElement(Text, { style: { ...styles.value, margin: 0 } }, String(uploads.length))
            )
          )
        ),
        React.createElement(Hr, { style: { borderColor: brandTheme.colors.border, margin: "32px 0" } }),
        React.createElement(
          Text,
          { style: { ...styles.text, marginBottom: "12px" } },
          "Archivos incluidos en el ZIP:"
        ),
        uploads.length > 0
          ? uploads.map((upload, index) => React.createElement(
              Section,
              { key: `${upload?.key || upload?.title || index}`, style: styles.uploadCard },
              React.createElement(Text, { style: styles.label }, `Archivo ${index + 1}`),
              React.createElement(Text, { style: styles.value }, upload?.title || "-"),
              upload?.description
                ? React.createElement(Text, { style: styles.text }, upload.description)
                : null,
              React.createElement(Text, { style: styles.label }, "Estado"),
              React.createElement(Text, { style: styles.value }, upload?.status || "-"),
              React.createElement(Text, { style: styles.label }, "Nombre del archivo"),
              React.createElement(Text, { style: { ...styles.value, margin: 0 } }, upload?.fileName || "-")
            ))
          : React.createElement(Text, { style: styles.text }, "No se encontró información de archivos subidos.")
      )
    )
  )
}