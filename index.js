const WebSocket = require("ws");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
const path = require("path");

//Include Google Speech to Text
const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();

//Configure Transcription Request
const request = {
    config: {
        encoding: "MULAW",
        sampleRateHertz: 8000,
        languageCode: "de-DE"
    },
    interimResults: true
};

wss.on("connection", function connection(ws) {
    console.log("Neue Verbindung initiiert");

    let recognizeStream = null;

    ws.on("message", function incoming(message) {
        const msg = JSON.parse(message);
        switch (msg.event) {
            case "connected":
                console.log(`Neuer Anruf verbunden`);

                // Create Stream to the Google Speech to Text API
                recognizeStream = client
                    .streamingRecognize(request)
                    .on("error", console.error)
                    .on("data", data => {
                        console.log(data.results[0].alternatives[0].transcript);
                        wss.clients.forEach(client => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(
                                    JSON.stringify({
                                        event: "interim-transcription",
                                        text: data.results[0].alternatives[0].transcript
                                    })
                                );
                            }
                        });
                    });
                break;
            case "start":
                console.log(`Starte den Media-Stream ${msg.streamSid}`);
                break;
            case "media":
                // Write Media Packets to the recognize stream
                recognizeStream.write(msg.media.payload);
                break;
            case "stop":
                console.log(`Anruf beendet`);
                recognizeStream.destroy();
                break;
        }
    });
});

//Handle HTTP Request
app.get("/", (_, res) => res.sendFile(path.join(__dirname, "/index.html")));

app.post("/", (req, res) => {
    res.set("Content-Type", "text/xml");
    res.send(`
      <Response>
        <Start>
         <Stream url="wss://${req.headers.host}/"/>
        </Start>
        <Say language="de-DE">Hallo. Ich werde die Tonspur für die nächsten 60 Sekunden an einen WebSocket weiterstreamen.</Say>
        <Pause length="60" />
      </Response>`);
});

console.log("Gestartet auf Port 8080");
server.listen(8080);
