--
--
ALTER ROLE authenticator SET pgrst.jwt.claims.role = 'role';
ALTER ROLE authenticator SET pgrst.jwt.claims.exp = 'exp';

-- Defina as configurações de JWT para o PostgREST
-- (Valores do seu .env já inseridos)
ALTER ROLE authenticator SET pgrst.db.jwt.secret = '5486zsd5as7casca6scqw645cAs54cq8';
ALTER ROLE authenticator SET pgrst.db.jwt.exp = 3600;

ALTER ROLE authenticator SET pgrst.app.settings.jwt_secret = '5486zsd5as7casca6scqw645cAs54cq8';
ALTER ROLE authenticator SET pgrst.app.settings.jwt_exp = 3600;