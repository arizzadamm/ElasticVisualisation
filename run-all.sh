#!/bin/bash

echo ""
echo "========================================"
echo "🌍 Norse Attack Map - All Options"
echo "========================================"
echo ""
echo "Choose what to run:"
echo ""
echo "1. Full Application (Demo Mode)"
echo "2. Full Application (Normal Mode)"
echo "3. Backend Only (Demo Mode)"
echo "4. Backend Only (Normal Mode)"
echo "5. Frontend Only"
echo "6. Test WebSocket"
echo "7. Exit"
echo ""
echo "========================================"
echo ""

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo ""
        echo "Starting Full Application in Demo Mode..."
        ./start-demo.sh
        ;;
    2)
        echo ""
        echo "Starting Full Application in Normal Mode..."
        ./start.sh
        ;;
    3)
        echo ""
        echo "Starting Backend Only in Demo Mode..."
        npm run dev:demo
        ;;
    4)
        echo ""
        echo "Starting Backend Only in Normal Mode..."
        npm run dev
        ;;
    5)
        echo ""
        echo "Starting Frontend Only..."
        cd frontend && npm start
        ;;
    6)
        echo ""
        echo "Opening WebSocket Test..."
        if command -v xdg-open &> /dev/null; then
            xdg-open test-websocket-demo.html
        elif command -v open &> /dev/null; then
            open test-websocket-demo.html
        else
            echo "Please open test-websocket-demo.html in your browser"
        fi
        echo ""
        echo "WebSocket test opened in browser"
        echo "Make sure backend is running first!"
        ;;
    7)
        echo ""
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "Invalid choice. Please run again."
        exit 1
        ;;
esac
