import requests

class ChemVizAPI:
    def __init__(self, base_url="http://127.0.0.1:8000/api"):
        self.base_url = base_url.rstrip("/")
        self.token = None

    def set_token(self, token):
        self.token = token

    def _headers(self):
        if self.token:
            return {"Authorization": f"Bearer {self.token}"}
        return {}

    def upload_csv(self, filepath):
        url = f"{self.base_url}/reports/upload/"
        with open(filepath, "rb") as f:
            files = {"file": f}
            response = requests.post(url, files=files, headers=self._headers())
        response.raise_for_status()
        return response.json()
