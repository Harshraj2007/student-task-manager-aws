#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
export MAVEN_USER_HOME="$DIR/../.m2"

echo "=========================================================="
echo " Starting Student Task & Assignment Manager (Full Stack)  "
echo "=========================================================="

echo "[1/2] Starting Spring Boot Backend API (Port 8080)..."
if [ -f "$DIR/backend/target/backend-0.0.1-SNAPSHOT.jar" ]; then
  java -jar "$DIR/backend/target/backend-0.0.1-SNAPSHOT.jar" &
else
  cd "$DIR/backend"
  ./mvnw spring-boot:run &
fi
BACKEND_PID=$!

trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID 2>/dev/null || true; exit 0" SIGINT SIGTERM

echo "Waiting for backend API to start..."
for i in {1..30}; do
  if curl -s http://localhost:8080/api/health >/dev/null 2>&1; then
    echo "✓ Spring Boot backend is UP on http://localhost:8080"
    break
  fi
  sleep 1
done

echo ""
echo "[2/2] Starting React Vite Frontend (Port 5173)..."
echo "👉 Open your browser at: http://localhost:5173"
echo "👉 Press Ctrl + C to stop both servers"
echo ""

cd "$DIR/frontend"
npm run dev
