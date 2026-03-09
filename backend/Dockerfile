FROM python:3.12-slim
WORKDIR /app
RUN pip install uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen
EXPOSE 8000
COPY . .
CMD ["uv","run","uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]