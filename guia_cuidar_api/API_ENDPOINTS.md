# Guia Cuidar API - Endpoints Documentation

This document describes all the available API endpoints for the Guia Cuidar application.

## Base URL
All endpoints are prefixed with `/api/v1/`

## Authentication Endpoints

### POST `/auth/signin`
Create a new user account (sign up)
- **Body**: `SignInRequest` (email, password, first_name, last_name)
- **Response**: `AuthResponse` with user data and tokens

### POST `/auth/login`
Authenticate user and return access tokens
- **Body**: `LoginRequest` (email, password)
- **Response**: `AuthResponse` with user data and tokens

### POST `/auth/logout`
Logout the current user
- **Response**: `AuthResponse` with success message

### GET `/auth/me`
Get current authenticated user information
- **Response**: User information object

## Depoimentos (Testimonials) Endpoints

### GET `/depoimentos/`
Get all approved testimonials
- **Response**: List of `DepoimentoResponsavel` objects
- **Authentication**: Not required (public endpoint)

### POST `/depoimentos/`
Create a new testimonial
- **Body**: `DepoimentoResponsavelCreate` (texto, categoria_id)
- **Response**: `DepoimentoResponsavel` object
- **Authentication**: Required

## Serviços (Services) Endpoints

### GET `/servicos/`
Get all service locations
- **Response**: List of `ServicoLocal` objects
- **Authentication**: Not required (public endpoint)

### GET `/servicos/tipos`
Get all service types
- **Response**: List of `TipoServico` objects
- **Authentication**: Not required (public endpoint)

## Estatísticas (Statistics) Endpoints

### GET `/estatisticas/`
Get all TEA statistical data
- **Response**: List of `DadosEstatisticosTEA` objects
- **Authentication**: Not required (public endpoint)

## Artigos (Articles) Endpoints

### GET `/artigos/`
Get all informative articles
- **Response**: List of `ArtigoInformativo` objects
- **Authentication**: Not required (public endpoint)

## Materiais (Materials) Endpoints

### GET `/materiais/`
Get all support materials
- **Response**: List of `MaterialDeApoio` objects
- **Authentication**: Not required (public endpoint)

### GET `/materiais/favoritos`
Get all favorite materials for the current user
- **Response**: List of `MaterialFavorito` objects
- **Authentication**: Required

### POST `/materiais/favoritar`
Add a material to favorites
- **Body**: `MaterialFavoritoCreate` (material_id, dependente_id)
- **Response**: `MaterialFavorito` object
- **Authentication**: Required

### DELETE `/materiais/favoritar/{material_id}/{dependente_id}`
Remove a material from favorites
- **Response**: `SuccessResponse` object
- **Authentication**: Required

### GET `/materiais/categorias`
Get all material categories
- **Response**: List of `CategoriaMaterial` objects
- **Authentication**: Not required (public endpoint)

### GET `/materiais/niveis-suporte`
Get all TEA support levels
- **Response**: List of `NivelSuporteTEA` objects
- **Authentication**: Not required (public endpoint)

## Health Check

### GET `/health`
Health check endpoint
- **Response**: `{"status": "healthy", "message": "Guia Cuidar API is running"}`

## Data Models

### DepoimentoResponsavel
- `id`: int
- `texto`: str
- `aprovado`: bool
- `responsavel_id`: str (UUID)
- `categoria_id`: int (optional)
- `data_criacao`: datetime

### ServicoLocal
- `id`: int
- `name`: str
- `endereco`: str (optional)
- `tipo_servico_id`: int (optional)
- `data_criacao`: datetime
- `data_atualizacao`: datetime

### MaterialDeApoio
- `id`: int
- `titulo`: str
- `corpo`: str (optional)
- `categoria_id`: int (optional)
- `nivel_suporte_tea_id`: int (optional)
- `data_criacao`: datetime
- `data_atualizacao`: datetime

### MaterialFavorito
- `responsavel_id`: str (UUID)
- `material_id`: int
- `dependente_id`: int
- `data_favoritado`: datetime

## Error Responses

All endpoints can return error responses with the following structure:
```json
{
    "message": "Error description",
    "error_code": "ERROR_CODE"
}
```

## Authentication

For endpoints that require authentication, include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

The access token is obtained from the `/auth/login` or `/auth/signin` endpoints.
