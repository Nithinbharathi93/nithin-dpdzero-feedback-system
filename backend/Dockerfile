FROM python:3.10-slim
WORKDIR ./backend/
COPY ./backend .
RUN pip install --no-cache-dir -r ./backend/requirements.txt
EXPOSE 3000
CMD ["python", "app.py"]
