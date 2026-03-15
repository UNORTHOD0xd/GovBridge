package com.govbridge.service;

import com.govbridge.model.Citizen;
import com.govbridge.model.Document;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
public class CertificateService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("MMMM d, yyyy");

    public byte[] generatePdf(Document document, Citizen citizen) throws Exception {
        String qrDataUri = generateQrDataUri("https://govbridge.app/verify?hash=" + document.getDocHash());
        String html = buildHtml(document, citizen, qrDataUri);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.useFastMode();
        builder.withHtmlContent(html, null);
        builder.toStream(out);
        builder.run();
        return out.toByteArray();
    }

    private String generateQrDataUri(String text) throws Exception {
        var matrix = new QRCodeWriter().encode(text, BarcodeFormat.QR_CODE, 200, 200);
        var image = MatrixToImageWriter.toBufferedImage(matrix);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(baos.toByteArray());
    }

    private String formatDocType(String docType) {
        return switch (docType) {
            case "tax_compliance" -> "Tax Compliance Certificate";
            case "birth_cert" -> "Birth Certificate Extract";
            case "police_record" -> "Police Record Check";
            default -> docType.replace("_", " ");
        };
    }

    private String buildHtml(Document document, Citizen citizen, String qrDataUri) {
        String truncatedHash = document.getDocHash().length() > 18
                ? document.getDocHash().substring(0, 10) + "..." + document.getDocHash().substring(document.getDocHash().length() - 6)
                : document.getDocHash();

        return """
                <!DOCTYPE html>
                <html>
                <head>
                <style>
                @page { size: A4; margin: 0; }
                body {
                    font-family: Helvetica, Arial, sans-serif;
                    margin: 0; padding: 0;
                    color: #1a1a1a;
                }
                .page {
                    width: 210mm; min-height: 297mm;
                    padding: 30mm 25mm;
                    box-sizing: border-box;
                    position: relative;
                }
                .border-frame {
                    border: 3px solid #166534;
                    border-radius: 4px;
                    padding: 25mm 20mm;
                    min-height: 220mm;
                    position: relative;
                }
                .header {
                    text-align: center;
                    margin-bottom: 15mm;
                    border-bottom: 2px solid #166534;
                    padding-bottom: 10mm;
                }
                .header h1 {
                    font-size: 28pt;
                    color: #166534;
                    margin: 0 0 3mm 0;
                    letter-spacing: 2px;
                }
                .header h2 {
                    font-size: 12pt;
                    color: #4b5563;
                    margin: 0;
                    font-weight: normal;
                    letter-spacing: 1px;
                }
                .subtitle {
                    text-align: center;
                    font-size: 18pt;
                    color: #1f2937;
                    margin: 10mm 0 15mm 0;
                    font-weight: bold;
                }
                .details {
                    margin: 0 auto;
                    width: 85%%;
                }
                .detail-row {
                    display: block;
                    margin-bottom: 6mm;
                    padding-bottom: 4mm;
                    border-bottom: 1px solid #e5e7eb;
                }
                .detail-label {
                    font-size: 9pt;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 2mm;
                }
                .detail-value {
                    font-size: 13pt;
                    color: #111827;
                    font-weight: 600;
                }
                .qr-section {
                    text-align: center;
                    margin-top: 15mm;
                }
                .qr-section img {
                    width: 40mm;
                    height: 40mm;
                }
                .qr-caption {
                    font-size: 8pt;
                    color: #6b7280;
                    margin-top: 3mm;
                }
                .footer {
                    text-align: center;
                    margin-top: 15mm;
                    padding-top: 8mm;
                    border-top: 2px solid #166534;
                }
                .footer p {
                    font-size: 8pt;
                    color: #6b7280;
                    margin: 1mm 0;
                }
                .chain-badge {
                    display: inline-block;
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    border-radius: 3px;
                    padding: 2mm 5mm;
                    font-size: 8pt;
                    color: #166534;
                    margin-top: 3mm;
                }
                </style>
                </head>
                <body>
                <div class="page">
                <div class="border-frame">
                    <div class="header">
                        <h1>GOVBRIDGE</h1>
                        <h2>Government of Jamaica — Unified Services Portal</h2>
                    </div>

                    <div class="subtitle">%s</div>

                    <div class="details">
                        <div class="detail-row">
                            <div class="detail-label">Issued To</div>
                            <div class="detail-value">%s</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Parish</div>
                            <div class="detail-value">%s</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Issuing Agency</div>
                            <div class="detail-value">%s</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Date of Issue</div>
                            <div class="detail-value">%s</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Document Hash</div>
                            <div class="detail-value" style="font-family: monospace; font-size: 11pt;">%s</div>
                        </div>
                    </div>

                    <div class="qr-section">
                        <img src="%s" />
                        <div class="qr-caption">Scan to verify this document on-chain</div>
                    </div>

                    <div class="footer">
                        <div class="chain-badge">Verified on Base Sepolia — Chain ID 84532</div>
                        <p>This document was cryptographically anchored to the blockchain and can be independently verified.</p>
                        <p>GovBridge — Bridging Citizens to Government Services</p>
                    </div>
                </div>
                </div>
                </body>
                </html>
                """.formatted(
                formatDocType(document.getDocType().name()),
                escapeHtml(citizen.getName()),
                escapeHtml(citizen.getParish()),
                escapeHtml(document.getAgency()),
                document.getIssuedAt().format(DATE_FMT),
                truncatedHash,
                qrDataUri
        );
    }

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
