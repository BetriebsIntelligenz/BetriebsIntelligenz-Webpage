# N8N Website Agent Configuration (Fix für Fehler 500 & CORS)

Wenn Sie Fehler wie `500` oder `Failed to fetch` erhalten, liegt das meist an einer fehlenden Antwort-Konfiguration im Workflow oder fehlenden CORS-Headern.

**Webhook URL:** `https://n8n.srv1089373.hstgr.cloud/webhook/92b6a763-0d59-4cd2-b533-c85dd5227496`

---

## SCHRITT 1: Workflow Reparieren (Fehler 500 beheben)

### Fehler: "Unused Respond to Webhook node found in the workflow"
Stellen Sie sicher, dass der **Webhook** Node (Trigger) auf **"Using 'Respond to Webhook' Node"** eingestellt ist.

---

## SCHRITT 2: Respond Node Konfiguration (WICHTIG!)

**Problem:** Wenn Sie im Respond Node **"All Incoming Items"** wählen, sendet n8n die rohe, extrem verschachtelte Struktur von Google Gemini (Array -> Content -> Parts -> Text). Das Frontend erwartet aber einfaches JSON.

**LÖSUNG:**
Konfigurieren Sie den **Respond to Webhook** Node exakt so:

1.  **Respond With:** `JSON`
2.  **Response Body:**
    ```json
    {
      "text": "{{ $json.content.parts[0].text }}"
    }
    ```

*Erklärung:* Die Expression `{{ $json.content.parts[0].text }}` holt den eigentlichen Text aus der verschachtelten Gemini-Antwort und packt ihn in das Feld `text`, das die Webseite versteht.

---

## SCHRITT 3: CORS Konfiguration (Fehler "Failed to fetch" beheben)

Wenn der Browser "Failed to fetch" meldet, blockiert er die Anfrage aus Sicherheitsgründen.

Umgebungsvariablen in der n8n-Instanz:

```env
N8N_Editor_BASE_URL=https://n8n.srv1089373.hstgr.cloud
WEBHOOK_URL=https://n8n.srv1089373.hstgr.cloud
WEBHOOK_CORS_ORIGIN=*
```

---

## SCHRITT 4: Testen

1.  Workflow auf "Active" setzen.
2.  Im Chat schreiben.
3.  Die Antwort sollte nun erscheinen (nicht mehr "Keine Textantwort erhalten").

### Erforderlicher Output JSON Payload (vom Respond Node)
```json
{
  "text": "Markdown Antworttext..."
}
```
