#!/bin/bash

echo ""
echo "========================================"
echo "🌍 Norse Attack Map"
echo "========================================"
echo ""
echo "Choose mode:"
echo ""
echo "1. Demo Mode (Simulated Data)"
echo "2. Normal Mode (Elasticsearch)"
echo "3. Exit"
echo ""
echo "========================================"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Starting Demo Mode..."
        ./start-demo.sh
        ;;
    2)
        echo ""
        echo "Starting Normal Mode..."
        ./start.sh
        ;;
    3)
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