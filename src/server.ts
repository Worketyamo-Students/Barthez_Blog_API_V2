// src/server.ts
// Configurations de Middlewares
import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './swagger';
import morgan from 'morgan';
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import user from './routes/users-route';
import { envs } from './core/config/env';


const app = express();

// Securisations

// Configurations de securité
app.use(helmet()) //Pour configurer les entete http securisés

app.use(cors({
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization']
})) // Pour gerer le partage des ressources de maniere securisée

// Configuration globaux de l'application express
app.use(express.json()); // parser les requets json
app.use(express.urlencoded({ extended: true })); // parser les requetes url encoder
app.use(compression()); //compression des requetes http
app.use(
	rateLimit({
		max: envs.MAX_GLOBAL_QUERY_NUMBER,
		windowMs: envs.MAX_GLOBAL_QUERY_WINDOW,
		message: 'Trop de Requete à partir de cette adresse IP !'
	})
);//limite le nombre de requete
app.use(cookieParser()); //configuration des cookies (JWT)

app.use(morgan('combined'));// Journalisation des requetes au format combined



// Routes du programme
app.use(
	"/users",
	rateLimit({
		max: envs.MAX_UNIQ_QUERY_NUMBER,
		windowMs: envs.MAX_UNIQ_QUERY_WINDOW,
		message: "Trop de requete à partir de cette addresse IP sur ce endPoint !"
	}),
	user
);

// Journalisations
app.use(morgan('combined'));

// Documentation
setupSwagger(app);

// Export application to app file
export default app;
