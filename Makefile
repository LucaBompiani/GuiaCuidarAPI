.PHONY: help dev

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev     - Start the Django development server"
	@echo "  make help    - Show this help message"

# Start development server
dev:
	@echo "Starting Django development server..."
	python manage.py runserver
