#!/bin/bash

# PolyEdge Launch Script
# Starts the Backend (FastAPI) and Frontend (Next.js)

# Set up colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}   POLYEDGE GOD-TIER PLATFORM LAUNCHER    ${NC}"
echo -e "${BLUE}==========================================${NC}"

# Check for backend virtual environment
if [ ! -d "venv" ]; then
    echo -e "${RED}Error: Backend virtual environment (venv) not found.${NC}"
    echo "Run scripts/setup_environment.sh first."
    exit 1
fi

# 1. Start Backend (Background)
echo -e "${GREEN}[1/2] Starting PolyEdge Backend (FastAPI)...${NC}"
source venv/bin/activate
# Install missing backend dependencies if any
pip install fastapi uvicorn supabase python-dotenv pydantic pydantic-settings requests pandas -q

# Start FastAPI on port 8000
PYTHONPATH=. uvicorn backend.main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Give backend a moment to start
sleep 2

# 2. Start Frontend
echo -e "${GREEN}[2/2] Starting PolyEdge Frontend (Next.js)...${NC}"
cd frontend
# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install -q
fi

# Start Next.js on port 3000
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo -e "${BLUE}==========================================${NC}"
echo -e "${GREEN}SUCCESS: Platform is coming online!${NC}"
echo -e "${BLUE}==========================================${NC}"
echo -e "Dashboard: ${NC}http://localhost:3000"
echo -e "API Docs:  ${NC}http://localhost:8000/docs"
echo -e "Landing:   ${NC}http://localhost:3000"
echo -e "${BLUE}==========================================${NC}"
echo "Press Ctrl+C to stop both servers."

# Trap Ctrl+C to kill both sub-processes
trap "kill $BACKEND_PID $FRONTEND_PID; echo -e '\nServers stopped.'; exit" INT
wait
