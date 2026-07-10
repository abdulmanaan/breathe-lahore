from fastapi import FastAPI

app = FastAPI(
    title="BreatheLahore API",
    description="Air quality intelligence for Lahore - trends, insights, and health guidance.",
    version="0.1.0"
)

@app.get("/health")
def health_check():
    """Simple endpoint to confirm the API is running."""
    return {"status": "ok"}
