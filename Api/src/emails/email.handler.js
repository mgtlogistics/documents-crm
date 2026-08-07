import { render } from "@react-email/render"
import React from "react"

import { transporter } from "../config/email.config.js"

import { ExpedienteCompletadoEmail } from "./mails/ExpedienteCompletadoEmail.js"
import { WelcomeEmail } from "./mails/WelcomeEmail.js"

export const sendWelcomeEmail = async (client, brand) => {
  try {
    const clientName = [client?.profile?.names, client?.profile?.lastNames]
      .filter(Boolean)
      .join(" ") || client?.username

    const username = client?.username
    const defaultPassword = client?.username

    const emailHtml = await render(
      React.createElement(WelcomeEmail, {
        clientName,
        username,
        password: defaultPassword,
        brandName: brand?.name,
        brandEmail: brand?.email,
        brandPhone: brand?.phone,
        brandLogo: brand?.logo,
      })
    )

    const info = await transporter.sendMail({
      from: `"${brand?.name || "Tu Empresa"}" <${process.env.EMAIL_FROM}>`,
      to: client.email,
      subject: `Bienvenido a ${brand?.name || "nuestro gimnasio"}, ${clientName}`,
      html: emailHtml,
    });

    console.log("Mensaje enviado: %s", info.messageId);
    return info;

  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
}

export const sendNewSubscriptionEmail = async (client, subscription, brand) => {

}

export const sendDocumentRequestCompletedEmail = async (documentRequest, zipBuffer, zipFileName) => {
  const completionDate = documentRequest?.zipSentAt
    ? new Date(documentRequest.zipSentAt).toLocaleString("es-MX")
    : new Date().toLocaleString("es-MX")

  const uploads = Array.isArray(documentRequest?.uploads)
    ? documentRequest.uploads.map((upload) => ({
        title: upload?.uploadCatalogId?.title || upload?.uploadCatalogId?.key || upload?.uploadCatalogId || "Archivo",
        key: upload?.uploadCatalogId?.key || "",
        description: upload?.uploadCatalogId?.description || "",
        status: upload?.status || "",
        fileName: upload?.fileName || "",
        uploadedAt: upload?.uploadedAt || null,
      }))
    : []

  const emailHtml = await render(
    React.createElement(ExpedienteCompletadoEmail, {
      requestId: documentRequest?._id,
      userId: documentRequest?.userId,
      presetTitle: documentRequest?.presetId?.title || "",
      assignedAdminEmail: documentRequest?.assignedAdminEmail || "",
      completionDate,
      uploads,
    })
  )

  return transporter.sendMail({
    from: `"${process.env.EMAIL_NAME || "Tu Empresa"}" <${process.env.EMAIL_FROM}>`,
    to: documentRequest?.assignedAdminEmail,
    subject: `Expediente completado ${documentRequest?._id || ""}`.trim(),
    html: emailHtml,
    attachments: [
      {
        filename: zipFileName,
        content: zipBuffer,
      },
    ],
  })
}