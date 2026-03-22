from fastapi import FastAPI
from api.routes import reservations, tables, guests

app = FastAPI()

app.include_router(reservations.router)
app.include_router(tables.router)
app.include_router(guests.router)