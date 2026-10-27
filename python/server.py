"""
==========================================================================
SMARTFIT - Python Microservice API Server
Zero-dependency HTTP REST API for BMI & Biometrics calculations.
Runs directly with Python 3 standard library (no pip packages needed).
==========================================================================
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
from bmi_calculator import BMICalculator
from measurements import MeasurementsService


class HealthAPIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        # CORS support for web frontend integration
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/" or parsed.path == "/health":
            self._set_headers(200)
            res = {
                "status": "healthy",
                "service": "SmartFit Python Health & Biometrics Service",
                "version": "1.0.0",
                "endpoints": [
                    "POST /api/bmi",
                    "POST /api/measurements"
                ]
            }
            self.wfile.write(json.dumps(res, indent=2).encode("utf-8"))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            payload = json.loads(body.decode("utf-8")) if body else {}
        except Exception:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": "Invalid JSON body"}).encode("utf-8"))
            return

        if parsed.path == "/api/bmi":
            try:
                unit = payload.get("unit", "metric")
                if unit == "imperial":
                    height = float(payload.get("height", 69))
                    weight = float(payload.get("weight", 154))
                    result = BMICalculator.calculate_imperial(height, weight)
                else:
                    height = float(payload.get("height", 175))
                    weight = float(payload.get("weight", 70))
                    result = BMICalculator.calculate_metric(height, weight)

                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "data": result}).encode("utf-8"))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))

        elif parsed.path == "/api/measurements":
            try:
                result = MeasurementsService.calculate_biometrics(
                    age=int(payload.get("age", 26)),
                    gender=str(payload.get("gender", "male")),
                    height_cm=float(payload.get("height", 178)),
                    weight_kg=float(payload.get("weight", 71)),
                    activity_level=str(payload.get("activity_level", "moderate")),
                    goal=str(payload.get("goal", "maintain")),
                    diseases=payload.get("diseases", ["none"])
                )
                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "data": result}).encode("utf-8"))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))


def run(port=8000):
    server_address = ("", port)
    httpd = HTTPServer(server_address, HealthAPIHandler)
    print(f"🚀 SmartFit Python API Server running at http://localhost:{port}/")
    print(f"   - POST http://localhost:{port}/api/bmi")
    print(f"   - POST http://localhost:{port}/api/measurements")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()


if __name__ == "__main__":
    run(8000)
