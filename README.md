# GPT-4 Email Support for Chrome Extension

This Chrome extension uses GPT-4 to read and answer support emails in Gmail, utilizing documents to answer specific emails characterized only for your company. It automatically generates responses for emails by utilizing a separate backend API built with Django. The extension adds a "Generate Response" button to Gmail's interface, which, when clicked, sends the email content to the backend API. The API processes the email and returns a generated response, which is then inserted into the reply composer of the same email thread.

## Prerequisites

- Google Chrome Browser
- A running instance of the Django backend API clone https://github.com/vshulya/support_guy_backend.git

## Setup for backend

1. Clone this repository to your local machine.

```bash
git clone https://github.com/yourusername/yourrepo.git
```
2. Install the required Python packages

```bash
pip install -r requirements.txt
```

3. Change the name of example env to .env and replace your_openai_api_key_here with your actual OpenAI API key and your_django_secret_key_here with your django secret key.

4. Run the Django server 
```bash
python manage.py runserver
```
The backend API is now running and ready to receive requests from the Chrome extension.

## Setup for chrome extension

1. Clone this repository to your local machine.
```bash
git clone https://github.com/vshulya/support_guy.git
```

2. Open Google Chrome, and navigate to `chrome://extensions`.

3. Enable "Developer mode" by toggling the switch in the top right corner.

4. Click the "Load unpacked" button and select the directory you cloned in step 1.

5. The Gmail Auto-Responder extension should now be visible in your list of Chrome extensions.

6. Ensure that the backend API is running and accessible. Update the `apiURL` variable in the `background.js` file with the correct API endpoint.

const apiURL = "http://127.0.0.1:8000/generate_response/";


## Usage
Once the server is running:

1. Open Gmail in Google Chrome.

2. Navigate to an email thread.

3. Click the "Generate Response" button that appears below the email content.

4. Wait for the response to be generated and inserted into the reply composer.

4. Review the generated response and click "Send" to send the email.

## License
This project is licensed under the MIT License.