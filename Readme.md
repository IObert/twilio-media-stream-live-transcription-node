# Live Transcribing Phone Calls using Twilio Media Streams and Google Speech-to-Text

With Twilio Media Streams, you can now extend the capabilities of your Twilio-powered voice application with real time access to the raw audio stream of phone calls. For example, we can build tools that transcribe the speech from a phone call live into a browser window, run sentiment analysis of the speech on a phone call or even use voice biometrics to identify individuals.

## Blog Post
If you prefer a step by step guide through building this yourself, this blog post will guide you through transcribing speech from a phone call into text, live in the browser using Twilio and Google Speech-to-Text using Node.js.

[Visit the German blog post here](https://twilio.com/blog/anrufe-live-transkribieren)

[Visit the original post here](https://www.twilio.com/blog/live-transcribing-phone-calls-using-twilio-media-streams-and-google-speech-text)

---

## Prerequisites
Before we can get started, you’ll need to make sure to have:

- A [Free Twilio Account](https://www.twilio.com/try-twilio)
- A [Google Cloud Account](https://cloud.google.com/)
- Install [ngrok](https://ngrok.com/)

**Optional:** - Install the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart)

---

## Setup

1.  Setup Google Project and retrieve service account key via the [Cloud Console](https://console.cloud.google.com/) or the [Cloud SDK](https://cloud.google.com/sdk/docs/)

    a. Create a new GCP Project

    b. Enable the Google Speech-To-Text API for that project

    c. Create a service account.

    d. Create a private key as JSON.

    e. Download the key and add it as `key.json`.

2.  Buy a number either via the [Twilio Console](https://www.twilio.com/console/phone-numbers/search) or use the Twilio CLI with the following commands:

    > For German numbers you need to create a [regulatory bundle](https://www.twilio.com/docs/phone-numbers/regulatory/getting-started/console-create-new-bundle) before as there are [country-specific guidlines](https://www.twilio.com/guidelines/de/regulatory) in place.

    Find a Phone Number (_I have used the `DE` country code to buy a mobile number, but feel free to change this for a [number local to you](https://support.twilio.com/hc/en-us/articles/223183068-Twilio-international-phone-number-availability-and-their-capabilities)._)

    `twilio api:core:available-phone-numbers:mobile:list --country-code DE`

    Buy a Phone Number 

    ```
    twilio api:core:incoming-phone-numbers:create --bundle-sid=BUxxxx \n
      --address-sid=ADxxxx --friendly-name=cli-purchase \n 
      --phone-number=<Number from the previous output>
    ```


3. Start ngrok with the following command

    `$ ngrok http 8080`

4.  Copy the forwarding HTTPS URL (https://xxxxx.ngrok.io) and set your Twilio number to this URL in the Twilio Console or via the CLI:

    `$ twilio phone-numbers:update <TWILIO_NUMBER> --voice-url https://xxxxxxxx.ngrok.io`

    Install dependencies and start your server:

5. Install the dependecies and start the application:

    ```
    $ npm install
    $ npm start
    ```

6. Last but not least, access the <http://localhost:8080> and call the number you bought.
